import { WeekDay, CalendarGroup } from "../lib/types";
import { DAYS_OF_WEEK, HOURS_IN_DAY } from "../lib/const";
import { CurrentTime } from "../lib/time";

// Consider allowing user to alter this and other style values
const rowHeight = "h-16";
const borderStyle = `border-r border-t border-gray-200`;

const currentWeekDay = CurrentTime.getDay();
const currentMonthDay = CurrentTime.getDate();

/**
 * The main interactive calendar of the application.
 * @prop calendarGroups {CalendarGroup[]}
 */
export default function CalendarPanel({ calendarGroups }: {
  calendarGroups: CalendarGroup[]
}) {
  /*
  NOTE FOR FUTURE REFERENCE
  The calendar should update with the passage of time, however this will
  require React effects, so the implementations will be more static for now.
  Please consider implementing real time sooner rather than later.
  */

  const dateOfWeek = CurrentTime.getDateForFirstDayOfWeek();
  
  const dateColumns = DAYS_OF_WEEK.map((weekDay) => {
    const monthDate = dateOfWeek.getDate();
    dateOfWeek.setDate(monthDate + 1);
    return <DateColumn monthDate={monthDate} weekDayId={weekDay.id} key={weekDay.id} />;
  });

  return (
    <div className="flex flex-auto items-start overflow-y-scroll">
      <TimeColumn />
      {dateColumns}
    </div>
  );
}

/**
 * Creates the elements that contain the display for the hours of the day
 * @param {boolean} timeColumn
 */
function createHourBlocksColumn(timeColumn: boolean) {
  function toTime(num: number) {
    return `${(num > 9) ? "" : "0"}${num}:00`;
  }

  const rowStyle = `
    ${borderStyle}
    w-full ${rowHeight}`;

  const hourBlocks = new Array(HOURS_IN_DAY);
  for (let i = 0; i < hourBlocks.length; i++) {
    hourBlocks[i] = <div className={rowStyle} key={i}>
      {timeColumn ? toTime(i) : ""}
    </div>
  }

  return hourBlocks
}


/**
 * Displays each hour of the day on the left of the UI
 */
function TimeColumn() {
  const hourBlocks = createHourBlocksColumn(true);
  
  return <div>
    <div className={rowHeight}></div>
    {hourBlocks}
  </div>
}

/**
 * 
 * @returns 
 */
function DateColumn({monthDate, weekDayId}: {monthDate: number, weekDayId: number}) {
  const isCurrentDay = (currentWeekDay === weekDayId);
  const columnDate = monthDate;
  const weekDay = DAYS_OF_WEEK[weekDayId];
  
  const headerStyle = `
    ${(isCurrentDay ? "bg-blue-300" : "bg-white")}
    ${borderStyle}
    ${rowHeight}
    flex flex-col items-center`;
  const columnStyle = `bg-white w-full`;

  const hourBlocks = createHourBlocksColumn(false);

  return (
    <div className={columnStyle}>
      <div className={headerStyle}>
        <div>
          {weekDay.shortName}
        </div>
        <div>
          {columnDate}
        </div>
      </div>
      {hourBlocks}
    </div>
  )

}