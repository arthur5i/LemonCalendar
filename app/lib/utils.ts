import { WeekDay } from "./types";
import { MONTHS, DAYS_OF_WEEK } from "./const";

export function getMonth(id: number) {
  return MONTHS[id];
}

export function getWeekday(id: number) {

}

export function getFirstDayOfWeek(dateIn: Date): Date {
  const dateOut = new Date(dateIn);
  const day = dateOut.getDay();
  dateOut.setDate(dateOut.getDate() - day);
  return dateOut;
}

export function getDateForWeekday(dateIn: Date, weekDay: WeekDay) {
  const day = dateIn.getDay();
  const date = dateIn.getDate();
  const dateOut = new Date(dateIn);
  //dateOut.setDate()
}