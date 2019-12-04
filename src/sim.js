import uuid from 'uuid/v4';
import { clamp, map2D, wrapAroundClamp } from './utils/';

// rules could be vectorized like this
// [assigner, color, greater than, color, less than]
// [3, 1, 2, 1, 5 ]
// actually no
// because we can really only have one rule per color assignment
// so we can have 1 for red and 1 for green and 1 for blue
// and the real question is the predicates
// like, x > 2 and x < 4 and ...
// like we should be able to support arbitrarily many of these
// and if they evaluate to true, the color is a 1, otherwise, it's a 0
// WIP
const Rule = (color, v) => {
  const ops = [
    (count, value) => count > value,
    (count, value) => count < value,
    (count, value) => count === value,
    (count, value) => count !== value,
  ];
  return (redCount, greenCount, blueCount) => {
    const counts = [redCount, greenCount, blueCount];
    let res = 1;
    for (let i = 0; i < v; i = i + 3) {
      if (v[i] === undefined || v[i + 1] === undefined || v[i + 2] === undefined) break;
      if (!ops[v[i]](counts[v[i + 1]], v[i + 2])) {
        res = 0;
        break;
      }
    }
    return { [color]: res };
  }
}

const rules = [
  (redCount, greenCount, blueCount) => {
    let red, green, blue;
    blue = redCount > 2 && redCount > 2 ? 1 : 0;
    return { red, green, blue };
  },
  (redCount, greenCount, blueCount) => {
    let red, green, blue;
    green = greenCount > 2 && greenCount > 2 ? 1 : 0;
    return { red, green, blue };
  },
  (redCount, greenCount, blueCount) => {
    let red, green, blue;
    red = blueCount > 2 && blueCount > 2 ? 1 : 0;
    return { red, green, blue };
  },
];

export default function Sim(simMap) {
  return {
    id: uuid(),
    simMap,

    iterate() {
      const minX = 1;
      const minY = 1;
      const maxX = this.simMap.length - 2;
      const maxY = this.simMap.length - 2;
      let copy = map2D(this.simMap, cell => {
        return Object.assign({}, cell);
      });
      const grow = (cell, i, j) => {
        copy[i][j].green = 1;
      };
      const kill = (cell, i, j) => {
        copy[i][j].green = 0;
      };
      const lookAround = (i, j, cb) => {
        let sm = this.simMap;
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            let cell = sm[wrapAroundClamp(i + x, minX, maxX)][wrapAroundClamp(j + y, minY, maxY)];
            cb(cell, wrapAroundClamp(i + x, minX, maxX), wrapAroundClamp(j + y, minY, maxY));
          }
        }
      };
      map2D(this.simMap, (cell, i, j) => {
        let red = 0;
        let green = 0;
        let blue = 0;
        lookAround(i, j, (cell, i, j) => {
          if (cell.red) red++;
          if (cell.green) green++;
          if (cell.blue) blue++;
        });
        // so now we have the local area
        // and we want to iterate over a set
        // of rules 
        for (let k = 0; k < rules.length; k++) {
          const colors = rules[k](red, green, blue); 
          if (colors.red !== undefined) copy[i][j].red = colors.red;
          if (colors.green !== undefined) copy[i][j].green = colors.green;
          if (colors.blue !== undefined) copy[i][j].blue = colors.blue;
        }
        /*
        if (green > 1 && green < 3) {
          grow(cell, i, j);
        } else {
          kill(cell, i, j);
        }
        */
      });
      this.simMap = copy;
      return this.simMap;
    },

  }

};
