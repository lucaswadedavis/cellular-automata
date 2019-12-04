import uuid from 'uuid/v4';
import { clamp, pick, map2D } from './utils/';
// what situations do we want to handle?
// npc npc interactions
// growing plants?
// crafting & building?
// movement
// faction formation and joining
//
//

export default function Sim(simMap) {
  return {
    id: uuid(),
    simMap,
    addWater() {
      this.simMap = map2D(this.simMap, c => {
        c.water = pick([1, 1, 1, 0]); 
        return c;
      });
    },

    iteratePlants() {
      const minX = 1;
      const minY = 1;
      const maxX = this.simMap.length - 2;
      const maxY = this.simMap.length - 2;
      let centerX = this.simMap.length / 2 | 0;
      let centerY = this.simMap.length / 2 | 0;
      let copy = map2D(this.simMap, cell => {
        return Object.assign({}, cell);
      });
      const grow = (cell, i, j) => {
        if (cell.land) copy[i][j].plants = 1;
      };
      const kill = (cell, i, j) => {
        if (cell.land) copy[i][j].plants = 0;
      };
      const lookAround = (i, j, cb) => {
        let sm = this.simMap;
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            let cell = sm[clamp(i + x, minX, maxX)][clamp(j + y, minY, maxY)];
            cb(cell, clamp(i + x, minX, maxX), clamp(j + y, minY, maxY));
          }
        }
      };
      map2D(this.simMap, (cell, i, j) => {
        if (cell.land) {
          let plants = 0;
          lookAround(i, j, (cell, i, j) => {
            if (!cell) return;
            if (cell.plants) plants++;
          });
          if (plants > 1 && plants < 3) {
            grow(cell, i, j);
          } else {
            kill(cell, i, j);
          }
        }
      });
      this.simMap = copy;
      return this.simMap;
    },

    isolateIslands() {
      const minX = 1;
      const minY = 1;
      const maxX = this.simMap.length - 2;
      const maxY = this.simMap.length - 2;
      let centerX = this.simMap.length / 2 | 0;
      let centerY = this.simMap.length / 2 | 0;
      let copy = map2D(this.simMap, cell => {
        return Object.assign({}, cell);
      });
      const grow = (cell, i, j) => {
        if (cell.land) copy[i][j].land = 1;
      };
      const kill = (cell, i, j) => {
        if (cell.land) copy[i][j].land = 0;
      };
      const lookAround = (i, j, cb) => {
        let sm = this.simMap;
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            let cell = sm[clamp(i + x, minX, maxX)][clamp(j + y, minY, maxY)];
            cb(cell, clamp(i + x, minX, maxX), clamp(j + y, minY, maxY));
          }
        }
      };
      map2D(this.simMap, (cell, i, j) => {
        if (cell.land) {
          let land = 0;
          lookAround(i, j, (cell, i, j) => {
            if (!cell) return;
            if (cell.land) land++;
          });
          if (land < 7) {
            kill(cell, i, j);
          } 
        }
      });
      this.simMap = copy;
      return this.simMap;
    },

    addLand() {
      const minX = 1;
      const minY = 1;
      const maxX = this.simMap.length - 2;
      const maxY = this.simMap.length - 2;
      let centerX = this.simMap.length / 2 | 0;
      let centerY = this.simMap.length / 2 | 0;
      let stepLimit = 10000;
      let x = centerX;
      let y = centerY;
      for (let step = 0; step < stepLimit; step++) {
        const cell = this.simMap[x][y];
        cell.land = 1;
        if (pick([true, false])) {
          x = pick([x - 1, x + 1]);
        } else {
          y = pick([y - 1, y + 1]);
        }
        if (x === maxX || x === minX) x = centerX;
        if (y === maxY || y === minY) y = centerY;
      }
      return this.simMap;
    },
  }
};
