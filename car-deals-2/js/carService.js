import clientStorage from "./clientStorage.js";
import template from "./template.js";

const API_URL_PATH =
  "https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/";
const API_URL_LATEST = `${API_URL_PATH}latest-deals.php`;
const API_URL_CAR = `${API_URL_PATH}car.php?carId=`;

async function loadMoreRequest() {
  document.getElementById("show-more").disabled = true;
  const status = await fetchPromise();
  document.getElementById("connection-status").innerHTML = status;
  await loadMore();
  document.getElementById("show-more").disabled = false;
}

function fetchPromise() {
  const promiseRequest = new Promise(async (resolve) => {
    const response = await fetch(
      `${API_URL_LATEST}?carId=${clientStorage.getLastCarId()}`
    );
    const data = await response.json();
    await clientStorage.addCars(data.cars);
    resolve("The connection is OK, showing latest results");
  });

  const promiseHanging = new Promise((resolve) =>
    setTimeout(() => {
      resolve("The connection is hanging, showing offline results");
    }, 3000)
  );
  return Promise.race([promiseRequest, promiseHanging]);
}

async function loadMore() {
  const cars = await clientStorage.getCars();
  if (!cars) return;
  template.appendCars(cars);
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
