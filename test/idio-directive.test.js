/* eslint-disable no-unused-vars */
const { expect } = require("chai");

const { AuthDirective } = require("graphql-directive-auth");
const { IdioDirective } = require("../src");

const { isAuthenticated } = AuthDirective();

describe("IdioDirective", () => {
    it("should throw name required", () => {
        try {
            const directive = new IdioDirective();

            throw new Error();
        } catch (error) {
            expect(error.message).to.contain(
                "constructing IdioDirective name required"
            );
        }
    });

    it("should throw name must be of type string", () => {
        try {
            const directive = new IdioDirective({ name: [] });

            throw new Error();
        } catch (error) {
            expect(error.message).to.contain(
                "constructing IdioDirective name must be of type 'string'"
            );
        }
    });

    it("should throw typeDefs required", () => {
        try {
            const directive = new IdioDirective({ name: "hasPermission" });

            throw new Error();
        } catch (error) {
            expect(error.message).to.contain(
                "constructing IdioDirective: 'hasPermission' typeDefs required"
            );
        }
    });

    it("should throw error parsing typeDefs", () => {
        try {
            const directive = new IdioDirective({
                name: "hasPermission",
                typeDefs: `dhjdklh`
            });

            throw new Error();
        } catch (error) {
            expect(error.message).to.contain(
                "constructing IdioDirective: 'hasPermission'"
            );
        }
    });

    it("should throw resolver required", () => {
        try {
            const directive = new IdioDirective({
                name: "hasPermission",
                typeDefs: `
                input permissionInput {
                    resource: String!
                    action: String!
                }
                
                directive @hasPermission(
                    permission: permissionInput!
                ) on FIELD_DEFINITION 
            `
            });

            throw new Error();
        } catch (error) {
            expect(error.message).to.contain(
                "constructing IdioDirective: 'hasPermission' without a resolver"
            );
        }
    });

    it("should create and return a instance of IdioDirective", () => {
        const directive = new IdioDirective({
            name: "hasPermission",
            typeDefs: `
            input permissionInput {
                resource: String!
                action: String!
            }
            
            directive @hasPermission(
                permission: permissionInput!
            ) on FIELD_DEFINITION 
        `,
            resolver: isAuthenticated
        });

        expect(directive)
            .to.have.property("name")
            .to.be.a("string")
            .to.contain("hasPermission");

        expect(directive)
            .to.have.property("typeDefs")
            .to.be.a("function");

        expect(directive)
            .to.have.property("resolver")
            .to.be.a("function");
    });

    it("should throw constructing IdioDirective with invalid name", () => {
        try {
            const directive = new IdioDirective({
                name: "directive",
                typeDefs: `
                input permissionInput {
                    resource: String!
                    action: String!
                }
                
                directive @directive(
                    permission: permissionInput!
                ) on FIELD_DEFINITION 
            `,
                resolver: isAuthenticated
            });

            throw new Error();
        } catch (error) {
            expect(error.message).to.contain(
                "constructing IdioDirective: 'directive' with invalid name"
            );
        }
    });

    it("should throw resolver must be instance of SchemaDirectiveVisitor.", () => {
        try {
            const directive = new IdioDirective({
                name: "hasPermission",
                typeDefs: `
                input permissionInput {
                    resource: String!
                    action: String!
                }
                
                directive @hasPermission(
                    permission: permissionInput!
                ) on FIELD_DEFINITION 
            `,
                resolver: () => true
            });

            throw new Error();
        } catch (error) {
            expect(error.message).to.contain(
                "must be a instance of SchemaDirectiveVisitor."
            );
        }
    });
});
