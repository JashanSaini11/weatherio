"use strict";
export const weekDayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Webnesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const monthName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 *
 * @param {number} dataUnix Unix data in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String. formate: "Sunday 10,Jan"
 */
// Import weekDayName and monthName from the same module
// Import weekDayName and monthName from the same module

export const getDate = function (dataUnix, timezone) {
  const date = new Date((dataUnix + timezone) * 1000);
  const dayName = weekDayName[date.getUTCDay()];
  const month = monthName[date.getUTCMonth()];

  return `${dayName} ${date.getUTCDate()}, ${month}`;
};

/**
 *
 * @param {number} timeUnix  Unix date in seconds
 * @param {number} timezone Timezone Shift from UTC in second
 * @returns {string} Time string. formate: "HH:MM AM/PM"
 */
export const getTime = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours > 12 ? "PM" : "AM";

  return `${hours % 12 || 12}:${minutes} ${period}`;
};

/**
 *
 * @param {number} timeUnix  Unix date in seconds
 * @param {number} timezone Timezone Shift from UTC in second
 * @returns {string} Time string. formate: "HH:MM AM/PM"
 */
export const getHours = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const period = hours > 12 ? "PM" : "AM";

  return `${hours % 12 || 12}:${period}`;
};

/**
 *
 * @param {number} mps
 * @returns  {number} kilometer per hours
 */
export const mps_to_kmh = (mps) => {
  const mph = mps * 3600;
  return mph / 1000;
};

export const apiText = {
  1: {
    level: "Good",
    message:
      "Air quality is considered satisfactory, and air pollution poses little or no risk",
  },
  2: {
    level: "Fair",
    message:
      "Air quality is acceptable; however, for some pollutions there may be a moderate health concern for a moderate health concern for a very ssmall number of people who are unusually sensitive to air pollution",
  },

  3: {
    level: "Moderate",
    message:
      "Members of sensitive groups may experience health effects. The general public is not likely to be affected",
  },
  4: {
    level: "Poor",
    message: "Everyone may begin to experience health effects; mem",
  },
  5: {
    level: "Very Poor",
    message:
      "Health warnings of emergency conditions. The entire population is more likely to be affected",
  },
};
function updateIconBasedOnScreenWidth() {
  const arrowIcon = document.getElementById("arrow-icon");
  if (window.matchMedia("(min-width: 1200px)").matches) {
    arrowIcon.className = "fa-sharp fa-solid fa-magnifying-glass";
  } else {
    arrowIcon.className = "fa-sharp fa-solid fa-arrow-left";
  }
}

window.addEventListener("resize", updateIconBasedOnScreenWidth);

updateIconBasedOnScreenWidth();
