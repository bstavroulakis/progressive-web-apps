define(['./template.js', './clientStorage.js'], function(template, clientStorage){
    var apiUrlPath = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/';
    var apiUrlLatest = apiUrlPath + 'latest-deals.php';
    var apiUrlCar = apiUrlPath + 'car.php?carId=';

    function loadMoreRequest(){
        fetchPromise()
        .then(function(status){
            document.getElementById("connection-status").innerHTML = status;
            loadMore();
        });
    }

    function fetchPromise(){
        return new Promise(function(resolve, reject){
            fetch(apiUrlLatest + '?carId=' + clientStorage.getLastCarId())
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                clientStorage.addCars(data.cars).then(function(){
                    data.cars.forEach(preCacheDetailsPage);
                    resolve("The connection is OK, showing latest results");
                });
            }).catch(function(e){
                resolve("No connection, showing offline results");
            });
            setTimeout(function(){resolve("The connection is hanging, showing offline results")}, 3000);
        });
    }

    function loadMore(){
        clientStorage.getCars().then(function(cars){
            template.appendCars(cars);
        });
    }

    function loadCarPage(carId){
        fetch(apiUrlCar + carId)
        .then(function(response){
            return response.text();
        }).then(function(data){
            document.body.insertAdjacentHTML('beforeend', data);
        }).catch(function(){
            alert("Oops, can't retrieve page");
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
        loadMoreRequest: loadMoreRequest
    }
});