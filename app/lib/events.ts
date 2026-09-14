import { DEFAULT_EVENT_TITLE, DEFAULT_COLOR, DEFAULT_EVENT_DURATION } from "./const";
import { v4 as uuidv4 } from "uuid";
import { addMinutes, isSameMinute, differenceInMinutes } from "date-fns";


export type EventGroup = {
  id: string;
  name: string;
  events: [];
  visible: boolean;
  locked: boolean;
}


export class CalEvent {
  id: string;
  fromDate: Date;
  toDate: Date;
  title: string = "";
  description: string = "";
  //location: Location;
  color: string = DEFAULT_COLOR;
  //reminderSettings: ReminderSettings;

  constructor(from: Date, to?: Date) {
    this.id = uuidv4();
    this.fromDate = from;
    if (to === undefined) {
      this.toDate = addMinutes(from, DEFAULT_EVENT_DURATION);
    } else {
      this.toDate = to;
    }
  }

  isMoment(): boolean {
    return isSameMinute(this.toDate, this.fromDate);
  }

  /**
   * Gets the duration of the event in minutes
   * @returns Minutes in event
   */
  getDuration(): number {
    return differenceInMinutes(this.toDate, this.fromDate);
  }
}