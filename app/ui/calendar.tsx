//"use client";

import { useContext } from "react";
import EventBlock from "./eventblock";
import { DAYS_OF_WEEK, HOURS_IN_DAY } from "../lib/const";
import CurrentTime from "../lib/time";
import { CalEvent } from "../lib/events";
import { getSimpleTime, calcSpacing } from "../lib/utils";
import { format, addDays, isSameDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { Properties } from "csstype";
import { Preferences } from "../lib/context";

// Consider allowing user to alter this and other style values
//const spacing = Number.parseInt(getCSSVariable("--spacing"));
const rowHeightValue = 16;
const rowHeight = calcSpacing(rowHeightValue);

/**
 * The main interactive calendar of the application.
 */
export default function CalendarPanel({ selectedWeek, events, setEvents }: {
  selectedWeek: DateRange, events: CalEvent[], setEvents: Function
}) {
  /*
  NOTE FOR FUTURE REFERENCE
  The calendar should update with the passage of time, however this will
  require React effects, so the implementations will be more static for now.
  Please consider implementing real time sooner rather than later.
  */

  let dateOfWeek = selectedWeek.from!;

  const dateColumns = DAYS_OF_WEEK.map((weekDay) => {
    const dateColumn = <DateColumn
    date={dateOfWeek}
    events={events}
    setEvents={setEvents}
    key={weekDay.id} />;
    dateOfWeek = addDays(dateOfWeek, 1);
    return dateColumn;
  });

  return (
    <div className="flex flex-auto items-start overflow-y-scroll">
      <TimeColumn />
      {dateColumns}
    </div>
  );
}


function CalBlock({headerType, onClick, children}:
  {headerType?: boolean, onClick?: React.MouseEventHandler<HTMLDivElement>, children?: React.ReactNode}) {

  const cssStyle = {
    height: rowHeight
  }

  let headerStyle = "";
  if (headerType !== undefined) {
    headerStyle = `
    ${(headerType ? "bg-blue-300" : "bg-white")}
    flex flex-col items-center`;
  }
  
  const twStyle = `w-full border-r border-t border-gray-200 ${headerStyle}`

  return <div className={twStyle} style={cssStyle} onClick={onClick}>{children}</div>
}


/**
 * Displays each hour of the day on the left of the UI
 */
function TimeColumn() {
  const hourBlocks = Array(HOURS_IN_DAY).fill(0).map((value, index) => {
    return <TimeBlock hour={index} key={index}/>
  });
  
  return <div>
    <CalBlock></CalBlock>
    {hourBlocks}
  </div>
}


function DateColumn({date, events, setEvents}:
  {date: Date, events: CalEvent[], setEvents: Function}) {
  const isCurrentDay = isSameDay(date, CurrentTime.date);
  const columnDate = date.getDate();
  const weekDay = DAYS_OF_WEEK[date.getDay()];
  
  const columnStyle = "bg-white w-full relative";
  const innerColumnStyle: Properties = {
    position: "absolute",
    width: "100%",
    top: `calc(var(--spacing) * ${rowHeightValue} + ${rowHeightValue})`,
  };
  
  const hourBlocks = Array(HOURS_IN_DAY).fill(0).map((value, index) => {
    return <HourBlock
    hour={index}
    date={date}
    setEvents={setEvents}
    key={index}
    />
  });

  const thisDayEvents = events.filter(event => {
    return (isSameDay(date, event.fromDate));
  });

  const eventBlocks = thisDayEvents.map((event, index) => {
    return <EventBlock
      thisEvent={event}
      events={events}
      setEvents={setEvents}
      rowHeightValue={rowHeightValue}
      key={event.id}/>;
  });

  return (
    <div className={columnStyle}>
      <CalBlock headerType={isCurrentDay}>
        <div>
          {weekDay.shortName}
        </div>
        <div>
          {columnDate}
        </div>
      </CalBlock>
      <div style={innerColumnStyle}>
        {hourBlocks}
      </div>
      <div style={innerColumnStyle}>
        {eventBlocks}
      </div>
    </div>
  );
}


function TimeBlock({hour}: {hour: number}) {
  //const pref = useContext(Preferences);

  return <CalBlock>
    {getSimpleTime(hour, false)}
  </CalBlock>
}


/**
 * Renders one cell of the calendar. Clicking on this will add a new event via setEvents, and consequently spawn an event on the calendar.
 * @param param0 
 * @returns 
 */
function HourBlock({hour, date, setEvents}:
  {hour: number, date: Date, setEvents: Function}) {

  function createEvent(event: React.MouseEvent<HTMLElement>) {
    // Calculate where the mouse was clicked and use that to generate a date
    const fromDate = new Date(date);
    fromDate.setHours(hour);

    //console.log(`X: ${event.nativeEvent.offsetX}, Y: ${event.nativeEvent.offsetY}`);

    setEvents((draft: CalEvent[]) => {
      draft.push(new CalEvent(fromDate));
    });
  }

  return <CalBlock onClick={createEvent}></CalBlock>
}