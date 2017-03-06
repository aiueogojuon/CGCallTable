import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'

import TextField from 'material-ui/TextField'

import list from '../list'
import table from '../table'

const palette = {
  cute: ['#FF7FB2', '#FC97C0', '#F8ADCC', '#FCC9DE'],
  cool: ['#80AAFF', '#4080FF', '#9AB3FF', '#CCDAFF'],
  pasn: ['#FFD480', '#FDD899', '#FEE3B3', '#FEECCC'],
  rest: ['#F4F4F4', '#F8F8F8', '#FBFBFB', '#FFFFFF']
}

const match_idol = (idol, name) => idol.name.replace(' ', '') == name.replace(' ', '')

const try_idol = (name) => list.filter(idol => match_idol(idol, name))[0]

const get_idol = (name) => {
  const idol = try_idol(name)
  if(idol !== undefined) return idol
  return {
    name: name,
    kana: 'そのた',
    roma: 'other',
    type: 'rest',
  }
}

const get_color = (name, index) => {
  const idol = get_idol(name)
  if(idol) return palette[get_idol(name).type][index]
  return palette['rest'][index]
}

const get_index = (name) => list.map((idol, index) => match_idol(idol, name) ? index : -1).filter(index => index >= 0)[0]

const order = (idols) => {
  return idols.sort((a, b) => {
    const i = get_index(a)
    const j = get_index(b)
    if(i === undefined && j === undefined) {
      if(a < b) return -1
      if(a > b) return 1
      return 0
    }
    if(i === undefined) return 1
    if(j === undefined) return -1
    if(i < j) return -1
    if(i > j) return 1
    return 0
  })
}

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = { caller: '', callee: '' }
  }

  handleCallerChange = (event, value) => {
    this.setState({ caller: value.toLowerCase() })
  }

  handleCalleeChange = (event, value) => {
    this.setState({ callee: value.toLowerCase() })
  }

  render = () => {
    const { caller, callee } = this.state

    const filtered1 = list.filter(idol => idol.name.indexOf(caller) >= 0 || idol.kana.indexOf(caller) >= 0 || idol.roma.indexOf(caller) >= 0)
    const filtered2 = filtered1.map(idol => idol.name.replace(' ', '')).filter(name => name in table).filter(name => {
      return Object.keys(table[name]).map(to => get_idol(to)).filter(idol => idol.name.indexOf(callee) >= 0 || idol.kana.indexOf(callee) >= 0 || idol.roma.indexOf(callee) >= 0).map(idol => idol.name.replace(' ', '')).length > 0
    })

    const rows = filtered2.filter(name => name in table).map((name, i) => {
      const filtered3 = Object.keys(table[name]).map(to => get_idol(to)).filter(idol => idol.name.indexOf(callee) >= 0 || idol.kana.indexOf(callee) >= 0 || idol.roma.indexOf(callee) >= 0).map(idol => idol.name.replace(' ', ''))
      const rows = order(filtered3).map((to, j) => {
        return (
          <Row key={j} style={{ backgroundColor: get_color(to, 2 + (i + j) % 2) }}>
            <Col xs={4}>{to}</Col>
            <Col xs={8}>{table[name][to]}</Col>
          </Row>
        )
      })

      return (
        <Row key={i} style={{ width: '100%', height: '100%', backgroundColor: get_color(name, 2 + i % 2)}}>
          <Col xs={3}>{name}</Col>
          <Col xs={9}>
            <Grid style={{width: '100%'}}>{rows}</Grid>
          </Col>
        </Row>
      )
    })

    return (
      <Grid style={{width: 950, margin: 'auto', padding: 0}}>
        <Row>
          <Col xs={3}>
            <TextField hintText="Caller" fullWidth={true} onChange={this.handleCallerChange} />
          </Col>
          <Col xs={3}>
            <TextField hintText="Callee" fullWidth={true} onChange={this.handleCalleeChange} />
          </Col>
          <Col xs={6}></Col>
        </Row>
        {rows}
      </Grid>
    )
  }
}
