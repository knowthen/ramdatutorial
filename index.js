const R = require('ramda');
const cities = require('./cities.json');

const KtoC = k => k - 273.15;

const updateTemperature = city => {
  const temp = Math.round(KtoC(city.temp));
  return R.merge(city, { temp });
}

const updatedCities = cities.map(updateTemperature);

console.log(updatedCities);