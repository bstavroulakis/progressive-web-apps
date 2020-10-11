import { API_URL_CAR } from "./constants.js";

export const loadCarPage = async (carId) => {
  const response = await fetch(`${API_URL_CAR}${carId}`);
  const responseText = await response.text();
  document.body.innerHTML += responseText;
};
