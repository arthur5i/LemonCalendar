import { WeekDay } from "../lib/types";
import { DAYS_OF_WEEK, HOURS_IN_DAY } from "../lib/const"; 

// Consider allowing user to alter this and other style values
const rowHeight = "h-16";
const borderStyle = `border-r border-b border-gray-200`;

const date = new Date();
const currentWeekDay = date.getDay();
const currentMonthDay = date.getDate();

export default function CalendarPanel() {
  /*
  NOTE FOR FUTURE REFERENCE
  The calendar should update with the passage of time, however this will
  require React effects, so the implementations will be more static for now.
  Please consider implementing real time sooner rather than later.
  */

  const dateColumns = DAYS_OF_WEEK.map((weekDay) => {
    return <DateColumn weekDay={weekDay} key={weekDay.id} />;
  });

  return (
    <div className="flex items-start content-stretch">
      {dateColumns}
    </div>
  );
}

function createHourBlocksColumn() {
  const rowStyle = `
    ${borderStyle}
    w-full ${rowHeight}`;

  const hourBlocks = new Array(HOURS_IN_DAY);
  for (let i = 0; i < hourBlocks.length; i++) {
    hourBlocks[i] = <div className={rowStyle} key={i}></div>
  }
  return hourBlocks
}

function TimeColumn() {
  const hourBlocks = createHourBlocksColumn();
}

function DateColumn({ weekDay }: {weekDay: WeekDay}) {
  const isCurrentDay = (currentWeekDay === weekDay.id);
  const columnDate = currentMonthDay + (weekDay.id - currentWeekDay);
  
  const headerStyle = `
    ${(isCurrentDay ? "bg-blue-300" : "bg-white")}
    ${borderStyle}
    flex flex-col items-center`;
  const columnStyle = `bg-white w-full`;

  const hourBlocks = createHourBlocksColumn();

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