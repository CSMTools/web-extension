import { DayPeriod } from './interface';

export function getDisplayDateTime() {
  const day = getDay();
  const month = getMonth();
  const d = new Date();
  const date = d.getDate();
  let hours = d.getHours().toString();
  let min = d.getMinutes().toString();

  if (hours.length < 2) {
    hours = `0${hours}`;
  }

  if (min.length < 2) {
    min = `0${min}`;
  }

  return {
    date: `${day} ${month} ${date}`,
    time: `${hours}:${min}`,
    period: getPeriod(d),
  };
}

export function getMonth() {
  const date = new Date();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[date.getMonth()].substring(0, 3);
}

export function getDay() {
  const date = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()].substring(0, 3);
}

export function getPeriod(date: Date): DayPeriod {
  const hours = date.getHours();

  // 5:00 AM — 11:59 AM => morning
  if (hours >= 5 && hours < 12) {
    return 'morning';
  }

  // 12:00 PM — 4:59 PM => afternoon
  if (hours >= 12 && hours < 17) {
    return 'afternoon';
  }

  // 5:00 PM — 4:59 AM => night
  return 'night';
}

export function getPalette(period: DayPeriod) {
  return {
    morning: '#282e54',
    afternoon: '#000000',
    night: '#ffdd91',
  }[period];
}

// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex (dec) {
  return dec.toString(16).padStart(2, '0');
}

// generateId :: Integer -> String
export function generateId(len?: number) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}
