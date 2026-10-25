const dateTime = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});
const time = new Intl.DateTimeFormat("en-GB", {
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});
const date = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "Asia/Dhaka",
});

export const formatDateTime = (v: string | Date) => dateTime.format(new Date(v));
export const formatTime = (v: string | Date) => time.format(new Date(v));
export const formatDate = (v: string | Date) => date.format(new Date(v));
export const formatPercent = (n: number) => `${Math.round(n * 100)}%`;
export const titleCase = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());