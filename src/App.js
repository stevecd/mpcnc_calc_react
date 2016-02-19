import React, { Component } from 'react';
import update from 'react-addons-update';
import {Navbar, Tabs, Tab, Input, Grid, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

let defaultState = {
  x: 21,
  y: 21,
  z: 6.1,
  xCa: 11,
  yCa: 11,
  zCa: 7.9,
  xBa: 7,
  yBa: 7,
  units: "Inches"
}

export default class App extends Component {
  constructor(props) {
    super(props)
    const { query } = this.props.location
    defaultState = update(defaultState, { $merge: query })
    this.state = defaultState
  }

  handleXChange = (e) => {
    const newState = update(this.state, {
      x: {$set: e.target.value}
    })
    this.setState(newState)
  }

  handleYChange = (e) => {
    const newState = update(this.state, {
      y: {$set: e.target.value}
    })
    this.setState(newState)
  }

  handleZChange = (e) => {
    const newState = update(this.state, {
      z: {$set: e.target.value}
    })
    this.setState(newState)
  }


  handleResetToDefaults = (e) => {
    const newState = defaultState
    this.setState(newState)
  }

  handleXAdditionChange = (e) => {
    const newState = update(this.state, { xCa: {$set: e.target.value} })
    this.setState(newState)
  }

  handleYAdditionChange = (e) => {
    const newState = update(this.state, {yCa: {$set: e.target.value}})
    this.setState(newState)
  }

  handleZAdditionChange = (e) => {
    const newState = update(this.state, {zCa: {$set: e.target.value}})
    this.setState(newState)
  }

  handleXBeltAdditionChange = (e) => {
    const newState = update(this.state, {xBa: {$set: e.target.value}})
    this.setState(newState)
  }

  handleYBeltAdditionChange = (e) => {
    const newState = update(this.state, {yBa: {$set: e.target.value}})
    this.setState(newState)
  }

  handleUnitsChange = (e) => {
    if(this.state.units == "Centimeters" && e.target.value == "Inches"){
      let convertedValues = {}
      for(let key in this.state) {
        if(!isNaN(this.state[key])) {
          convertedValues[key] = this.state[key] / 2.54
        }
      }
      convertedValues.units = "Inches"
      this.setState(convertedValues)
    } else if(this.state.units == "Inches" && e.target.value == "Centimeters") {
      let convertedValues = {}
      for(let key in this.state) {
        if(!isNaN(this.state[key])) {
          convertedValues[key] = this.state[key] * 2.54
        }
      }
      convertedValues.units = "Centimeters"
      this.setState(convertedValues)
    }
  }

  // http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
  serialize(obj) {
    let str = [];
    for(let p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  calculateValues = () => {
    let result =  {
      xConduitLength: parseFloat(this.state.x) + parseFloat(this.state.xCa),
      yConduitLength: parseFloat(this.state.y) + parseFloat(this.state.yCa),
      zConduitLength: parseFloat(this.state.z) + parseFloat(this.state.zCa),
    }
    result.zThreadedRod = result.zConduitLength - 2
    result.xBelt = result.xConduitLength + parseFloat(this.state.xBa),
    result.yBelt = result.yConduitLength + parseFloat(this.state.yBa),
    result.totalXConduit = result.xConduitLength * 3
    result.totalYConduit = result.yConduitLength * 3
    result.totalZConduit = result.zConduitLength * 2
    result.totalConduit = result.totalXConduit + result.totalYConduit + result.totalZConduit
    result.totalXBelt = result.xBelt * 2
    result.totalYBelt = result.yBelt * 2
    result.totalBelt = result.totalXBelt + result.totalYBelt
    for(let key in result) {
      if(isNaN(result[key])) {
        result[key] = NaN
      } else {
        result[key] = parseFloat(result[key]).toFixed(1)
      }
    }
    result.link = new RegExp(/^.*\//).exec(window.location.href) + "?" + this.serialize(this.state)
    return result
  }

  render() {
    const calculatedValues = this.calculateValues()

    return (
      <Grid>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              Simple MPCNC Calc
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Row>
          <Tabs defaultActiveKey={1} animation={false}>
            <br/>
            <Tab eventKey={1} title="Calc">
              <Row>
                <Col xs={4} md={4}>
                  <form className="form-horizontal">
                    <fieldset>
                      <legend>Desired Cutting Area</legend>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="X Dimension"
                        value={this.state.x}
                        onChange={this.handleXChange}
                        label="X:"
                        labelClassName="col-xs-2"
                        wrapperClassName="col-xs-10"
                      />
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Y Dimension"
                        value={this.state.y}
                        onChange={this.handleYChange}
                        label="Y:"
                        labelClassName="col-xs-2"
                        wrapperClassName="col-xs-10"
                      />
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Z Dimension"
                        value={this.state.z}
                        onChange={this.handleZChange}
                        label="Z:"
                        labelClassName="col-xs-2"
                        wrapperClassName="col-xs-10"
                      />
                      <Input
                        type="select"
                        label="Units:"
                        labelClassName="col-xs-2"
                        wrapperClassName="col-xs-8 col-xs-offset-2"
                        onChange={this.handleUnitsChange}
                        value={this.state.units}
                      >
                        <option value="Inches">Inches</option>
                        <option value="Centimeters">Centimeters</option>
                      </Input>
                      <Button
                        className="pull-right"
                        onClick={this.handleResetToDefaults}
                      >Reset To Defaults</Button><br /><br />
                      <Input
                        type="textarea"
                        placeholder="Link to this config"
                        label="Link:"
                        value={calculatedValues.link}
                        rows={4}
                        readOnly
                      />
                    </fieldset>
                  </form>
                </Col>
                <Col xs={4} md={4}>
                  <form className="form-horizontal">
                    <fieldset>
                      <legend>Piece Lengths</legend>
                      <Input type="text" label="X Conduit" labelClassName="col-xs-5" wrapperClassName="col-xs-7" value={calculatedValues.xConduitLength} addonAfter="x 3" readOnly />
                      <Input type="text" label="Y Conduit" labelClassName="col-xs-5" wrapperClassName="col-xs-7" value={calculatedValues.yConduitLength} addonAfter="x 3" readOnly />
                      <Input type="text" label="Z Conduit" labelClassName="col-xs-5" wrapperClassName="col-xs-7" value={calculatedValues.zConduitLength} addonAfter="x 2" readOnly />
                      <hr/>
                      <Input type="text" label="Z Rod" labelClassName="col-xs-5" wrapperClassName="col-xs-7" value={calculatedValues.zThreadedRod} addonAfter="x 1" readOnly />
                      <hr />
                      <Input type="text" label="X Belt" labelClassName="col-xs-5" wrapperClassName="col-xs-7" value={calculatedValues.xBelt} addonAfter="x 2" readOnly />
                      <Input type="text" label="Y Belt" labelClassName="col-xs-5" wrapperClassName="col-xs-7" value={calculatedValues.yBelt} addonAfter="x 2" readOnly />
                    </fieldset>
                  </form>
                </Col>
                <Col xs={4} md={4}>
                  <form className="form-horizontal">
                    <fieldset>
                      <legend>Total Lengths</legend>
                      <Input type="text" label="X Total Conduit" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={calculatedValues.totalXConduit} readOnly />
                      <Input type="text" label="Y Total Conduit" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={calculatedValues.totalYConduit} readOnly />
                      <Input type="text" label="Z Total Conduit" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={calculatedValues.totalZConduit} readOnly />
                      <Input type="text" label="Total Conduit" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={calculatedValues.totalConduit} readOnly />
                      <hr/>
                      <Input type="text" label="X Total Belt" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={calculatedValues.totalXBelt} readOnly />
                      <Input type="text" label="Y Total Belt" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={calculatedValues.totalYBelt} readOnly />
                      <Input type="text" label="Total Belt" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={calculatedValues.totalBelt} readOnly />
                    </fieldset>
                  </form>
                </Col>
              </Row>
              <Row>
                <form className="form-horizontal">
                  <fieldset>
                    <legend>Settings</legend>
                    <Col xs={6}>
                      <Input type="number" step="0.1" label="Added to X Conduits" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={this.state.xCa} onChange={this.handleXAdditionChange}/>
                      <Input type="number" step="0.1" label="Added to Y Conduits" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={this.state.yCa} onChange={this.handleYAdditionChange}/>
                      <Input type="number" step="0.1" label="Added to Z Conduits" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={this.state.zCa} onChange={this.handleZAdditionChange}/>
                    </Col>
                    <Col xs={6}>
                      <Input type="number" step="0.1" label="Added to X Belts" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={this.state.xBa} onChange={this.handleXBeltAdditionChange}/>
                      <Input type="number" step="0.1" label="Added to Y Belts" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={this.state.yBa} onChange={this.handleYBeltAdditionChange}/>
                    </Col>
                  </fieldset>
                </form>
              </Row>
            </Tab>
            <Tab eventKey={3} title="About">
              <Row>
                <ul>
                  <li>
                    Values for default settings ( <a href="http://stevecd.github.io/mpcnc_calc_react/">http://stevecd.github.io/mpcnc_calc_react/</a> ) come from these <a href="http://public.vicious1.de/Assembly_Instructions_v0.2.pdf">Detailed Assembly Instructions</a> by <a href="http://www.vicious1.com/forums/users/bofferle/">Bofferle</a> .
                  </li>
                  <li>
                    I made this app while following along with the React.js <a href="https://facebook.github.io/react/docs/getting-started.html">getting started tutorial.</a>
                  </li>
                  <li>
                    It is a simple take on the <a href="http://www.thingiverse.com/thing:948320">Mostly Printed CNC / Multitool Layout Size Calculator</a> by <a href="http://www.thingiverse.com/GeoDave/about">GeoDave</a>.
                  </li>
                  <li>
                    repo at <a href="https://github.com/stevecd/mpcnc_calc_react">https://github.com/stevecd/mpcnc_calc_react</a>
                  </li>
                </ul>
              </Row>
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    );
  }
}
