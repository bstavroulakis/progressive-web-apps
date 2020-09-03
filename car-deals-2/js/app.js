import carService from "./carService.js";
import swRegister from "./swRegister.js";

window.pageEvents = {
  loadCarPage: function (carId) {
    carService.loadCarPage(carId);
  },
  loadMore: function () {
    carService.loadMoreRequest();
  },
};

carService.loadMoreRequest();
swRegister();
