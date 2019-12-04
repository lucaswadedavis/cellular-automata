import React from 'react';
import Button from '@material-ui/core/Button';
import Sim from './sim';
import SimMapView from './views/sim-map/';
import { map2D } from './utils/';
import './style.css';

function MapCell() {
  return {
    water: 1,
    land: 0,
    plants: 0,
    fruit: 0,
  };
}

function generateSimMap() {
  const simMap = [];
  const mapSideLength = 100;
  for (let i = 0; i < mapSideLength; i++) {
    simMap.push([[]]);
    for (let j = 0; j < mapSideLength; j++) {
      simMap[i][j] = MapCell();
    }
  }
  const sim = Sim(simMap);
  sim.addLand();
  return simMap;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    let simMap = generateSimMap();
    simMap = this.addClickHandlers(simMap);
    this.state = {
      play: false,
      simMap,
    };
  }

  addClickHandlers(simMap) {
    simMap = map2D(simMap, (cell, i, j, simMap) => {
      cell.clickHandler = () => {
        const sm = this.state.simMap;
        const c = sm[i][j];
        c.plants = 1; 
        this.setState({ simMap: sm });
      };
      return cell;
    });
    return simMap;
  }

  createNewSimMap() {
    let simMap = generateSimMap();
    simMap = this.addClickHandlers(simMap);
    this.setState({ simMap });
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
    simMap = sim.iteratePlants();
    this.setState({ simMap });
    if (play) {
      window.setTimeout(() => {
        this.stepForward();
      }, 100);
    };
  }

  render() {
    const { simMap } = this.state;
    return (
      <div className="main flex-container">
        <div className="flex-child">
          <SimMapView simMap={ simMap }/>
        </div>
        <div className="flex-child">
          <Button
            variant="contained"
            color="primary"
            onClick={ () => this.createNewSimMap() }
            >
            Generate Sim Map
          </Button>
          <div>
            <Button
              variant="contained"
              onClick={ () => this.play() }
              >
              Play 
            </Button>
            <Button
              variant="contained"
              onClick={ () => this.pause() }
              >
              Pause 
            </Button>
            <Button
              variant="contained"
              onClick={ () => this.stepForward() }
              >
              Step Forward 
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              onClick={ () => this.isolateIslands() }
              >
              Isolate Islands  
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
