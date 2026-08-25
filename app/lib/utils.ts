import { WeekDay } from "./types";
import { MONTHS, DAYS_OF_WEEK } from "./const";
import { DateRange } from 'react-day-picker';
import { addDays, startOfWeek } from "date-fns";

export function getMonth(id: number) {
  return MONTHS[id];
}

/*export function getDateForFirstDayOfWeek(dateIn: Date): Date {
  const dateOut = new Date(dateIn);
  const day = dateOut.getDay();
  dateOut.setDate(dateOut.getDate() - day);
  return dateOut;
}*/

/*export function offsetDate(date: Date, offset: number) {
  const dateValue = date.getDate();
  date.setDate(dateValue + offset);
}

export function getOffsetDate(date: Date, offset: number): Date {
  const dateValue = date.getDate();
  const dateOut = new Date(date);
  dateOut.setDate(dateValue + offset);
  return dateOut;
}*/

export function getWeekRangeOfDate(dateIn: Date): DateRange {
  const firstDayOfWeek = startOfWeek(dateIn);
  return {
    from: firstDayOfWeek,
    to: addDays(firstDayOfWeek, 6)
  }
}
