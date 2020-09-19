import { preCacheDetailsPage } from "./carPageService.js";
import { addCars, getCars, getLastItemId } from "./clientStorage.js";
import { API_URL_LATEST } from "./constants.js";
import { appendCars } from "./template.js";

export const loadCars = async () => {
  // Fetch, update cache and set status
  document.getElementById("connection-status").innerHTML = await fetchPromise();
  // Load cars from cache
  const cars = await getCars();
  // Append cars to HTML
  appendCars(cars);
};

export const fetchPromise = () => {
  const promiseRequest = new Promise(async (resolve) => {
    try {
      await loadCarsRequest();
    } catch (err) {
      resolve("No connection, showing offline results");
    }
    resolve("The connection is OK, showing latest results");
  });

  const promiseHanging = new Promise((resolve) =>
    setTimeout(resolve, 1000, "The connection is hanging, showing offline results")
  );
  return Promise.race([promiseRequest, promiseHanging]);
};

const loadCarsRequest = async () => {
  const response = await fetch(`${API_URL_LATEST}?carId=${await getLastItemId()}`);
  const data = await response.json();
  await addCars(data.cars);
  data.cars.forEach(preCacheDetailsPage);
};
