import { debounce } from "es-toolkit";

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;
const TB = 1024 * GB;

export const FILESIZES = {
  KB,
  MB,
  GB,
  TB,
};

export function emptyStringToNull(value: any, originalValue: any) {
  if (typeof originalValue === "string" && originalValue === "") {
    return null;
  }

  return value;
}

export async function waitForElement(selector: string): Promise<any> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export function queryParamsArrayToString(
  data: Array<any>,
  name: string,
): string {
  return data.reduce((acc, val, index) => {
    return val ? `${acc}${index > 0 ? "&" : ""}${name}[${index}]=${val}` : "";
  }, "");
}

export function randomAlphaString(length: number = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export function removeBlankAttributes<T extends object>(obj: T): T {
  const filteredObj = Object.entries(obj).filter(([_, val]) => val != null);

  return Object.fromEntries(filteredObj) as T;
}

function roundToTwo(num: any) {
  return +`${Math.round(`${num}e+2` as any)}e-2`;
}

export function parseNumberFilesizeToString(rawFilesize: number): string {
  if (rawFilesize <= 0 || !rawFilesize || isNaN(rawFilesize)) {
    return "";
  }

  if (rawFilesize < KB) {
    return `${rawFilesize} B`;
  } else if (rawFilesize < MB) {
    return `${roundToTwo(rawFilesize / KB)} KB`;
  } else if (rawFilesize < GB) {
    return `${roundToTwo(rawFilesize / MB)} MB`;
  } else if (rawFilesize < TB) {
    return `${roundToTwo(rawFilesize / GB)} GB`;
  }

  return `${roundToTwo(rawFilesize / TB)} TB`;
}

export function cardinalToOrdinal(num: number): string {
  if (num <= 0) return "";

  const suffix =
    ["st", "nd", "rd"][((((num + 90) % 100) - 10) % 10) - 1] || "th";

  return `${num}${suffix}`;
}

export function getYearsInArray(start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step,
  );
}

export function roundHalfDown(num: any) {
  if (typeof num === "number") return -Math.round(-num);
  return 0;
}

export const contrast = (bgColor: string): string => {
  const hex = bgColor.replace("#", "");

  // Expand #fff hex to #ffffff
  const fullHex = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  // https://en.wikipedia.org/wiki/YIQ#From_RGB_to_YIQ
  const yiq = r * 0.299 + g * 0.587 + b * 0.114;
  return yiq >= 128 ? "#000000" : "#ffffff";
};

export const debouncePromise = <T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number,
) => {
  let resolveCurrent: ((value: any) => void) | null = null;
  let rejectCurrent: ((reason: any) => void) | null = null;

  const triggerFunc = debounce(async (args: Parameters<T>) => {
    const resolve = resolveCurrent;
    const reject = rejectCurrent;

    try {
      const result = await func(...args);
      resolve?.(result);
    } catch (error) {
      reject?.(error);
    }
  }, wait);

  return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    return new Promise((resolve, reject) => {
      resolveCurrent = resolve;
      rejectCurrent = reject;

      triggerFunc(args);
    });
  };
};
