define(['./template.js'], function(template){
    var apiUrlPath = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/';
    var apiUrlLatest = apiUrlPath + 'latest-deals.php';
    var apiUrlCar = apiUrlPath + 'car.php?carId=';
    var lastCarID; 

    function loadMoreRequest(){
        fetch(apiUrlLatest + '?carId=' + lastCarID).then(function(response){
          return response.json();
        }).then(function(data){
          template.appendCars(data.cars);
        console.log(data.cars[data.cars.length - 1].key);
          lastCarID = data.cars[data.cars.length - 1].key;
        })
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
    
    return {
        loadMoreRequest: loadMoreRequest,
        loadCarPage: loadCarPage
    }
});