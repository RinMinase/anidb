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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredObj = Object.entries(obj).filter(([_, val]) => val != null);

  return Object.fromEntries(filteredObj) as T;
}

function roundToTwo(num: any) {
  // eslint-disable-next-line prefer-template
  return +(Math.round((num + "e+2") as any) + "e-2");
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
