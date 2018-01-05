// Don't mind this file. It is for testing purposes only and only work locally.

const GraphQLClient = require('./index');
const fetch = require('node-fetch');

const debug = data => {
  console.log(data)
  return data
}

const prettify = obj => console.log(JSON.stringify(obj, null, 2)) // Pretty Print
const call = fn => obj => obj[fn]()
const get = key => obj => obj[key]

const sendQuery = (graphQLData) =>
  fetch('http://localhost:8081/graphql', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: debug(JSON.stringify(graphQLData))
  })
  .then(call('json'))
  .then(get('data'))

const { Query, Mutation } = GraphQLClient(sendQuery)

const fetchSongs = args =>
  Query('songs', args || {}, [
    'title',
    'artist',
    'album'
  ]).send()

fetchSongs({
  search: 'Mod'
}).then(prettify)
