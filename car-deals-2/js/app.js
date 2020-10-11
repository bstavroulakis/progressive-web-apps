import { loadCarPage } from "./carPageService.js";
import { loadCars } from "./carService.js";

window.pageEvents = {
  loadCarPage,
};

loadCars();
