const wrapInBraces = str => `{${str}}`
const wrapInParens = str => `(${str})`
const concat = (...strs) =>
  strs.reduce(
    (block, chunk) => block.concat(chunk),
    ''
  )

const argsToString = args => args
  ? wrapInParens(
      JSON.stringify(args)
        .slice(1,-1)
        .replace(/"(.*)":/g, '$1: ')
    )
  : ''

const keysToString = keys =>
  wrapInBraces(
    keys.map(
        key => (typeof key == 'Object')
          ? key.toString()
          : key
      )
      .join(',')
  )

function GraphQL ($type /* query | mutation | undefined */ ) {
  const state = {
    $type,
    $body: {},
    field: (name, $args, keys) => {
      state.$body[name] = {
        $args,
        keys
      }
      return state
    },
    toString: () =>
      concat(
        state.$type && state.$type + '{' || '',
        Object.keys(state.$body).map(
          field =>
            concat(
              field,
              argsToString(state.$body[field].$args),
              keysToString(state.$body[field].keys)
            )
        ).join(','),
        state.$type && '}' || ''
      )
    }
  return state
}

console.log(
    GraphQL('query')
    .field('songs', {search: 'Mod'}, [
      'id',
      'title',
      GraphQL()
        .field('bookmarks', null, [
          'userId',
          GraphQL()
            .field('song', null, [
              'id'
            ])
        ])

    ])
    .toString()
);
