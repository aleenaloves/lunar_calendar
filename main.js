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

const currentDate = GetCurrentDate();
const currentDateMonth = GetCurrentDate().toLocaleString("en-us", { month: "long" });
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const footerYear = document.getElementById("footer-year");
footerYear.innerText = currentDate.getFullYear();

const navEmoji = document.getElementById("current-phase-emoji");
navEmoji.innerText = Moon.lunarPhaseEmoji(currentDate)

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

    let activeDayClass = ""
    if(day.currentDate.getTime() === currentDate.getTime()){
        console.log("hit")
        activeDayClass = "active-day"
    }

    days += `<div class="calendar-square-container-square ${activeDayClass}">
        <div class="calendar-square-container-text">
        <p class="calendar-square-container-date">${day.currentDate.toLocaleDateString(
          "en-us",
          { weekday: "short", month: "short", day: "numeric" }
        )}</p>
            ${phases}
        </div>
    </div>`;
  });

  const monthContainerId = `${month}-container`;
  monthContainerIds.push(monthContainerId);
  const calendarMonth = `<div id="${monthContainerId}"><p class="month-title title is-1">${month} ${currentDate.getFullYear()}</p>
  <div class="calendar-square-container">${days}</div></div>`
  calendar.innerHTML += calendarMonth;
}

monthContainerIds.forEach(monthContainerId => {
    const monthContainer = document.getElementById(monthContainerId);
    if(!monthContainerId.includes(currentDateMonth)){
        monthContainer.style.display = "none";
    }
})
