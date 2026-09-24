import { DEFAULT_COLOR, DEFAULT_EVENT_DURATION } from "./const";
import { v4 as uuidv4 } from "uuid";
import { addMinutes, isSameMinute, differenceInMinutes } from "date-fns";


export type CalEventGroup = {
  id: string;
  name: string;
  events: [];
  visible: boolean;
  locked: boolean;
}


export class CalEvent {
  readonly id: string;
  fromDate: Date;
  toDate: Date;
  title: string = "";
  description: string = "";
  //location: Location;
  color: string = DEFAULT_COLOR;
  //reminderSettings: ReminderSettings;

  constructor(fromOrJSON: Date | string, to?: Date) {
    // For when the first parameter is a Date object
    if (typeof fromOrJSON === "object") {
      const from = fromOrJSON;
      this.id = uuidv4();
      this.fromDate = from;
      if (to === undefined) {
        this.toDate = addMinutes(from, DEFAULT_EVENT_DURATION);
      } else {
        this.toDate = to;
      }
    // For when the first parameter is a JSON string
    } else {
      const jsonOut = JSON.parse(fromOrJSON);
      this.id = jsonOut.id;
      this.fromDate = new Date(jsonOut.fromDate);
      this.toDate = new Date(jsonOut.toDate);
      this.title = jsonOut.title;
      this.description = jsonOut.description;
      this.color = jsonOut.color;
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