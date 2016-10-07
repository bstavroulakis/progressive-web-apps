var carService = require('./carService.js');
var serviceWorker = require('./swRegister.js');
//var manifest = require('./manifest.js');

document.pageEvents = {
    loadCarPage : function(carId){
        carService.loadCarPage(carId);
    },
    loadMore: function(){
        carService.offlineFirstStrategy();
    },
    loadNew: function(){
        carService.resetList();
    }
}

carService.offlineFirstStrategy();