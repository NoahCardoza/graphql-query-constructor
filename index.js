const wrapInBraces = str => `{${str}}`
const wrapInParens = str => `(${str})`

const concat = (...strs) =>
  strs.reduce(
    (block, chunk) => block.concat(chunk),
    ''
  )

const argsToString = args => args && Object.keys(args).length !== 0
  ? wrapInParens(
      JSON.stringify(args)
        .slice(1,-1)
        .replace(/"(.*)":/g, '$1: ')
    )
  : ''

const keysToString = keys =>
  wrapInBraces(
    keys.map(
      key => (typeof key == 'object')
        ? key.toString(true)
        : key
    )
    .join(',')
  )

function GraphQL ($type /* query | mutation | undefined */, requestFn) {
  const state = {
    $mutation: $type == 'mutation',
    $body: {},
    field: (name, $args, keys) => {
      state.$body[name] = {
        $args,
        keys
      }
      return state
    },
    toString: (recursive) =>
        concat(
          console.log(recursive) || '',
          !recursive ? '{' : '',
          state.$mutation ? 'mutation{' : '',
          Object.keys(state.$body).map(
            field =>
              concat(
                field,
                argsToString(state.$body[field].$args),
                keysToString(state.$body[field].keys)
              )
          ).join(','),
          state.$mutation ? '}' : '',
          !recursive ? '}' : ''
      ),
    send: () =>
      requestFn({
        query: state.toString()
      })
  }
  return state
}

const GraphQLClient = requestFn => ({
    Query: GraphQL.bind(null, 'query', requestFn),
    Mutation: GraphQL.bind(null, 'mutation', requestFn)
})

module.exports = GraphQLClient;
