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
      loadCarsRequest();
    } catch (err) {
      resolve("No connection, showing offline results");
    }
    resolve("The connection is OK, showing latest results");
  });

  const promiseHanging = new Promise((resolve) =>
    setTimeout(resolve, 2000, "The connection is hanging, showing offline results")
  );
  return Promise.race([promiseRequest, promiseHanging]);
};

const loadCarsRequest = async () => {
  const requestURL = `${API_URL_LATEST}?carId=${await getLastItemId()}`;
  const response = await fetch(requestURL);
  const data = await response.json();
  // cache cars
  await addCars(data.cars);
  // cache car pages
  data.cars.forEach(preCacheDetailsPage);
};
