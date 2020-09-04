import clientStorage from "./clientStorage.js";
import { API_URL_CAR, API_URL_LATEST } from "./constants.js";
import template from "./template.js";

async function loadMoreRequest() {
  let status = "";
  try {
    status = await fetchPromise();
  } catch {
    status = "No connection, showing offline results";
  }

  document.getElementById("connection-status").innerHTML = status;

  const cars = await clientStorage.getCars();
  if (!cars) return;
  template.appendCars(cars);
}

function fetchPromise() {
  const promiseRequest = new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${API_URL_LATEST}?carId=${clientStorage.getLastCarId()}`
      );
      const data = await response.json();
      await clientStorage.addCars(data.cars);
      data.cars.forEach(preCacheDetailsPage);
    } catch {
      reject();
    }
    resolve("The connection is OK, showing latest results");
  });

  const promiseHanging = new Promise((resolve) =>
    setTimeout(() => {
      resolve("The connection is hanging, showing offline results");
    }, 3000)
  );
  return Promise.race([promiseRequest, promiseHanging]);
}

async function loadCarPage(carId) {
  const response = await fetch(`${API_URL_CAR}${carId}`);
  const responseText = await response.text();
  document.body.insertAdjacentHTML("beforeend", responseText);
}

async function preCacheDetailsPage(car) {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const carDetailsUrl = API_URL_CAR + car.value.details_id;
  const cache = await window.caches.open("carDealsCachePagesV1");
  const response = await cache.match(carDetailsUrl);
  if (!response) cache.add(new Request(carDetailsUrl));
}

export default {
  loadCarPage: loadCarPage,
  loadMoreRequest: loadMoreRequest,
};
