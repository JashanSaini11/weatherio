"use strict";

import { fetchData, url } from "./api.js";
import {
  apiText,
  getDate,
  getHours,
  getTime,
  mps_to_kmh,
  monthName,
  weekDayName,
} from "./module.js";

/**
 * Add event listener on multiple elements
 * @param {NodeList} elements Elements node array
 * @param {string} eventType Event Type e.g: "click", "mouseover"
 * @param {Function} callback Callback function
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};

/**
 * Toggle search in mobile devices
 */
const searchView = document.querySelector("[data-search-view]");
const searchToggles = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => {
  searchView.classList.toggle("action");
  searchResult.innerHTML = "";
  searchField.value = "";
};

addEventOnElements(searchToggles, "click", toggleSearch);
/**
 * Search Integration
 */
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      const apiKey = "9f030a90f49ca95e845cd337222d90ba";
      const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchField.value}&limit=5&appid=${apiKey}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((locations) => {
          searchField.classList.remove("searching");
          searchResult.classList.add("action");
          searchResult.innerHTML = `
           <ul class="view-list" data-search-list></ul>
           `;

          const items = [];

          for (const { name, lat, lon, country, state } of locations) {
            const searchItem = document.createElement("li");
            searchItem.classList.add("view-item");
            searchItem.innerHTML = `
               <i class="fa-solid fa-location-dot" style="color: #ffffff"></i>
               <div>
                 <p class="item-title">${name}</p>
                 <p class="label-2 item-subtitle">${state || ""}, ${country}</p>
               </div>
               <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label=${name} data-search-toggler></a>
             `;

            searchResult
              .querySelector("[data-search-list]")
              .appendChild(searchItem);
            items.push(searchItem.querySelector("[data-search-toggler]"));
          }

          addEventOnElements(items, "click", function () {
            toggleSearch();
            searchResult.classList.remove("action");
          });
        });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);
const errorContent = document.querySelector("[data-error-content]");
/**
 * Render all weather data on the HTML page
 * @param {number} lat
 * @param {number} lon
 */
