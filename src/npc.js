import uuid from 'uuid/v4';
import { rando } from './utils/';

export default function Npc() {
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
