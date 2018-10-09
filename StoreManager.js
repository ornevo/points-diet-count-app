import { AsyncStorage } from 'react-native';

import { FOODS, INIT_POINTS } from './constants'

const RESET = false;
const RESET_LOG = false; // Will only take effect if RESET=true.

const FOOD_ARR_KEY = 'FOODS_ARR'
const CURR_POINTS_KEY = 'CURRENT_POINTS'
const LAST_UPDATE_KEY = 'LAST_UPDATE' // Date in form DD/MM/YYYY
const LOG_KEY = 'LOG'
// const DEBT_KEY = "DEBT";

let currentPointsMap = []
let currentPoints = -1
let loadedLog = false;
let log = [];
// let debt = 0;

/* inner use */

async function save (key, value) {
  let _setData = async () => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.log('ERROR: Saving ' + key)
    }
  }
  _setData()
}

async function fetch (key, overrideIfError = false, defaultValue = undefined) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataAsJSON = await AsyncStorage.getItem(key)
			console.log('FETCHED ' + key, Date.now())
      const data = JSON.parse(dataAsJSON)

      if (data === null) throw Exception()

      resolve(data)
    } catch (e) {
      console.log('ERROR fetching key ' + key + (overrideIfError ? '. setting to default.' : '.'))
      if (overrideIfError) { save(key, defaultValue) }

      resolve(defaultValue)
    }
  })
}

function reset () {
  save(CURR_POINTS_KEY, INIT_POINTS);
  save(FOOD_ARR_KEY, FOODS);
  save(LAST_UPDATE_KEY, getDate());

	if(RESET_LOG)
		logPoints(FOODS[0], FOODS[0].points[0], 2);
}

function getDate () {
  const d = new Date()
  return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()
}

/* exported */

function initStoreManager (callback) {
  if (RESET) reset();

  // Let the log loading run in the background: it is not
  //    neccessary for the initial app state.
	else
	  fetch(LOG_KEY, true, []).then(loadedLogData => {
	    // Update log if a new log was registered while loading the previous
	    //    log.
	    loadedLog = true;

			if (!(typeof log === typeof [] && typeof loadedLogData === typeof [])) {
				console.log("TYPES ERROR",typeof log, typeof loadedLogData );
				return;
			}

	    log = log.concat(loadedLogData);
	    if (log.length > loadedLogData.length)
	      save(LOG_KEY, log);
	  });

  fetch(FOOD_ARR_KEY, true, FOODS).then(foodsArr => {
    currentPointsMap = foodsArr
    fetch(CURR_POINTS_KEY, true, INIT_POINTS).then(points => {
      fetch(LAST_UPDATE_KEY, true, getDate()).then(lastUpdate => {
        if (getDate() === lastUpdate) { currentPoints = points } else { currentPoints = INIT_POINTS }

        callback()
      })
    })
  })
}

function updateFood (updatedFood, foodIndex) {
  currentPointsMap[foodIndex] = updatedFood
  save(FOOD_ARR_KEY, currentPointsMap)
}

function addFood (newFood) {
  currentPointsMap.push(newFood)
  save(FOOD_ARR_KEY, currentPointsMap)
}

function removePoints (amountToDecrease) {
  currentPoints -= amountToDecrease
  save(CURR_POINTS_KEY, currentPoints)
  save(LAST_UPDATE_KEY, getDate())
}

// Just the message. The time and date are added by the function
function logPoints(food, unit, amount) {
  const now = new Date();
  log.splice(0, 0, {
		date: getDate(),
		hour: now.getHours() + ":" + now.getMinutes(),
		food,
		unit,
		amount
	});

	if (loadedLog || RESET_LOG)
  	save(LOG_KEY, log);
}


function getPointsMap () { return currentPointsMap }
function getPoints () { return currentPoints }
function getLog () { return log }

export default {
  initStoreManager,
  addFood,
  updateFood,
  removePoints,
  logPoints,
  getPointsMap,
  getPoints,
  getLog
}
