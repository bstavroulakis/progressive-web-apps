export default async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const swRegistration = await navigator.serviceWorker.register("sw.js", { scope: "" });
  let serviceWorker;

  if (swRegistration.installing) {
    console.log("Resolved at installing:  ", swRegistration);
    serviceWorker = swRegistration.installing;
  } else if (swRegistration.waiting) {
    console.log("Resolved at installed/waiting: ", swRegistration);
    serviceWorker = swRegistration.waiting;
  } else if (swRegistration.active) {
    console.log("Resolved at activated: ", swRegistration);
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

  //Check for an update every hour
  setInterval(() => {
    swRegistration.update();
  }, 1000 * 60 * 60);
};
