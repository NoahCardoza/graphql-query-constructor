const { parse, print } = require('graphql');
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

const keysToString = keys => keys && keys.length
  ? wrapInBraces(
      keys.map(
        key => (typeof key == 'object')
          ? key.toString(true)
          : key
      )
      .join(',')
    )
  : ''

function GraphQL ($type /* query | mutation | undefined */, requestFn, ...field) {
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
          state.$mutation ? 'mutation' : '',
          !recursive ? '{' : '',
          Object.keys(state.$body).map(
            field =>
              concat(
                field,
                argsToString(state.$body[field].$args),
                keysToString(state.$body[field].keys)
              )
          ).join(','),
          !recursive ? '}' : ''
      ),
    prettify: () => print(parse(state.toString())),
    send: () =>
      requestFn({
        query: state.toString()
      })
  }
  if (field.length)
    state.field(...field)
  return state
}

const GraphQLClient = requestFn => ({
    Query: GraphQL.bind(null, 'query', requestFn),
    Mutation: GraphQL.bind(null, 'mutation', requestFn)
})

module.exports = GraphQLClient;
