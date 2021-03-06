# GraphQL Query Constructor
## A quick and simple query constructor for GraphQL

Feel free to test this out with my [simple GraphQL wrapper](https://github.com/NoahCardoza/graphql-goodreads) of the Goodreads API.

### Install

```bash
npm i graphql-query-constructor
```

### Require

```js
const GraphQLClient = require('graphql-query-constructor')

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

### Examples

More detailed examples can be found inside the [examples folder](examples).
