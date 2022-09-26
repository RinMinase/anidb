export function emptyStringToNull(value: any, originalValue: any) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null;
  }

  return value;
}
