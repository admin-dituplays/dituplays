export function updateTimer() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(2, 0, 0, 0); // Set 02:00

  // If it's already more than 02:00, then skip to next day
  if (now.getHours() >= 2) {
    target.setDate(target.getDate() + 1);
  }

  const timeUntilUpdate = target - now;

  const seconds = Math.floor((timeUntilUpdate / 1000) % 60);
  const minutes = Math.floor((timeUntilUpdate / 1000 / 60) % 60);
  const hours = Math.floor((timeUntilUpdate / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeUntilUpdate / (1000 * 60 * 60 * 24));

  const elementsMap = {
    days: document.querySelectorAll('.timerDays'),
    hours: document.querySelectorAll('.timerHours'),
    minutes: document.querySelectorAll('.timerMinutes'),
    seconds: document.querySelectorAll('.timerSeconds')
  };

  Object.keys(elementsMap).forEach(key => {
    elementsMap[key].forEach(element => {
      element.innerText = formatTime(key === 'days' ? days : key === 'hours' ? hours : key === 'minutes' ? minutes : seconds);
    });
  });

  setTimeout(updateTimer, 1000);
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}