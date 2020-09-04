import { loadCarPage } from "./carPageService.js";
import { loadCars } from "./carService.js";
import swRegister from "./swRegister.js";

window.pageEvents = {
  loadCarPage: function (carId) {
    loadCarPage(carId);
  },
  loadMore: function () {
    loadCars();
  },
};

loadCars();
swRegister();
