import { Moon } from "./modules/lunarphase/index.es.js";

function GetCurrentDate() {
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function GetNextDate(currentDate) {
  let date = new Date(currentDate);
  date.setDate(currentDate.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  date.setMilliseconds(date.getMilliseconds() - 1);
  return date;
}

let scrollButton = document.getElementById("go-to-top-button");
scrollButton.onclick = topFunction;

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    scrollButton.style.display = "inline-flex";
  } else {
    scrollButton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

const currentDate = GetCurrentDate();
const currentDateMonth = GetCurrentDate().toLocaleString("en-us", {
  month: "long",
});
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const currentYearElement = document.getElementById("current-year");
currentYearElement.innerText = currentDate.getFullYear();

const currentYear = [];

for (
  var d = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0, 0);
  d <= new Date(currentDate.getFullYear(), 11, 31, 0, 0, 0, 0);
  d.setDate(d.getDate() + 1)
) {
  const date = new Date(d);
  const nextDate = GetNextDate(date);
  currentYear.push({
    currentDate: date,
    tomorrowDate: nextDate,
    currentPhase: Moon.lunarPhase(date),
    tomorrowPhase: Moon.lunarPhase(nextDate),
    currentEmoji: Moon.lunarPhaseEmoji(date),
    tomorrowEmoji: Moon.lunarPhaseEmoji(nextDate),
  });
}

const currentYearGroupedByMonth = {};
currentYear.forEach((day) => {
  const month = day.currentDate.toLocaleString("en-us", { month: "long" });
  if (currentYearGroupedByMonth[month] != undefined) {
    currentYearGroupedByMonth[month].push(day);
  } else {
    currentYearGroupedByMonth[month] = [];
    currentYearGroupedByMonth[month].push(day);
  }
});

const calendar = document.getElementById("calendar");
const monthContainerIds = [];

for (var month in currentYearGroupedByMonth) {
  let days = "";

  currentYearGroupedByMonth[month].forEach((day) => {
    let phases = `<p>${day.currentEmoji} ${day.currentPhase}</p>`;
    if (day.currentEmoji != day.tomorrowEmoji) {
      phases += `<p>${day.tomorrowEmoji} ${day.tomorrowPhase}</p>`;
    }

    let activeDayClass = "";
    let pastDayClass = "";
    if (day.currentDate.getTime() === currentDate.getTime()) {
      activeDayClass = "active-day";
    }

    if(day.currentDate.getTime() < currentDate.getTime()) {
        pastDayClass = "past-day";
    }

    const dayValue = `<div class="calendar-square-container-square ${activeDayClass} ${pastDayClass}">
    <div class="calendar-square-container-text">
    <p class="calendar-square-container-date">${day.currentDate.toLocaleDateString(
      "en-us",
      { weekday: "short", month: "short", day: "numeric" }
    )}</p>
        ${phases}
    </div>
</div>`;

    days += dayValue;
  });

  const monthContainerId = `${month}-container`;
  monthContainerIds.push(monthContainerId);
  const calendarMonth = `<div id="${monthContainerId}" class="month-container"><h3 class="month-title title is-3 is-lowercase">${month}</h3>
  <div class="calendar-square-container">${days}</div></div>`;
  calendar.innerHTML += calendarMonth;
}

// monthContainerIds.forEach(monthContainerId => {
//     const monthContainer = document.getElementById(monthContainerId);
//     if(!monthContainerId.includes(currentDateMonth)){
//         monthContainer.style.display = "none";
//     }
// })
