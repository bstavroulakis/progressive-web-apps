export default async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const swRegistration = await navigator.serviceWorker.register("sw.js", {
    scope: "",
  });
  let serviceWorker;

  if (swRegistration.installing) {
    console.log("Resolved on installing: ", swRegistration);
    serviceWorker = swRegistration.installing;
  } else if (swRegistration.waiting) {
    console.log("Resolved on installed/waiting: ", swRegistration);
    serviceWorker = swRegistration.waiting;
  } else if (swRegistration.active) {
    console.log("Resolved on activated: ", swRegistration);
    serviceWorker = swRegistration.active;
  }

  serviceWorker.addEventListener("statechange", (e) => {
    console.log(e.target.state);
  });

  swRegistration.addEventListener("updatefound", () => {
    swRegistration.installing.addEventListener("statechange", (e) => {
      console.log("New service worker state: ", e.target.state);
    });
    console.log("New service worker found!", swRegistration);
  });

  //An extra event that is fired when the service worker controlling this page changes
  //through the self.skipWaiting()
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("Controller Changed!");
  });

  navigator.serviceWorker.addEventListener("message", (e) => {
    const clientId = e.data.clientId;
    const message = event.data.message;
    console.log("From Client: ", clientId, message);
  });

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage("hello");
  }

  setInterval(() => {
    swRegistration.update();
  }, 1000 * 5);
};
