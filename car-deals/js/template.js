define([], function(){

    function generateCarCard(car){
      var template = document.querySelector('#car-card').innerHTML;
      var title = car.brand + ' ' + car.model + ' ' + car.year;
      template = template.replace("{{title}}", title);
      template = template.replace('{{details-id}}', car.details_id);
      template = template.replace('{{image}}', car.image);
      template = template.replace('{{price}}', car.price);
      return template;
    };

    function appendCars(cars){
        document.getElementById('first-load').innerHTML = "";
        var cardHTML = "";
        for(var i = 0; i < cars.length; i++){
            cardHTML += generateCarCard(cars[i]);
        }
        document.querySelector('.mdl-grid').insertAdjacentHTML('beforeend', cardHTML);
        //Force Redraw Fix for IE
        document.querySelector('.mdl-layout__content').style.display = 'none';
        document.querySelector('.mdl-layout__content').style.display = "inline-block";
    }

    return {
        appendCars: appendCars
    };

});