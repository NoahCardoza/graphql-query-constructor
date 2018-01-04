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
    toString: () => {
      let output = ''
      if (state.$type)
         output += `${state.$type} {`

      for (let field in state.$body) {
        output += `${field} `
        if (state.$body[field].$args)
        {
          output += '('
          output += JSON.stringify(state.$body[field].$args)
            .slice(1,-1)
            .replace(/"(.*)":/g, '$1: ') + ','
          output += ')'
        }
        output += '{'
        for (let ikey in state.$body[field].keys){
          const key = state.$body[field].keys[ikey]
          if (typeof key == 'Object')
            output += key.toString()
          else
            output += key + ','
        }
        output += '}'
      }
      if (state.$type)
        output += '}'
      return (output)
    }
  }
  return state;
}

console.log(
    GraphQL('query')
    .field('songs', {search: 'Mod'}, [
      'id',
      'title',
      GraphQL()
        .field('bookmarks', null, [
          'userId'
        ])
    ])
    .toString()
);
