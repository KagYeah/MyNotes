import { format } from 'date-fns';

export const DATE_SEPARATOR = '/';
export const TIME_SEPARATOR = ':';
const DAY_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export function date2string(date) {
  if (!date) {
    return '';
  }

  return format(date, `yyyy${DATE_SEPARATOR}MM${DATE_SEPARATOR}dd (${DAY_OF_WEEK[date.getDay()]})`);
}

export function time2string(date) {
  if (!date) {
    return '';
  }

  return format(date, `HH${TIME_SEPARATOR}mm`);
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
