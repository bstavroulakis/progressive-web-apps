const carsInstance = localforage.createInstance({
  name: "cars",
});
let lastItemId = null;

const addCars = async (newCars) => {
  await carsInstance.setItems(newCars);
};

const getCars = async () => {
  // Example: keys = [6,5,4,3,2,1], lastIndexId = null
  const keys = (await carsInstance.keys()).reverse();
  // Find the next index of the last item in view
  // Example: keys = [6,5,4,3,2,1], index = 0
  let nextIndex = lastItemId ? keys.indexOf(lastItemId) + 1 : 0;
  if (nextIndex === keys.length) return;
  // Get the three next keys
  // Example: keys = [6,5,4,3,2,1], index = 0, limitKeys = [6,5,4]
  const limitKeys = keys.slice(nextIndex, nextIndex + 3);
  // Find the three cars using those keys in the cache
  // Example: results = {"6":{"car6"},"5":{"car5"}, "4":{"car4"}}
  const results = await carsInstance.getItems([...limitKeys]);
  // Map the object into an array
  // Example: resultsArray = ["car6","car5","car4"]
  const resultsArr = limitKeys.map((k) => results[k]);
  // Store the last key
  // Example: lastItemId = 4
  lastItemId = limitKeys[limitKeys.length - 1];
  return resultsArr;
};

const getLastCarId = () => {
  return lastItemId;
};

export default {
  addCars: addCars,
  getCars: getCars,
  getLastCarId: getLastCarId,
};
