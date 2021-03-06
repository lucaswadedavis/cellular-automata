import React from 'react';
import Button from '@material-ui/core/Button';
import Sim from './sim';
import SimMapView from './views/sim-map/';
import { map2D } from './utils/';
import './style.css';

function MapCell() {
  return {
    blue: 0,
    red: 0,
    green: 0,
  };
}

function generateSimMap() {
  const simMap = [];
  const mapSideLength = 40;
  for (let i = 0; i < mapSideLength; i++) {
    simMap.push([[]]);
    for (let j = 0; j < mapSideLength; j++) {
      simMap[i][j] = MapCell();
    }
  }
  //const sim = Sim(simMap);
  //sim.addLand();
  return simMap;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    let simMap = generateSimMap();
    simMap = this.addClickHandlers(simMap);
    this.state = {
      play: false,
      activeColor: 'red',
      simMap,
    };
  }

  addClickHandlers(simMap) {
    simMap = map2D(simMap, (cell, i, j, simMap) => {
      cell.clickHandler = () => {
        const sm = this.state.simMap;
        const { activeColor } = this.state;
        const c = sm[i][j];
        c[activeColor] = c[activeColor] ? 0 : 1; 
        this.setState({ simMap: sm });
      };
      return cell;
    });
    return simMap;
  }

  createNewSimMap() {
    let simMap = generateSimMap();
    simMap = this.addClickHandlers(simMap);
    this.setState({ play: false, simMap });
  }

  play() {
    this.setState({ play: true }, () => {
      this.stepForward();
    });
  }

  pause() {
    this.setState({ play: false });
  }

  isolateIslands() {
    let { simMap } = this.state;
    const sim = Sim(simMap);
    simMap = sim.isolateIslands();
    this.setState({ simMap });
  }

  stepForward() {
    let { simMap, play } = this.state;
    console.log('step');
    const sim = Sim(simMap);
    simMap = sim.iterate();
    this.setState({ simMap });
    if (play) {
      window.setTimeout(() => {
        this.stepForward();
      }, 100);
    };
  }

  activate(color) {
    this.setState({ activeColor: color });
  }

  renderColorButtonArea() {
    const { activeColor } = this.state;
    const base = {
      border: '10px solid #fff',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      display: 'inline-block',
      margin: '12px',
    };
    const redStyle = Object.assign({
      background: 'rgb(255, 0, 0)',
    }, base);
    const greenStyle = Object.assign({
      background: 'rgb(0, 255, 0)',
    }, base);
    const blueStyle = Object.assign({
      background: 'rgb(0, 0, 255)',
    }, base);
    let selectedColorStyle;
    if (activeColor === 'red') {
      selectedColorStyle = redStyle;
    } else if (activeColor === 'green') {
      selectedColorStyle = greenStyle;
    } else {
      selectedColorStyle = blueStyle;
    }
    selectedColorStyle.border = "10px solid #000";
    return (
      <div>
        <div
          style={ redStyle }
          onClick={ () => this.activate('red') }
          >
        </div>
        <div
          style={ greenStyle }
          onClick={ () => this.activate('green') }
          >
        </div>
        <div
          style={ blueStyle }
          onClick={ () => this.activate('blue') }
          >
        </div>
      </div>
    );
  }

  renderRulesArea() {
    return (
      <div>
        <h2>If</h2>
        <h3>Red/Green/Blue is above/below 1/2/3/4/5/6/7/8/9</h3>
        <h2>and</h2>
        <h3>If Red/Green/Blue is above/below 1/2/3/4/5/6/7/8/9</h3>
        <h2>then</h2>
        <h3>Set the cell Red/Green/Blue to 0/1</h3>
      </div>
    );
  }

  render() {
    const { simMap, play } = this.state;
    return (
      <div className="main flex-container">
        <div className="flex-child">
          <SimMapView simMap={ simMap }/>
        </div>
        <div className="flex-child">
          { this.renderColorButtonArea() }
          <Button
            variant="contained"
            color="primary"
            onClick={ () => this.createNewSimMap() }
            >
            Reset
          </Button>
          <div>
            <Button
              variant="contained"
              onClick={ () => play ? this.pause() : this.play() }
              >
              { play ? 'Pause' : 'Play' }
            </Button>
            <Button
              variant="contained"
              onClick={ () => this.stepForward() }
              >
              Step Forward 
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