export const updateWeather = function (lat, lon) {
  loading.style.display = "grid";
  container.style.overflowY = "hidden";
  container.classList.remove("fade-in");
  errorContent.style.display = "none";
  const currentWeatherSection = document.querySelector(
    "[data-current-weather]"
  );
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";
  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

  /**
   * Current Weather Section
   */
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    const {
      weather,
      dt: dataUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;
    const [{ description, icon }] = weather;

    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");

    card.innerHTML = `
    <h2 class="title-2 card-title">Now</h2>

    <div class="weapper">
    <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

    <img src="./images/weather_icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">


    </div>
    <p class="body-3">${description}</p>
    <li class="meta-item">
      <i class="fa-regular fa-calendar"></i>
      <p class="title-3 meta-text">${getDate(dataUnix, timezone)}</p>
    </li>
    <li class="meta-item">
    <i class="fa-sharp fa-solid fa-location-dot"></i>

    <p class="title-3 meta-text" data-location></p>

    </li> 
    `;

    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
    });

    currentWeatherSection.appendChild(card);
    /**
     *Today Highlights
     */
    fetchData(url.airPollution(lat, lon), function (airPollution) {
      const [
        {
          main: { api },
          components: { no2, o3, so2, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");

      card.innerHTML = `
                  <h2 class="tital-2" id="highlights-label">Todays Highlights</h2>
                  <div class="highlights-list">
                    <div class="card card-sm highlight-card one">
                      <h3 class="title-3">Air Quality Index</h3>
                      <div class="wrapper1">
                        <i
                          class="fa-regular fa-wind m-icon"
                          style="color: #ffffff"
                        ></i>
                        <ul class="card-list">
                          <li class="card-item1">
                            <p class="title-1">${pm2_5.toPrecision(3)}</p>

                            <p class="label-0">PM<sub>2</sub></p>
                          </li>
                          <li class="card-item1">
                            <p class="title-1">${so2.toPrecision(3)}</p>

                            <p class="label-0">SO<sub>2</sub></p>
                          </li>
                          <li class="card-item1">
                            <p class="title-1">${no2.toPrecision(3)}</p>

                            <p class="label-0">NO<sub>2</sub></p>
                          </li>
                          <li class="card-item1">
                            <p class="title-1">${o3.toPrecision(3)}</p>

                            <p class="label-0">O<sub>3</sub></p>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="card card-sm highlight-card two">
                      <h3 class="title-3">Sunrise & Sunset</h3>
                      <div class="card-list">
                        <div class="card-item2">
                          <i
                            class="m-icon fa-regular fa-sun-bright"
                            style="color: #ffffff"
                          ></i>

                          <div>
                            <p class="weather-text">Sunrise</p>

                            <p class="title-1">${getTime(
                              sunriseUnixUTC,
                              timezone
                            )}</p>
                          </div>
                        </div>
                        <div class="card-item2">
                          <i
                            class="m-icon fa-regular fa-moon"
                            style="color: #ffffff"
                          ></i>

                          <div>
                            <p class="weather-text">Sunset</p>

                            <p class="title-1">${getTime(
                              sunsetUnixUTC,
                              timezone
                            )}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="card card-sm highlight-card">
                      <h3 class="title-3">Humidity</h3>

                      <div class="wrapper1">
                        <i
                          class="fa fa-droplet-percent m-icon"
                          style="color: #ffffff"
                        ></i>

                        <p class="title-1">${humidity}<sub>%</sub></p>
                      </div>
                    </div>

                    <div class="card card-sm highlight-card">
                      <h3 class="title-3">Pressure</h3>

                      <div class="wrapper1">
                        <i
                          class="m-icon fa-regular fa-water fa-rotate-180"
                          style="color: #ffffff"
                        ></i>

                        <p class="title-1">${pressure}<sub>hPa</sub></p>
                      </div>
                    </div>

                    <div class="card card-sm highlight-card">
                      <h3 class="title-3">Visibility</h3>

                      <div class="wrapper1">
                        <i
                          class="fa-sharp fa-regular fa-eye m-icon"
                          style="color: #ffffff"
                        ></i>

                        <p class="title-1">${visibility / 1000}<sub>Km</sub></p>
                      </div>
                    </div>

                    <div class="card card-sm highlight-card">
                      <h3 class="title-3">Feels Like</h3>

                      <div class="wrapper1">
                        <i
                          class="fa-regular fa-temperature-list m-icon"
                          style="color: #ffffff"
                        ></i>

                        <p class="title-1">${parseInt(
                          feels_like
                        )}&deg;<sup>C</sup></p>
                      </div>
                    </div>
                  </div>
       `;

      highlightSection.appendChild(card);
    });

    /**
     * 24H FORECAST SECTION
     */
    fetchData(url.forecast(lat, lon), function (forecast) {
      const {
        list: forecastList,
        city: { timezone },
      } = forecast;
      hourlySection.innerHTML = `
        <h2 class="title-2">Today at</h2>

        <div class="slider-container">
          <ul class="slider-list" data-temp></ul>

          <ul class="slider-list" data-wind></ul>
        </div>
      `;
      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;
        const {
          dt: dataTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;
        const [{ icon, description }] = weather;
        const temp_i = document.createElement("li");
        temp_i.classList.add("slider-item");

        temp_i.innerHTML = `
          <div class="card card-sm silder-card">
            <p class="body-3">${getHours(dataTimeUnix, timezone)}</p>
            <img
              src="./images/weather_icons/${icon}.png"
              width="48"
              height="48"
              loading="lazy"
              alt="${description}"
              class="weather-icon"
              title="${description}"
            />
            <p class="body-3">${parseInt(temp)}&deg;</p>
        </div>
        `;
        hourlySection.querySelector("[data-temp]").appendChild(temp_i);

        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");

        windLi.innerHTML = `
          <div class="card card-sm silder-card">
                <p class="body-3">${getHours(dataTimeUnix, timezone)}</p>

                <img
                  src="./images/weather_icons/direction.png"
                  width="48"
                  height="48"
                  loading="lazy"
                  alt="direction"
                  class="weather-icon"
                  style = "transform: rotate(${windDirection - 180}deg)"
                />
                <p class="body-3">${parseInt(mps_to_kmh(windSpeed))} Km/h</p>
              </div>
        `;
        hourlySection.querySelector("[data-wind]").appendChild(windLi);
      }

      /**
       * 5 day Forcast Section
       */
      forecastSection.innerHTML = `
         <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
        <div class="card card-lg forecast-card">
          <ul data-forcast-list></ul>
        </div>
      `;

      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt,
        } = forecastList[i];
        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);

        const li = document.createElement("li");
        li.classList.add("card-item");
        li.innerHTML = `
            <div class="icon-wapper">
                <img
                  src="./images/weather_icons/${icon}.png"
                  width="54"
                  height="54"
                  alt="${description}"
                  class="weather-icon"
                  title = "${description}"
                />
                <span class="span">
                  <p class="title-2">${parseInt(temp_max)}&deg;</p>
                </span>
              </div>
              <p class="label-1">${date.getDate()} ${
          monthName[date.getUTCMonth()]
        }     </p>
              <p class="label-2">${weekDayName[date.getUTCDay()]}</p>
        `;
        forecastSection.querySelector("[data-forcast-list]").appendChild(li);
      }

      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade-in");
    });
  });
};

export const error404 = () => (errorContent.style.display = "flex");
