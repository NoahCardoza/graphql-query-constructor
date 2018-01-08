// Don't mind this file. It is for testing purposes only and only work locally.

const GraphQLClient = require('./index') // require('graphql-query-constructor')
const fetch = require('node-fetch')

const debug = data => {
  console.log(data)
  return data
}

const prettify = obj => console.log(JSON.stringify(obj, null, 2)) // Pretty Print
const call = fn => obj => obj[fn]()
const get = key => obj => obj[key]

const sendQuery = (graphQLData, fields) =>{
  console.log(fields)
  return fetch('http://localhost:8081/graphql', {
    method: 'post',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QG1lLmNvbSIsInBhc3N3b3JkIjoiJDJhJDA4JDdqNG8zYlByYW13NlQ0MDM3Q0tHVHVTMVl5MER0L0tEcC8xOTM1ZldmeVpjTXlVTWhQMTlhIiwiY3JlYXRlZEF0IjoiMjAxOC0wMS0wMlQxODowNTowNS4zMDBaIiwidXBkYXRlZEF0IjoiMjAxOC0wMS0wMlQxODowNTowNS4zMDBaIiwiaWF0IjoxNTE1NDI3NDY5LCJleHAiOjE1MTYwMzIyNjl9.rUc5wlHSzga8Z55mMtCod-VILOts4CHYu0aNy-os3bU',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: debug(JSON.stringify(graphQLData))
  })
  .then(call('json'))
}
  // .then(get('data'))

const { Query, Mutation } = GraphQLClient(sendQuery)

const fetchSongs = args =>
  Query('songs', args || {}, [
    'title',
    'artist',
    'album'
  ]).send()

// fetchSongs({
//   search: 'Mod'
// }).then(prettify)

Query('bookmarks', {}, [
  Query('song', {}, [
    'title',
    'album',
    'artist',
    'genre',
    'albumImageUrl'
  ])
])
.send()
.then(prettify)
