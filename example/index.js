const GraphQLClient = require('../index');  // require('graphql-query-builder')
const fetch = require('node-fetch')

const debug = data => { // A simple non-intrusive debuging function
  console.log(data)
  return data
}

const prettify = obj => console.log(JSON.stringify(obj, null, 2)) // Pretty Print
const call = fn => obj => obj[fn]()
const get = key => obj => obj[key]

const sendQuery = (graphQLData) => // This is the callback function we will pass to the GraphQLClient
  // This example assumes that my GraphQL Goodreads endpoint is running at port 4000
  // (https://github.com/NoahCardoza/graphql-goodreads)
  fetch('http://localhost:4000/graphql', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // We have to stringify the payload since sendQuery
    // is called with an object to make it easily accessible
    body: debug(JSON.stringify(graphQLData)) // debug(...) will console.log the initial query for debuging purposes
  })
  .then(call('json'))
  .then(get('data'))


const { Query, Mutation } = GraphQLClient(sendQuery)

// Both Query and Mutation take identical arguments
// (field, { args }, [ sub-fields ])

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
]).send()
.then(prettify)
