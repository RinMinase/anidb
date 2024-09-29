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
