import list from './list'
import table from './table'

const palette = {
  cute: ['#F8ADCC', '#FCC9DE'],
  cool: ['#9AB3FF', '#CCDAFF'],
  pasn: ['#FEE3B3', '#FEECCC'],
  rest: ['#FBFBFB', '#FFFFFF']
}

const match_idol = (idol, name) => idol.name.replace(' ', '') == name.replace(' ', '')

const get_idol = (name) => {
  const idol = list.find(idol => match_idol(idol, name))
  if(idol !== undefined) return idol
  return {
    name: name,
    kana: 'そのた',
    roma: 'other',
    type: 'rest',
  }
}

const order = (idols) => {
  return idols.sort((a, b) => {
    const i = list.findIndex(idol => match_idol(idol, a))
    const j = list.findIndex(idol => match_idol(idol, b))
    if(i < 0 && j < 0) {
      if(a < b) return -1
      if(a > b) return 1
      return 0
    }
    if(i < 0) return 1
    if(j < 0) return -1
    if(i < j) return -1
    if(i > j) return 1
    return 0
  })
}

const match_name = (query, name) => {
  if(name.indexOf(' ') < 0) return name.indexOf(query) >= 0
  const [last, first] = name.split(' ')
  return [`${first}${last}`, `${last}${first}`, `${first} ${last}`, `${last} ${first}`].reduce((prev, curr) => prev || curr.indexOf(query) >= 0, false)
}

const match_name_space = (query, name) => {
  if(name.indexOf(' ') < 0) return name.indexOf(query) >= 0
  const [last, first] = name.split(' ')
  return [`${first} ${last}`, `${last} ${first}`].reduce((prev, curr) => prev || curr.indexOf(query) >= 0, false)
}

const search = (query, idols) => {
  return idols.filter(({name, kana, roma}) => {
    return match_name(query, name) || match_name(query, kana) || match_name_space(query, roma)
  })
}

export const filter = (q_caller, q_callee) => {
  const caller_hits = search(q_caller, list)
  const callee_hits = search(q_callee, list)
  const callee_names = callee_hits.map(({name}) => name.replace(' ', ''))
  const callers = caller_hits.filter(({name}) => name.replace(' ', '') in table)

  const tmp = callers.map(caller => {
    const caller_name = caller.name.replace(' ', '')
    const callees = order(Object.keys(table[caller_name]).filter(callee_name => {
      return callee_names.find(name => {
        return name === callee_name}
      )}
    )).map(callee_name => get_idol(callee_name))
    return callees.map(callee => {
      const called = table[caller.name.replace(' ', '')][callee.name.replace(' ', '')]
      return {
        caller,
        callee,
        called,
      }
    })
  }).filter(array => array.length > 0).map((set, i) => {
    return set.map(({caller, callee, called}, j) => {
      return {
        data: {
          caller: j == 0 ? caller.name : '',
          callee: callee.name,
          called: called,
        },
        colors: {
          caller: palette[caller.type][i % 2],
          callee: palette[callee.type][(i + j) % 2],
          called: palette[callee.type][(i + j) % 2],
        }
      }
    })
  }).reduce((prev, curr) => [...prev, ...curr])
  return [tmp.map(e => e.data), tmp.map(e => e.colors)]
}

export default filter
