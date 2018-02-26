const R = require('ramda');
const cities = require('./cities.json');

const KtoC = k => k - 273.15;
const KtoF = k => k * 9 / 5 - 459.67;

const updateTemperature = R.curry((convertFn, city) => {
  const temp = Math.round(convertFn(city.temp));
  return R.merge(city, { temp });
});

const updatedCities = R.map(updateTemperature(KtoF), cities);

// console.log(updatedCities);

const city = cities[0];
const updatedCity = updateTemperature(KtoF, city);
// console.log(updatedCity);

const totalCostReducer = (acc, city) => {
  const { cost = 0 } = city;
  return acc + cost;
}

const totalCost = R.reduce(totalCostReducer, 0, updatedCities);
const cityCount = R.length(updatedCities);
// console.log(totalCost / cityCount);

const groupByPropReducer = (acc, city) => {
  const { cost = [], internetSpeed = [] } = acc;
  return R.merge(acc, {
    cost: R.append(city.cost, cost),
    internetSpeed: R.append(city.internetSpeed, internetSpeed),
  });
}

const groupedByProp = R.reduce(groupByPropReducer, {}, updatedCities);

console.log(groupedByProp);