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
