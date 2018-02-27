const R = require('ramda');
const cities = require('./cities.json');
const percentile = require('./percentile');

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

// console.log(groupedByProp);

const calcScore = city => {
  const { cost = 0, internetSpeed = 0 } = city;
  const costPercentile = percentile(groupedByProp.cost, cost);
  const internetSpeedPercentile = percentile(
    groupedByProp.internetSpeed,
    internetSpeed,
  );
  const score =
    100 * (1.0 - costPercentile) +
    20 * internetSpeedPercentile; 
  return R.merge(city, { score });
}

const scoredCities = R.map(calcScore, updatedCities);

// console.log(scoredCities);

const filterByWeather = city => {
  const { temp = 0, humidity = 0 } = city;
  return temp > 68 && temp < 85 && humidity > 30 && humidity < 70;
}

const filteredCities = R.filter(filterByWeather, scoredCities);

console.log(R.length(filteredCities));