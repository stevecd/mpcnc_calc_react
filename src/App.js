import React, { Component } from 'react';
import update from 'react-addons-update';
import {Input, Grid, Row, Col, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const defaultState = {
  desiredDimensions: {
    x: 21,
    y: 21,
    z: 6.1
  },
  config: {
    xConduitAddition: 11,
    yConduitAddition: 11,
    zConduitAddition: 7.9,
    xBeltAddition: 7,
    yBeltAddition: 7,
  },
  units: "Inches"
}

const metricConfig = {
  xConduitAddition: 11 * 2.54,
  yConduitAddition: 11 * 2.54,
  zConduitAddition: 7.9 * 2.54,
  xBeltAddition: 7 * 2.54,
  yBeltAddition: 7 * 2.54,
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = defaultState
  }

  handleXChange = (e) => {
    const newState = update(this.state, {
      desiredDimensions: {
        x: {$set: e.target.value}
      }
    })
    this.setState(newState)
  }

  handleYChange = (e) => {
    const newState = update(this.state, {
      desiredDimensions: {
        y: {$set: e.target.value}
      }
    })
    this.setState(newState)
  }

  handleZChange = (e) => {
    const newState = update(this.state, {
      desiredDimensions: {
        z: {$set: e.target.value}
      }
    })
    this.setState(newState)
  }


  handleResetToDefaults = (e) => {
    const newState = defaultState
    this.setState(newState)
  }

  handleXAdditionChange = (e) => {
    const newState = update(this.state, {
      config: {
        xConduitAddition: {$set: e.target.value}
      }
    })
    this.setState(newState)
  }

  handleYAdditionChange = (e) => {
    const newState = update(this.state, {
      config: {
        yConduitAddition: {$set: e.target.value}
      }
    })
    this.setState(newState)
  }

  handleZAdditionChange = (e) => {
    const newState = update(this.state, {
      config: {
        zConduitAddition: {$set: e.target.value}
      }
    })
    this.setState(newState)
  }

  handleXBeltAdditionChange = (e) => {
    const newState = update(this.state, {
      config: {
        xBeltAddition: {$set: e.target.value}
      }
    })
    this.setState(newState)
  }

  handleYBeltAdditionChange = (e) => {
    const newState = update(this.state, {
      config: {
        yBeltAddition: {$set: e.target.value}
      }
    })
    this.setState(newState)
  }

  handleUnitsChange = (e) => {
    if(this.state.units == "Centimeters" && e.target.value == "Inches"){
      let convertedValues = {desiredDimensions:{},config:{}}
      for(let key in this.state.desiredDimensions) {
        convertedValues.desiredDimensions[key] = this.state.desiredDimensions[key] / 2.54
      }
      for(let key in this.state.config) {
        convertedValues.config[key] = this.state.config[key] / 2.54
      }
      const newState = update(this.state, {
        desiredDimensions: {$set: convertedValues.desiredDimensions},
        config: {$set: convertedValues.config},
        units: {$set: "Inches"}
      })
      this.setState(newState)
    } else if(this.state.units == "Inches" && e.target.value == "Centimeters") {
      let convertedValues = {desiredDimensions:{},config:{}}
      for(let key in this.state.desiredDimensions) {
        convertedValues.desiredDimensions[key] = this.state.desiredDimensions[key] * 2.54
      }
      for(let key in this.state.config) {
        convertedValues.config[key] = this.state.config[key] * 2.54
      }
      const newState = update(this.state, {
        desiredDimensions: {$set: convertedValues.desiredDimensions},
        config: {$set: convertedValues.config},
        units: {$set: "Centimeters"}
      })
      this.setState(newState)
    }
  }

  calculateValues = () => {
    const desiredDimensions = this.state.desiredDimensions
    const config = this.state.config
    let result =  {
      xConduitLength: parseFloat(desiredDimensions.x) + parseFloat(config.xConduitAddition),
      yConduitLength: parseFloat(desiredDimensions.y) + parseFloat(config.yConduitAddition),
      zConduitLength: parseFloat(desiredDimensions.z) + parseFloat(config.zConduitAddition),
    }
    result.zThreadedRod = result.zConduitLength - 2
    result.xBelt = result.xConduitLength + parseFloat(this.state.config.xBeltAddition),
    result.yBelt = result.yConduitLength + parseFloat(this.state.config.yBeltAddition),
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
    return result
  }

  render() {
    const calculatedValues = this.calculateValues()
    const config = this.state.config

    return (
      <Grid>
        <Row>
          <Col xs={5}>
            <h1>Simple MPCNC Calc</h1>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={4} md={4}>
            <form className="form-horizontal">
              <fieldset>
                <legend>Desired Cutting Area</legend>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="X Dimension"
                  value={this.state.desiredDimensions.x}
                  onChange={this.handleXChange}
                  label="X:"
                  labelClassName="col-xs-2"
                  wrapperClassName="col-xs-10"
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Y Dimension"
                  value={this.state.desiredDimensions.y}
                  onChange={this.handleYChange}
                  label="Y:"
                  labelClassName="col-xs-2"
                  wrapperClassName="col-xs-10"
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Z Dimension"
                  value={this.state.desiredDimensions.z}
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
                <Button className="pull-right" onClick={this.handleResetToDefaults}>Reset To Defaults</Button>
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
          <form className="form-horizontal" disabled>
            <fieldset>
              <legend>Settings</legend>
              <Col xs={6}>
                <Input type="text" label="Added to X Conduits" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={config.xConduitAddition} onChange={this.handleXAdditionChange}/>
                <Input type="text" label="Added to Y Conduits" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={config.yConduitAddition} onChange={this.handleYAdditionChange}/>
                <Input type="text" label="Added to Z Conduits" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={config.zConduitAddition} onChange={this.handleZAdditionChange}/>
              </Col>
              <Col xs={6}>
                <Input type="text" label="Added to X Belts" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={config.xBeltAddition} onChange={this.handleXBeltAdditionChange}/>
                <Input type="text" label="Added to Y Belts" labelClassName="col-xs-7" wrapperClassName="col-xs-5" value={config.yBeltAddition} onChange={this.handleYBeltAdditionChange}/>
              </Col>
            </fieldset>
          </form>
        </Row>
        <row>
          <h3>About</h3>
            <p>
              I made this app while following along with the React.js <a href="https://facebook.github.io/react/docs/getting-started.html">getting started tutorial.</a>
            </p>
            <p>
              It is a simple take on the <a href="http://www.thingiverse.com/thing:948320">Mostly Printed CNC / Multitool Layout Size Calculator</a> by <a href="http://www.thingiverse.com/GeoDave/about">GeoDave</a>.
            </p>
            <p>
              repo at <a href="https://github.com/stevecd/mpcnc_calc_react">https://github.com/stevecd/mpcnc_calc_react</a>
            </p>
        </row>
      </Grid>
    );
  }
}
