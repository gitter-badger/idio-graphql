---
id: schema-appliances
title: Schema Appliances
---

## Intro

---

**Schema Appliances** or 'schema extras' are parts of the GraphQL schema that is not a Node. This includes;  

1. [**Enums**](#enums)
2. [**Scalars**](#scalars)
3. [**Directives**](#directives)
4. [**Interfaces**](#interfaces)
5. [**Unions**](#unions)
6. [**Types**](#types)
4. [**Schema Globals**](#schema-globals)

## Enums

---

You can use **[IdioEnum](idio-enum)** to apply **[Enumeration types](https://graphql.org/learn/schema/#enumeration-types)** to your GraphQL schema.


```javascript
const StatusEnum = new IdioEnum({
    name: "StatusEnum",
    typeDefs: `
        enum StatusEnum {
            ONLINE
            OFFLINE
            INACTIVE
        }
    `,
    resolver: {
        ONLINE: "online",
        OFFLINE: "offline",
        INACTIVE: "inactive"
    }
});

const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User {
            name: String
            age: Int
            status: StatusEnum
        }

        ...
    `, 
    ...
});

const { typeDefs, resolvers } = combineNodes(
    [ User ], 
    { enums: [ StatusEnum ] }
)
```

You can encapsulate **[IdioEnums](idio-enum)** in a [**GraphQLNode**](graphql-node).

```javascript
const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User {
            name: String
            age: Int
            status: StatusEnum
        }

        ...
    `, 
    enums: [ StatusEnum ],
    ...
});
```

## Scalars

---

You can use **[IdioScalar](idio-scalar)** to apply **[Scalar types](https://graphql.org/learn/schema/#scalar-types)** to your GraphQL schema. A scalar does not require `typeDefs`.

> You can only specify scalars at [**combineNodes**](combine-nodes).

_example uses **[graphql-type-json](https://github.com/taion/graphql-type-json)**_.

```javascript
const JSONScalar = new IdioScalar({
    name: "JSON",
    resolver: GraphQLJSON
});

const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User {
            name: String
            age: Int
            metadata: JSON
        }

        ...
    `, 
    ...
});

const { typeDefs, resolvers } = combineNodes(
    [ User ], 
    { scalars: [ JSONScalar ] }
);
```

## Directives

---

You can use **[IdioDirective](idio-directive)** to apply **[Directives](https://graphql.org/learn/queries/#directives)** to your GraphQL schema. 

> You can only specify directives at [**combineNodes**](combine-nodes).

_example uses **[graphql-auth-directives](https://www.npmjs.com/package/graphql-auth-directives)**._

```javascript
const hasScopeDirective = new IdioDirective({
    name: "hasScope",
    typeDefs: `
        directive @hasScope(
            scopes: [ String ]!
        ) on FIELD_DEFINITION 
    `, 
    resolver: HasScopeDirective
});


const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User ...

        type Query {
            getUser: User @hasScope(scopes: [ "admin" ])
        }
    `, 
    ...
});

const { typeDefs, resolvers } = combineNodes(
    [ User ], 
    { directives: [ hasScopeDirective ] }
);
```

## Interfaces

---

You can use **[IdioInterface](idio-interface)** to apply **[Interface types](https://graphql.org/learn/schema/#interfaces)** to your GraphQL schema.

```javascript
const PersonInterface = new IdioInterface({
    name: "PersonInterface",
    typeDefs: `
    interface PersonInterface {
        eyeColor: String
        hairColor: String
    }`,
    resolver: {
        __resolveType(obj) {
            if (obj.name) {
                return "User";
            }
        }
    }
});


const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User implements PersonInterface {
            eyeColor: String
            hairColor: String
            name: String
            age: Int
        }

        type Query {
            getUser: PersonInterface
        }
    `, 
    ...
});

const { typeDefs, resolvers } = combineNodes(
    [ User ], 
    { interfaces: [ PersonInterface ] }
);
```

> You can encapsulate **[IdioInterfaces](idio-interface)** in a [**GraphQLNode**](graphql-node).

```javascript
const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User {
            name: String
            age: Int
            status: StatusEnum
        }

        ...
    `, 
    interfaces: [ PersonInterface ],
    ...
});
```

## Unions

---

You can use **[IdioUnion](idio-union)** to apply **[Union types](https://graphql.org/learn/schema/#union-types)** to your GraphQL schema.

```javascript
const UserUnion = new IdioUnion({
    name: "UserUnion",
    typeDefs: `union UserUnion = User | Admin`,
    resolver: {
        __resolveType(obj) {
            if (obj.admin) {
                return "Admin";
            }
        }
    }
});


const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User ...

        type Query {
            getUser: UserUnion
        }
    `, 
    ...
});

const { typeDefs, resolvers } = combineNodes(
    [ User ], 
    { 
        unions: [ UserUnion ],
        schemaGlobals: `
            type Admin {
                name: String
                age: Int
                roles: [ String ]
            }
        `
    }
);
```

> You can encapsulate **[IdioUnions](idio-union)** in a [**GraphQLNode**](graphql-node).

```javascript
const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User {
            name: String
            age: Int
            status: StatusEnum
        }

        ...
    `, 
    unions: [ UserUnion ],
    ...
});
```

## Types

---

You can use **[GraphQLType](graphql-type)** to apply **[Object Types](http://spec.graphql.org/June2018/#ObjectTypeDefinition)** to your GraphQL schema.

```javascript
const Metadata = new GraphQLType({
    name: "Metadata",
    typeDefs: `
        type Metadata {
            lastLogin: String
        }
    `,
    resolvers: {
        lastLogin: () => { ... }
    }
});


const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User {
            metadata: Metadata
        }

        type Query ...
    `, 
    ...
});

const { typeDefs, resolvers } = combineNodes(
    [ User ], 
    { 
        types: [ Metadata ]
    }
);
```

> You can encapsulate **[GraphQLTypes](graphql-type)** in a [**GraphQLNode**](graphql-node).

```javascript
const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User {
            metadata: Metadata
        }

        ...
    `, 
    types: [ Metadata ],
    ...
});
```

## Schema Globals

---

If you have type definition's that are generic to multiple Node's, you can provide a string or an array of strings to [**combineNodes**](combine-nodes) where they will be injected into the resulting `typeDefs`.

> If your Schema Global requires a resolver, you should prefer creating a [**GraphQLNode**](graphql-node).

```javascript
const User = new GraphQLNode({
    name: "User",
    typeDefs: `
        type User {
            name: String
            age: Int
            timeStamp: TimeStamp
        }

        ...
    `, 
    ...
});

const { typeDefs, resolvers } = await combineNodes(
    [ User ], 
    { 
        schemaGlobals: [ 
            `
            type TimeStamp {
                updatedAt: String
                createdAt: String
            }
            ` 
        ] 
    }
);
```



