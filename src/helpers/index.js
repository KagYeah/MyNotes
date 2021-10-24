import { format } from 'date-fns';

export const DATE_SEPARATOR = '/';
export const TIME_SEPARATOR = ':';
const DAY_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export function capitalize(string) {
  if (typeof string !== 'string' || !string) {
    return string;
  }

  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function date2string(date) {
  if (!empty(date)) {
    return '';
  }

  return format(date, `yyyy${DATE_SEPARATOR}MM${DATE_SEPARATOR}dd`);
}

export function datetime2string(datetime) {
  if (datetime instanceof Date) {
    return `yyyy${DATE_SEPARATOR}MM${DATE_SEPARATOR}dd HH${TIME_SEPARATOR}mm`;
  }

  if (typeof datetime === 'string') {
    const datetimeArr = datetime.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/i);

    return `${datetimeArr[1]}${DATE_SEPARATOR}${datetimeArr[2]}${DATE_SEPARATOR}${datetimeArr[3]} ${datetimeArr[4]}${TIME_SEPARATOR}${datetimeArr[5]}`;
  }

  return '';
}

export function time2string(date) {
  if (!date) {
    return '';
  }

  return format(date, `HH${TIME_SEPARATOR}mm`);
}

export function empty(value) {
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if ([null, undefined, '', {}].includes(value)) {
    return true;
  }

  return false;
}

export function getHexFromColor(color) {
  switch (color) {
    case 'pink':
      return '#f09';
    case 'red':
      return '#f00';
    case 'orange':
      return '#f90';
    case 'yellow':
      return '#fff500';
    case 'green':
      return '#0f0';
    case 'lightBlue':
      return '#0ff';
    case 'blue':
      return '#00f';
    case 'purple':
      return '#a0f';
    case 'navy':
      return '#003';
    default:
  }

  return '#000';
}

export function hex2rgba(hex, alpha = 1) {
  let rgb = null;

  let re = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (re) {
    rgb = re.slice(1, 4).map((x) => parseInt(x, 16));
  }

  re = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (re) {
    rgb = re.slice(1, 4).map((x) => 0x11 * parseInt(x, 16));
  }

  if (!rgb) {
    return null;
  }

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

export function normalizeObj(obj, defaults = {}) {
  const normalizedObj = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      normalizedObj[key] = obj[key];
    } else if (defaults[key] !== undefined && defaults[key] !== null) {
      normalizedObj[key] = defaults[key];
    }
  });

  return normalizedObj;
}

export async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}
