"use strict";
// version 0.1

const carDealsCacheName = "carDealsCacheV1";
const carDealsCacheImagesName = "carDealsCacheImagesV1";
const carDealsCachePagesName = "carDealsCachePagesV1";
const carDealsCache = [
  carDealsCacheName,
  carDealsCacheImagesName,
  carDealsCachePagesName,
];
const carDealsCacheFiles = [
  "https://cdn.jsdelivr.net/npm/pwacompat@2.0.17/pwacompat.min.js",
  "https://cdn.jsdelivr.net/gh/bstavroulakis/progressive-web-apps/resources/localforage.js",
  "js/app.js",
  "js/carPageService.js",
  "js/carService.js",
  "js/clientStorage.js",
  "js/constants.js",
  "js/swRegister.js",
  "js/template.js",
  "/",
  "index.html",
  "style.css",
];

const latestPath =
  "/pluralsight/courses/progressive-web-apps/service/latest-deals.php";
const imagePath =
  "/pluralsight/courses/progressive-web-apps/service/car-image.php";
const carPath = "/pluralsight/courses/progressive-web-apps/service/car.php";

self.addEventListener("install", (event) => {
  console.log("From SW: Install Event");
  self.skipWaiting();
  const preCache = async () => {
    const cache = await caches.open(carDealsCacheName);
    return cache.addAll(carDealsCacheFiles);
  };
  event.waitUntil(preCache());
});

self.addEventListener("activate", (event) => {
  console.log("From SW: Activate Event");
  self.clients.claim();
  const clearCache = async () => {
    const keys = await caches.keys();
    keys.forEach(async (k) => {
      if (carDealsCache.includes(k)) {
        return;
      }
      await caches.delete(k);
    });
  };
  event.waitUntil(clearCache());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  const requestPath = requestUrl.pathname;
  const fileName = requestPath.substring(requestPath.lastIndexOf("/") + 1);
  if (requestPath == latestPath || fileName == "sw.js") {
    return event.respondWith(fetch(event.request));
  } else if (requestPath === imagePath) {
    return event.respondWith(networkFirstStrategy(event.request));
  }
  return event.respondWith(cacheFirstStrategy(event.request));
});

const cacheFirstStrategy = async (request) => {
  const cacheResponse = await caches.match(request);
  return cacheResponse || fetchRequestAndCache(request);
};

const networkFirstStrategy = async (request) => {
  try {
    return await fetchRequestAndCache(request);
  } catch {
    return await caches.match(request);
  }
};

const fetchRequestAndCache = async (request) => {
  const networkResponse = await fetch(request);
  const clonedResponse = networkResponse.clone();
  const cache = await caches.open(getCacheName(request));
  cache.put(request, networkResponse);
  return clonedResponse;
};

const getCacheName = (request) => {
  const requestUrl = new URL(request.url);
  const requestPath = requestUrl.pathname;

  if (requestPath == imagePath) {
    return carDealsCacheImagesName;
  } else if (requestPath == carPath) {
    return carDealsCachePagesName;
  } else {
    return carDealsCacheName;
  }
};

self.addEventListener("message", (e) => {
  e.source.postMessage({ clientId: e.source.id, message: "sw" });
});
