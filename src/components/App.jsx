import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Table, Column, Cell } from 'fixed-data-table'

import TextField from 'material-ui/TextField'

import filter from '../data'

const palette = {
  cute: ['#F8ADCC', '#FCC9DE'],
  cool: ['#9AB3FF', '#CCDAFF'],
  pasn: ['#FEE3B3', '#FEECCC'],
  rest: ['#FBFBFB', '#FFFFFF']
}

const get_color = (name, index) => {
  const idol = get_idol(name)
  if(idol) return palette[get_idol(name).type][index]
  return palette['rest'][index]
}

const TextCell = ({rowIndex, data, colors, col, ...props}) => {
  return (<Cell style={{backgroundColor: colors[rowIndex][col], fontSize: 14}} {...props}>{data[rowIndex][col]}</Cell>)
}

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = { q_caller: '', q_callee: '' }
  }

  handleCallerChange = (event, value) => {
    this.setState({ q_caller: value.toLowerCase() })
  }

  handleCalleeChange = (event, value) => {
    this.setState({ q_callee: value.toLowerCase() })
  }

  render = () => {
    const { q_caller, q_callee } = this.state
    const [data, colors] = filter(q_caller, q_callee)

    return (
      <div style={{width: 1000, height: window.innerHeight, margin: 'auto'}}>
        <Grid style={{width: 1000}}>
          <Row>
            <Col xs={3}>
              <TextField hintText="Caller" fullWidth={true} onChange={this.handleCallerChange} />
            </Col>
            <Col xs={3}>
              <TextField hintText="Callee" fullWidth={true} onChange={this.handleCalleeChange} />
            </Col>
            <Col xs={6}></Col>
          </Row>
        </Grid>
        <Table rowHeight={30} rowsCount={data.length} headerHeight={0} width={1000} height={window.innerHeight - 48} {...this.props}>
          <Column cell={<TextCell data={data} colors={colors} col='caller' />} fixed={true} width={250} />
          <Column cell={<TextCell data={data} colors={colors} col='callee' />} fixed={true} width={250} />
          <Column cell={<TextCell data={data} colors={colors} col='called' />} fixed={true} width={500} />
        </Table>
      </div>
    )
  }
}
