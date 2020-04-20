export const MAP_TYPES = {
  COUNTRY: 'country',
  STATE: 'state',
};

export const MAPS_DIR = '/maps';

export const MAP_META = {
  Myanmar: {
    name: 'Myanmar',
    geoDataFile: `${MAPS_DIR}/myanmar.json`,
    mapType: MAP_TYPES.COUNTRY,
    graphObjectName: 'myanmar',
  },
  Ayeyarwady: {
    name: 'Ayeyarwady',
    geoDataFile: `${MAPS_DIR}/ayeyarwady.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'ayeyarwady',
  },
  Bago: {
    name: 'Bago',
    geoDataFile: `${MAPS_DIR}/bago.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'bago',
  },
  Chin: {
    name: 'Chin',
    geoDataFile: `${MAPS_DIR}/chin.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'chin',
  },
  Kachin: {
    name: 'Kachin',
    geoDataFile: `${MAPS_DIR}/kachin.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kachin',
  },
  Kayah: {
    name: 'Kayah',
    geoDataFile: `${MAPS_DIR}/kayah.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kayah',
  },
  Kayin: {
    name: 'Kayin',
    geoDataFile: `${MAPS_DIR}/kayin.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'kayin',
  },
  Magway: {
    name: 'Magway',
    geoDataFile: `${MAPS_DIR}/magway.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'magway',
  },
  Mandalay: {
    name: 'Mandalay',
    geoDataFile: `${MAPS_DIR}/mandalay.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'mandalay',
  },
  Mon: {
    name: 'Mon',
    geoDataFile: `${MAPS_DIR}/mon.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'mon',
  },
  'Nay Pyi Taw': {
    name: 'Nay Pyi Taw',
    geoDataFile: `${MAPS_DIR}/naypyitaw.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'naypyitaw',
  },
  Rakhine: {
    name: 'Rakhine',
    geoDataFile: `${MAPS_DIR}/rakhine.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'rakhine',
  },
  Sagaing: {
    name: 'Sagaing',
    geoDataFile: `${MAPS_DIR}/sagaing.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'sagaing',
  },
  Shan: {
    name: 'Shan',
    geoDataFile: `${MAPS_DIR}/shan.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'shan',
  },
  Tanintaryi: {
    name: 'Tanintaryi',
    geoDataFile: `${MAPS_DIR}/tanintaryi.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'tanintaryi',
  },
  Yangon: {
    name: 'Yangon',
    geoDataFile: `${MAPS_DIR}/yangon.json`,
    mapType: MAP_TYPES.STATE,
    graphObjectName: 'yangon',
  },
};

export const STATE_CODES = {
  "MM-07": 'Ayayarwady',
  "MM-02": 'Bago',
  "MM-14": 'Chin',
  "MM-11": 'Kachin',
  "MM-12": 'Kayah',
  "MM-13": 'Kayin',
  "MM-03": 'Magway',
  "MM-04": 'Mandalay',
  "MM-15": 'Mon',
  "MM-18": 'Nay Pyi Taw',
  "MM-16": 'Rakhine',
  "MM-01": 'Sagaing',
  "MM-17": 'Shan',
  "MM-05": 'Tanintaryi',
  "MM-06": 'Yangon',
};

const reverseStateCodes = {};
Object.keys(STATE_CODES).map((key, index) => {
  reverseStateCodes[STATE_CODES[key]] = key;
  return null;
});
export const STATE_CODES_REVERSE = reverseStateCodes;

const stateCodes = [];
Object.keys(STATE_CODES).map((key, index) => {
  stateCodes.push({code: key, name: STATE_CODES[key]});
  return null;
});
export const STATE_CODES_ARRAY = stateCodes;

export const DISTRICTS_ARRAY = [
  
];
