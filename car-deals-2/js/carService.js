import { preCacheDetailsPage } from "./carPageService.js";
import clientStorage from "./clientStorage.js";
import { API_URL_LATEST } from "./constants.js";
import template from "./template.js";

export const loadCars = async () => {
  let status = "";
  try {
    status = await fetchPromise();
  } catch {
    status = "No connection, showing offline results";
  }
  document.getElementById("connection-status").innerHTML = status;

  const cars = await clientStorage.getCars();
  template.appendCars(cars);
};

export const fetchPromise = () => {
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
};
