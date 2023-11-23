"use strict";

import { updateWeather, error404 } from "./app.js";
const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;
      updateWeather(latitude, longitude);
    },
    (_err) => {
      window.location.hash = defaultLocation;
    }
  );
};

const searchLocation = (query) => {
  if (typeof query === "string" && query.trim() !== "") {
    const [latParam, lonParam] = query.split("&");
    const lat = latParam.split("=")[1];
    const lon = lonParam.split("=")[1];
    updateWeather(lat, lon);
  } else {
    console.error("Invalid query:", query);
  }
};
const checkHash = function () {
  const requestURL = window.location.hash.slice(1);
  const [route, query] = requestURL.includes("?")
    ? requestURL.split("?")
    : [requestURL, null];

  if (routes.has(route)) {
    routes.get(route)(query);
  } else {
    console.log("Route not found:", route);
    error404();
  }
};
const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchLocation],
]);
const changeHashToWeather = function () {
  window.location.hash = "#/weather?lat=51.5073219&lon=0.1276474";
};

changeHashToWeather();
window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
  window.location.hash.slice(1);
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});
