const GraphQLClient = require('./index');
const fetch = require('node-fetch');

const sendQuery = (graphQLParams) =>
  fetch('http://localhost:8081/graphql', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(graphQLParams)
  }).then(res => res.json())

const { Query, Mutation } = GraphQLClient(sendQuery)

Query().field('songs', {search: 'Mod'}, [
  'id',
  'title',
  Query()
    .field('bookmarks', {}, [
      'userId',
    ])
  ]
)
.send()
.then(json =>
  JSON.stringify(json, null, 2)
)
.then(console.log)
