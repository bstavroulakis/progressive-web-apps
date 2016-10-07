if ('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('sw.js', {scope:''})
  .then(function(swRegistration) { 
    
    var serviceWorker;

    if(swRegistration.installing){
      console.log('installing:  ', swRegistration);
      serviceWorker = swRegistration.installing;
    } else if (swRegistration.waiting){
      console.log('installed/waiting: ', swRegistration);
      serviceWorker = swRegistration.waiting; 
    } else if (swRegistration.active){
      console.log('activated: ', swRegistration);
      serviceWorker = swRegistration.active; 
    }

    if (serviceWorker) {
      serviceWorker.addEventListener('statechange', function (e) {
          console.log(e.target.state);
      });
    }

    swRegistration.addEventListener('updatefound', function(e){
      swRegistration.installing.addEventListener('statechange', function (e) {
          console.log(e.target.state);
      });
      console.log("New Service Worker Found!", swRegistration)
    });

    //Check for an update every hour
    setInterval(function(){
      swRegistration.update();
    },1000*60*60);

  }).catch(function(error) {
    console.log('Error occurred', error);
  });
  
} 

//An extra event that is fired when the service worker controlling this page changes
//through the self.skipWaiting()
navigator.serviceWorker.addEventListener('controllerchange', function(e){
  console.log("Controller Changed!");
});