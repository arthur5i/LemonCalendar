import { Month, WeekDay, DateFormat, PreferencesType } from "./types";
import { createNumberSequence } from "./utils";

export const TEST_EVENT_GROUPS = true;

export const PRESET_PREFERENCES: Map<String, PreferencesType> = new Map([
  ["NA", {
    tfHourTime: false,
    dateFormat: DateFormat.MDY,
    weekStartsOnMonday: false
  }],
  ["EU", {
    tfHourTime: true,
    dateFormat: DateFormat.DMY,
    weekStartsOnMonday: true
  }]
]);

export const MONTHS: Month[] = [
  { id: 0, name: "January", shortName: "Jan" },
  { id: 1, name: "February", shortName: "Feb" },
  { id: 2, name: "March", shortName: "Mar" },
  { id: 3, name: "April", shortName: "Apr" },
  { id: 4, name: "May", shortName: "May" },
  { id: 5, name: "June", shortName: "Jun" },
  { id: 6, name: "July", shortName: "Jul" },
  { id: 7, name: "August", shortName: "Aug" },
  { id: 8, name: "September", shortName: "Sep" },
  { id: 9, name: "October", shortName: "Oct" },
  { id: 10, name: "November", shortName: "Nov" },
  { id: 11, name: "December", shortName: "Dec" },
];

export const DAYS_OF_WEEK: WeekDay[] = [
  { id: 0, name: "Sunday", shortName: "Sun", shorterName: "Su" },
  { id: 1, name: "Monday", shortName: "Mon", shorterName: "M"  },
  { id: 2, name: "Tuesday", shortName: "Tue", shorterName: "Tu"  },
  { id: 3, name: "Wednesday", shortName: "Wed", shorterName: "W"  },
  { id: 4, name: "Thursday", shortName: "Thu", shorterName: "Th"  },
  { id: 5, name: "Friday", shortName: "Fri", shorterName: "F"  },
  { id: 6, name: "Saturday", shortName: "Sat", shorterName: "Sa"  },
];

export const HOURS_IN_DAY = 24;
export const HOURS_SEQUENCE = createNumberSequence(HOURS_IN_DAY);

export const DEFAULT_EVENT_TITLE = "";
export const DEFAULT_COLOR = "#558afc";
export const DEFAULT_EVENT_DURATION = 15;