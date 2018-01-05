# GraphQL Query Builder
## A quick and simple query builder for GraphQL

Feel free to test this out with my [simple GraphQL wrapper](https://github.com/NoahCardoza/graphql-goodreads) of the Goodreads API.

### Install

```bash
npm i graphql-query-builder
```

### Require

```js
const GraphQLClient = require('graphql-query-builder')

// sendQuery would be a function which accept an Object and sends it to the GraphQL server.
const { Query, Mutation } = GraphQLClient(sendQuery)

```

### Comparison

##### JavaScript
```js
Query('author', {id: 160033}, [
  'name',
  Query('books', {}, [
    'id',
    'title',
    'isbn',
    Query('authors', {}, [
      'id',
      'name'
    ])
  ])
])
```

#### GraphQL
```graphql
{
  author(id: 160033) {
    name,
    books {
      id,
      title,
      isbn,
      authors {
        id,
        name
      }
    }
  }
}
```

### Example

A more detailed example can be found inside the [tests folder](tests).

