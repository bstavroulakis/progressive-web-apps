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
            fetch(apiUrlLatest + '?carId=' + clientStorage.getLastCarId() + "&description=1")
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                clientStorage.addCars(data.cars).then(function(){
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
            addImages(cars);
        });
    }

    function fetchImage(car){
        fetch(car.image.replace("car-image", "car-image-blob")).then(function(response){
            return response.text();
        }).then(function(data){
            clientStorage.addCarImage(car.details_id, data);
            appendImage(car.id, data);
        });
    }

    function addImages(cars){
        for(var i = 0; i < cars.length; i++){
            var car = cars[i];
            (function(car){
                clientStorage.getCarImage(car.details_id)
                .then(function(data){
                    appendImage(car.id, data);
                }).catch(function(){
                    fetchImage(car);
                });
            }(car));
        }
    }

    function appendImage(id, data){
        document.getElementById(id).style.backgroundImage = "url('data:image/jpeg;base64," + data + "')";
    }

    function loadCarPage(carId){
        clientStorage.getDetailsTemplate()
        .then(function(data){
            var template = data;
            clientStorage.getCar(carId)
            .then(function(car){
                template = template.replace("{{title}}", car.brand + " " + car.model + " " + car.year);
                template = template.replace("{{description}}", car.description);
                clientStorage.getCarImage(car.details_id)
                .then(function(data){
                    template = template.replace("{{image-data}}", data);
                    document.body.insertAdjacentHTML('beforeend', template);
                });
            });
            
        })
    }

    function preCacheDetailsTemplate(){
        fetch('templates/car-details.html')
        .then(function(response){
            return response.text();
        })
        .then(function(data){
            clientStorage.setDetailsTemplate(data);
        })
    }

    preCacheDetailsTemplate();

    return {
        loadCarPage: loadCarPage,
        loadMoreRequest: loadMoreRequest
    }
});