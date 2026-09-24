import { MONTHS, DAYS_OF_WEEK } from "./const";
import { Month } from "./types";
import { DateRange } from 'react-day-picker';
import { format, addDays, startOfWeek } from "date-fns";

export function createNumberSequence(len: number, startFrom: number): number[] {
  const arrayOut = new Array(len);
  for (let i = startFrom; i < len + startFrom; i++) {
    arrayOut[i] = i;
  }
  return arrayOut;
}

export function getMonth(id: number): Month {
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
export function getSimpleTime(hour: number, iso: boolean): string {
  if (iso) {
    return `${hour}:00`;
  } else {
    return `${hour % 12 || 12}:00 ${(hour >= 12) ? "PM" : "AM"}`;
  }
}

export function formatAsTime(dateIn: Date, tfHourTime: boolean): string {
  const timeFormat = tfHourTime ? "HH:mm" : "p";
  return format(dateIn, timeFormat);
}

export function calcSpacing(numberIn: number): string {
  return `calc(var(--spacing) * ${numberIn})`;
}

export function roundToInt(numberIn: number, roundTo: number): number {
  const basis: number = numberIn % roundTo;
  const halfway: number = roundTo / 2;

  if (basis < halfway) {
    return numberIn - basis;
  } else {
    return numberIn + (roundTo - basis);
  }
}

export function floorToInt(numberIn: number, roundTo: number): number {
  return numberIn - (numberIn % roundTo);
}