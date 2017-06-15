"use strict";

var carDealsCacheName = 'carDealsCacheV1';
var carDealsCacheImagesName = 'carDealsCacheImagesV1';
var carDealsCachePagesName = 'carDealsCachePagesV1';

var carDealsCacheFiles = [
  'js/app.js', 
  'js/carService.js',
  'js/clientStorage.js',
  'js/swRegister.js',
  'js/template.js',
  'favicon.ico',
  './',
  'resources/es6-promise/es6-promise.js',
  'resources/es6-promise/es6-promise.map',
  'resources/fetch/fetch.js',
  'resources/localforage/localforage.min.js',
  'resources/localforage/localforage-getitems.js',
  'resources/localforage/localforage-setitems.js',
  'resources/material-design-lite/material.min.js',
  'resources/material-design-lite/material.min.js.map',
  'resources/material-design-lite/material.red-indigo.min.css',
  'resources/systemjs/system.js',
  'resources/systemjs/system-polyfills.js',
  'resources/systemjs/system.js.map',
  'resources/systemjs/system.src.js'
];

var latestPath = '/pluralsight/courses/progressive-web-apps/service/latest-deals.php';
var imagePath = '/pluralsight/courses/progressive-web-apps/service/car-image.php';
var carPath = '/pluralsight/courses/progressive-web-apps/service/car.php';

//Installing
//Pre-cache App Shell
self.addEventListener('install', function(event) {
  console.log("From SW: Install Event");
  self.skipWaiting();
  event.waitUntil(
    caches.open(carDealsCacheName)
    .then(function(cache){
      return cache.addAll(carDealsCacheFiles)
    })
  );
});
//V2
//Activating
//Clean up
self.addEventListener('activate', function(event) {
  console.log("From SW: Activate Event");
  self.clients.claim();
  event.waitUntil(
    caches.keys()
      .then(function(cacheKeys){
        var deletePromises = [];
        for(var i = 0; i < cacheKeys.length; i++){
          if(cacheKeys[i] != carDealsCacheName &&
             cacheKeys[i] != carDealsCacheImagesName &&
             cacheKeys[i] != carDealsCachePagesName){
            deletePromises.push(caches.delete(cacheKeys[i]));
          }
        }
        return Promise.all(deletePromises);
      })
  );
});

//Event Listeners Once Activated
self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  var requestPath = requestUrl.pathname;
  var fileName = requestPath.substring(requestPath.lastIndexOf('/')+1);

  if(requestPath == latestPath || fileName == "sw.js"){
    //Network Only Strategy
    event.respondWith(fetch(event.request));
  }else if(requestPath == imagePath){
    //Network First then Offline Strategy
    event.respondWith(networkFirstStrategy(event.request));
  }else{
    //Offline First then Network Strategy
    event.respondWith(cacheFirstStrategy(event.request));
  }
});

//Caching Strategies
function cacheFirstStrategy(request){
  return caches.match(request).then(function(cacheResponse){
    return cacheResponse || fetchRequestAndCache(request);
  });
}

function networkFirstStrategy(request){
  return fetchRequestAndCache(request).catch(function(response){
    return caches.match(request);
  })
}

//Fetch Request And Cache
function fetchRequestAndCache(request){
    return fetch(request).then(function(networkResponse){
      caches.open(getCacheName(request)).then(function(cache) {
        cache.put(request, networkResponse);
      })
      return networkResponse.clone();
    });
}

function getCacheName(request){
  var requestUrl = new URL(request.url);
  var requestPath = requestUrl.pathname;
    
  if(requestPath == imagePath){
    return carDealsCacheImagesName;
  }else if(requestPath == carPath){
    return carDealsCachePagesName;
  }else{
    return carDealsCacheName;
  }
}

/*self.addEventListener('message', function(event) {
  var sourceID = event.source ? event.source.id : 'unknown';
  event.waitUntil(
    event.source.postMessage({
        sourceID: sourceID,
        message: 'sw:' + event.data
      })
  );
});*/
