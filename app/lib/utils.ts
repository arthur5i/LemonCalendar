import { WeekDay } from "./types";
import { MONTHS, DAYS_OF_WEEK } from "./const";

export function getMonth(id: number) {
  return MONTHS[id];
}