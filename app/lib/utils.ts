import { MONTHS, DAYS_OF_WEEK } from "./const";
import { DateRange } from 'react-day-picker';
import { addDays, startOfWeek } from "date-fns";

export function createNumberSequence(len: number) {
  const arrayOut = new Array(len);
  for (let i = 0; i < len; i++) {
    arrayOut[i] = i;
  }
  return arrayOut;
}

export function getMonth(id: number) {
  return MONTHS[id];
}

export function getWeekRangeOfDate(dateIn: Date): DateRange {
  const firstDayOfWeek = startOfWeek(dateIn);
  return {
    from: firstDayOfWeek,
    to: addDays(firstDayOfWeek, 6)
  }
}

/**
 * Takes an hour number as input and outputs a string with a digital time for that hour
 * @param hour The hour of the day, between 0-23
 * @param iso If true, return in 24 hour time, otherwise use 12 hour time
 */
export function getSimpleTime(hour: number, iso: boolean) {
  if (iso) {
    return `${hour}:00`;
  } else {
    return `${hour % 12 || 12}:00 ${(hour >= 12) ? "PM" : "AM"}`;
  }
}

export function calcSpacing(numberIn: number) {
  return `calc(var(--spacing) * ${numberIn})`;
}