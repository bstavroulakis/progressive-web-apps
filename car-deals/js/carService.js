define(['./template.js', './clientStorage.js'], function(template, clientStorage){
    var apiUrlPath = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/';
    var apiUrlLatest = apiUrlPath + 'latest-deals.php';
    var apiUrlCar = apiUrlPath + 'car.php?carId=';
    var firstLoad = true;

    function offlineFirstStrategy(){
        clientStorage.getCars().then(function(cars){
            if(firstLoad){
                document.querySelector('.mdl-grid').innerHTML = "";
                firstLoad = false;
            }
            if(cars.length == 0){
                fetchCarsAndCache();
            }else{
                template.appendCars(cars);
                refreshLoadTime();
            }
        });
    }
    
    function fetchCarsAndCache(){
        fetch(apiUrlLatest + '?carId=' + clientStorage.getLastCarId())
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            clientStorage.addCars(data.cars).then(function(){
                loadMore();
            });
            data.cars.forEach(preCacheDetailsPage);
            localforage.setItem('carsLastUpdate', new Date().toLocaleString());
        }).catch(function(e){
            loadMore();
        });
    }

    function loadMore(){
        clientStorage.getCars().then(function(cars){
            template.appendCars(cars);
            refreshLoadTime();
        });
    }

    function refreshLoadTime(){
        localforage.getItem('carsLastUpdate', function(err, value){
            document.querySelector('.last-update').innerHTML = prettyDate(value);
        });
    }

    function resetList(){
        document.querySelector('.mdl-grid').innerHTML = "";
        clientStorage.resetList();
        fetchCarsAndCache();
    }

    function loadCarPage(carId){
        fetch(apiUrlCar + carId)
        .then(function(response){
            return response.text();
        }).then(function(data){
            document.body.insertAdjacentHTML('beforeend', data);
        });
    }

    function preCacheDetailsPage(car){
        if ('serviceWorker' in navigator) {
            var carDetailsUrl = apiUrlCar + car.value.details_id;
            window.caches.open('carDealsCachePagesV1').then(function(cache) {
                cache.match(carDetailsUrl).then(function(response){
                    if(!response) cache.add(new Request(carDetailsUrl));
                })
            });
        }
    }

    return {
        loadCarPage: loadCarPage,
        fetchCarsAndCache: fetchCarsAndCache,
        offlineFirstStrategy: offlineFirstStrategy,
        resetList: resetList
    }
});