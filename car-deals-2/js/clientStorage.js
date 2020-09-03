const LIMIT = 3;
const carsInstance = localforage.createInstance({
  name: "cars",
});
let lastItemId = null;

const addCars = async (newCars) => {
  await carsInstance.setItems(newCars);
};

const getCars = async () => {
  const keys = await carsInstance.keys();
  let index = keys.indexOf(lastItemId);
  if (index === 0) return;
  index = index === -1 ? keys.length : index;

  const limitKeys = keys.splice(index - LIMIT, LIMIT);
  const results = await carsInstance.getItems(limitKeys);
  const returnArr = limitKeys.map((k) => results[k]);
  lastItemId = returnArr[0].id;
  return returnArr.reverse();
};

const getLastCarId = () => {
  return lastItemId;
};

export default {
  addCars: addCars,
  getCars: getCars,
  getLastCarId: getLastCarId,
};
