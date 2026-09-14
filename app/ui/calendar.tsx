//"use client";

import { useContext } from "react";
import EventBlock from "./eventblock";
import { ROW_HEIGHT, SPACING, MINUTE_INTERVAL, MINUTES_IN_HOUR, DAYS_OF_WEEK, HOURS_IN_DAY, HOURS_SEQUENCE } from "../lib/const";
import CurrentTime from "../lib/time";
import { CalEvent } from "../lib/events";
import { getSimpleTime, roundToNearestInt } from "../lib/utils";
import { format, addDays, isSameDay, setHours } from "date-fns";
import { DateRange } from "react-day-picker";
import { Properties } from "csstype";
import { Preferences } from "../lib/context";

/**
 * The main interactive calendar of the application.
 */
export default function CalendarPanel({ selectedWeek, events, setEvents }: {
  selectedWeek: DateRange, events: Map<string, CalEvent>, setEvents: Function
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
    height: ROW_HEIGHT * SPACING
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
  const hourBlocks = HOURS_SEQUENCE.map((hour, index) => {
    return <TimeBlock hour={hour} key={index}/>
  });
  
  return <div>
    <CalBlock></CalBlock>
    {hourBlocks}
  </div>
}


function DateColumn({date, events, setEvents}:
  {date: Date, events: Map<string, CalEvent>, setEvents: Function}) {
  const isCurrentDay = isSameDay(date, CurrentTime.date);
  const columnDate = date.getDate();
  const weekDay = DAYS_OF_WEEK[date.getDay()];
  
  const columnStyle = "bg-white w-full relative";
  const innerColumnStyle: Properties = {
    position: "absolute",
    width: "100%",
    top: `calc(var(--spacing) * ${ROW_HEIGHT} + ${ROW_HEIGHT})`,
  };
  
  const hourBlocks = HOURS_SEQUENCE.map((hour, index) => {
    const dateOfHour = setHours(date, hour);
    return <HourBlock
    date={dateOfHour}
    setEvents={setEvents}
    key={index}
    />
  });

  // Get all events for the day that this column represents
  const thisDayEvents = events.values().toArray().filter(event => {
    return (isSameDay(date, event.fromDate));
  });

  const eventBlocks = thisDayEvents.map((event, index) => {
    return <EventBlock
      thisEvent={event}
      events={events}
      setEvents={setEvents}
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
function HourBlock({date, setEvents}: {date: Date, setEvents: Function}) {
  return <CalBlock onClick={e => {createEvent(e, date, setEvents)}}></CalBlock>
}


function createEvent(event: React.MouseEvent<HTMLElement>, date: Date, setEvents: Function) {
  const fromDate = new Date(date);

  const y = event.nativeEvent.offsetY;
  const height = ROW_HEIGHT * SPACING;
  const minuteRatio = y / height;
  let eventMinute = minuteRatio * MINUTES_IN_HOUR;
  eventMinute = roundToNearestInt(eventMinute, MINUTE_INTERVAL);
  fromDate.setMinutes(eventMinute);

  setEvents((draft: Map<string, CalEvent>) => {
    const newEvent = new CalEvent(fromDate);
    draft.set(newEvent.id, newEvent);
  });
}