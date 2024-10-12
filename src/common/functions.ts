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

  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}
