import { find, map, max, maxBy, min, minBy, reject, startCase } from 'lodash'

const initialState = {
  newName: null,
  names: [],

  extents: [],
  year: 0
}

let reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'new':
    return {
      ...state,
      newName: action.name
    }
  case 'add': {
    if (find(state.names, { name: action.name }))
      return state
    else
      return {
        ...state,
        newName: null,
        names: [
          { name: startCase(action.name.toLowerCase()),
            expanded: action.expanded },
          ...state.names
        ]
      }
  }
  case 'remove': {
    return {
      ...state,
      names: reject(state.names, { name: action.name })
    }
  }
  case 'expand': {
    return {
      ...state,
      names: map(state.names, (name) => {
        if (name.name === action.name)
          return { ...name, expanded: !name.expanded }
        else
          return name
      })
    }
  }

  case 'countsFetch': {
    let extents = [
      min([state.extents[0], minBy(action.counts.null, 'year').year]),
      max([state.extents[0], maxBy(action.counts.null, 'year').year])
    ]
    let year = state.year || extents[1]
    let names = map(state.names, (name) => {
      if (name.name === action.name)
        return { ...name, counts: action.counts }
      else
        return name
    })

    return { ...state, names, extents, year }
  }

  case 'brush':
    if (state.year !== action.year)
      return { ...state, year: action.year }
    else
      return state

  default:
    return state
  }
}

export default reducer
