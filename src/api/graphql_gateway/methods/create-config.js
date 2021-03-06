const IdioError = require("../../idio-error.js");
const GraphQLNode = require("../../graphql_node/graphql-node.js");
const { checkInstance } = require("../../../util/index.js");
const {
    IdioScalar,
    IdioEnum,
    IdioDirective,
    IdioInterface,
    IdioUnion,
    GraphQLType
} = require("../../appliances/index.js");

/**
 * @typedef {import('../../../../index').Locals} Locals
 * @typedef {import('../../../../index').Services} Services
 */

/**
 * @param {Services} services
 * @returns {Services}
 */
function validateServices(services = {}) {
    if (!(typeof services === "object")) {
        throw new IdioError("services must be of type object.");
    }

    const {
        nodes,
        enums,
        interfaces,
        unions,
        types,
        directives,
        scalars
    } = services;

    if (directives) {
        throw new IdioError(`services.directives not supported`);
    }

    if (scalars) {
        throw new IdioError(`services.scalars not supported`);
    }

    return Object.entries({ nodes, enums, interfaces, unions, types }).reduce(
        (result, [key, values = []]) => {
            if (!Array.isArray(values)) {
                throw new IdioError(`services.${key} must be of type array`);
            }

            values.forEach((value, index) => {
                if (!(typeof value === "string")) {
                    throw new IdioError(
                        `services.${key}[${index}] must be of type string.`
                    );
                }
            });

            return { ...result, [key]: values };
        },
        {}
    );
}

/**
 *
 * @param {Locals} locals
 * @returns {Locals}
 */
function validateLocals(locals = {}) {
    if (!(typeof locals === "object")) {
        throw new IdioError("locals must be of type object.");
    }

    let {
        nodes,
        enums,
        scalars,
        directives,
        interfaces,
        unions,
        types,
        schemaGlobals = []
    } = locals;

    if (typeof schemaGlobals === "string") {
        schemaGlobals = [schemaGlobals];
    }

    return {
        schemaGlobals,
        ...Object.entries({
            nodes: { instances: nodes, of: GraphQLNode },
            enums: { instances: enums, of: IdioEnum },
            scalars: { instances: scalars, of: IdioScalar },
            directives: { instances: directives, of: IdioDirective },
            interfaces: { instances: interfaces, of: IdioInterface },
            unions: { instances: unions, of: IdioUnion },
            types: { instances: types, of: GraphQLType }
        }).reduce((result, [key, { instances = [], of }]) => {
            if (!Array.isArray(instances)) {
                throw new IdioError(`locals.${key} must be of type array.`);
            }

            instances.forEach((instance, index) =>
                checkInstance({
                    instance,
                    of,
                    name: `locals.${key}[${index}]`
                })
            );

            return {
                ...result,
                [key]: instances
            };
        }, {})
    };
}

/**
 * @param {{services: Services, locals: Locals}} config
 */
function createConfig(config) {
    if (!config) {
        throw new IdioError("config required.");
    }

    if (!(typeof config === "object")) {
        throw new IdioError("config must be of type object.");
    }

    const services = validateServices(config.services);

    const locals = validateLocals(config.locals);

    if (!services.nodes.length && !locals.nodes.length) {
        throw new IdioError(
            `no declared nodes, provide a list of local or remote nodes.`
        );
    }

    return {
        services,
        locals
    };
}

module.exports = createConfig;
