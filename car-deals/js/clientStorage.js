define([], function(){
    var lastItemId = null; var limit = 3;
    var carsInstance = localforage.createInstance({
        name: "cars"
    });
    var carImagesInstance = localforage.createInstance({
        name: "carImages"
    });
    var carPagesInstance = localforage.createInstance({
        name: "carPages"
    });

    function addCars(newCars){
        return new Promise(function(resolve, reject){
            carsInstance.setItems(newCars).then(function(){
                resolve();
            })
        })
    }

    function getCars(){
        return new Promise(function(resolve, reject){
            carsInstance.keys().then(function(keys){
                
                var index = keys.indexOf(lastItemId);
                if(index == -1){ index = keys.length; }
                if(index ==  0){ resolve([]); return; }

                var keys = keys.splice(index - limit, limit);
                carsInstance.getItems(keys).then(function(results){
                    var returnArr = Object.keys(results).map(function(k) { return results[k] }).reverse();
                    lastItemId = returnArr[returnArr.length-1].id;
                    resolve(returnArr);
                });
            })
        })
    }

    function getCar(carId){
        return new Promise(function(resolve, reject){
            var keys = [parseInt(carId)];
            carsInstance.getItems(keys)
            .then(function(car){
                resolve(car[carId]);
            })
        })
    }

    function getCarImage(carId){
        return new Promise(function(resolve, reject){
            carImagesInstance.getItem(carId).then(function(data){
                if(data == null){
                    reject();
                }
                resolve(data);
            }).catch(function(){
                reject();
            })
        })
    }

    function addCarImage(carId, data){
        return new Promise(function(resolve){
            carImagesInstance.setItem(carId, data)
            .then(function(){
                resolve();
            })
        });
    }

    function getDetailsTemplate(){
        return new Promise(function(resolve, reject){
            carPagesInstance.getItem('detailsTemplate')
            .then(function(data){
                resolve(data);
            })
        })
    }

    function setDetailsTemplate(data){
        return new Promise(function(resolve, reject){
            carPagesInstance.setItem('detailsTemplate', data)
            .then(function(){
                resolve();
            })
        })
    }

    function getLastCarId(){
        return lastItemId;
    }

    return {
        getCar:getCar,
        getDetailsTemplate:getDetailsTemplate,
        setDetailsTemplate:setDetailsTemplate,
        addCarImage:addCarImage,
        getCarImage:getCarImage,
        addCars:addCars,
        getCars:getCars,
        getLastCarId:getLastCarId
    };
});