export function withoutNulls(arr) {
  return arr.filter((item) => item != null); // use != not !== to filter out both null and undefined
}
