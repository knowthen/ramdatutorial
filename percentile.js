const R = require('ramda');
module.exports = (array, value) => {
  const length = R.length(array);
  const eqVal = R.equals(value);
  const alen = !R.any(eqVal, array)
    ? R.range(0, length + 1)
    : R.range(0, length);
  const sortedArray = R.sort((a, b) => a - b, array);
  const idx = R.map(eqVal, sortedArray);
  const alenTrue = R.filter((v, i) => {
    return idx[alen.indexOf(v)] === true;
  }, alen);
  const mean = R.mean(alenTrue);
  const percent = mean / length;
  return percent;
};
