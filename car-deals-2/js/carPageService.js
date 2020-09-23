import { API_URL_CAR } from "./constants.js";

export const loadCarPage = async (carId) => {
  const response = await fetch(`${API_URL_CAR}${carId}`);
  const responseText = await response.text();
  document.body.innerHTML += responseText;
};

export const preCacheDetailsPage = async (car) => {
  const carDetailsUrl = `${API_URL_CAR}${car.value.details_id}`;
  const cache = await window.caches.open("carDealsCachePagesV1");
  const response = await cache.match(carDetailsUrl);
  if (!response) cache.add(new Request(carDetailsUrl));
};
