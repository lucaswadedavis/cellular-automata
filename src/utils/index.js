import uuid from 'uuid/v4';

export function map2D(arr, cb) {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    res.push([]);
    for (let j = 0;  j < arr[i].length; j++) {
      res[i][j] = cb(arr[i][j], i, j, arr);
    }
  }
  return res;
}

export const wrapAroundClamp = (n, min, max) => {
  if (n < min) return max;
  if (n > max) return min;
  return n;
};

export const clamp = (n, min, max) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

export const pick = arr => arr[(arr.length * Math.random()) | 0];

export const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);

export const rando = {
  name() {
    const phone = [
      'lu',
      'la',
      'go',
      'da',
      'vi',
      'nixa',
      'vis',
    ];
    let nf = capitalize(pick(phone) + pick(phone));
    let nl = capitalize(pick(phone) + pick(phone));
    return nf + ' ' + nl;
  },

  sex() {
    return pick(['male', 'female']);
  },

  intelligence() {
    return Math.random();
  },

  personality() {
    return {
      extraversion: Math.random(),
      openness: Math.random(),
      agreeableness: Math.random(),
      neuratocism: Math.random(),
      conceanciousness: Math.random(),
    };
  },

  morality() {
    return {
      harmCare: Math.random(), 
      fairnessCheating: Math.random(),
      loyaltyBetrayal: Math.random(),
      authoritySubversion: Math.random(),
      sanctityDegradation: Math.random(),
      libertyOpression: Math.random(),
    };
  },
}

const Npc = () => {
  return {
    id: uuid(),
    name: rando.name(),
    personality: rando.personality(),
    morality: rando.morality(),
    energy: 1,
    locale: null,
    sex: rando.sex(),
    intelligence: rando.intelligence(),
    skills: [],
    relationships: [],
    goods: [],
    factions: [],
  }
};

const npcs = [];
const n = 100;
for (let i = 0; i < n; i++) {
  npcs.push(Npc());
}

