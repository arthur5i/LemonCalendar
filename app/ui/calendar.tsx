//"use client";

import { useState, useContext, useEffect } from "react";
import EventBlock from "./eventblock";
import { ROW_HEIGHT, SPACING, MINUTE_INTERVAL, MINUTES_IN_HOUR, DAYS_OF_WEEK, HOURS_IN_DAY, HOURS_SEQUENCE } from "../lib/const";
import CurrentTime from "../lib/time";
import { CalEvent } from "../lib/calevents";
import { getSimpleTime, roundToInt, floorToInt } from "../lib/utils";
import { format, addDays, isSameDay, setHours, set } from "date-fns";
import { DateRange } from "react-day-picker";
import { Properties } from "csstype";
import { Preferences } from "../lib/context";
import { validate as uuidValidate } from "uuid";

type dispatchAction = {
  type: string
}

/**
 * The main interactive calendar of the application.
 */
export default function CalendarPanel({ selectedWeek, calEvents, dispatchCalEvents }: {
  selectedWeek: DateRange, calEvents: CalEvent[], dispatchCalEvents: Function
}) {
  "use client"

  /*
  NOTE FOR FUTURE REFERENCE
  The calendar should update with the passage of time, however this will
  require React effects, so the implementations will be more static for now.
  Please consider implementing real time sooner rather than later.
  */

  const [delayedCalEventsDispatch, setDelayedCalEventsDispatch] = useState<dispatchAction>({type: "none"});

  let dateOfWeek = selectedWeek.from!;

  const dateColumns = DAYS_OF_WEEK.map((weekDay) => {
    const dateColumn = <DateColumn
    dateIn={dateOfWeek}
    calEvents={calEvents}
    dispatchCalEvents={dispatchCalEvents}
    setDelayedCalEventsDispatch={setDelayedCalEventsDispatch}
    key={weekDay.id} />;

    dateOfWeek = addDays(dateOfWeek, 1);
    
    return dateColumn;
  });


  useEffect(() => {
    if (delayedCalEventsDispatch.type !== "none") {
      dispatchCalEvents(delayedCalEventsDispatch);
      setDelayedCalEventsDispatch({type: "none"});
    }
  }, [delayedCalEventsDispatch])



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

  return <div className={twStyle} style={cssStyle}>{children}</div>
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


function DateColumn({dateIn, calEvents, dispatchCalEvents, setDelayedCalEventsDispatch}:
  {dateIn: Date, calEvents: CalEvent[], dispatchCalEvents: Function, setDelayedCalEventsDispatch: Function}) {
  const isCurrentDay = isSameDay(dateIn, CurrentTime.date);
  const columnDate = dateIn.getDate();
  const weekDay = DAYS_OF_WEEK[dateIn.getDay()];

  const columnStyle = "bg-white w-full relative";
  const innerColumnStyle: Properties = {
    position: "absolute",
    width: "100%",
    top: `calc(var(--spacing) * ${ROW_HEIGHT} + ${ROW_HEIGHT})`,
  };
  

  const hourBlocks = HOURS_SEQUENCE.map((hour, index) => {
    const dateOfHour = setHours(dateIn, hour);
    return <HourBlock key={index}/>
  });

  // Get all calEvents for the day that this column represents
  const thisDayEvents = calEvents.filter(event => {
    return (isSameDay(dateIn, event.fromDate));
  });

  const eventBlocks = thisDayEvents.map((event, index) => {
    return <EventBlock
      thisEvent={event}
      calEvents={calEvents}
      dispatchCalEvents={dispatchCalEvents}
      key={event.id}/>;
  });



  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent) {
    //event.preventDefault();
    const id = event.dataTransfer.getData("text/parameters");

    if (uuidValidate(id)) {
      const y = event.nativeEvent.layerY;
      const minutes = getMinuteFromMouseY(y);

      const newDate = new Date(dateIn);
      newDate.setMinutes(minutes);

      /* For some reason, calling dispatch inside a drag event handler doesn't cause the 
      screen to update, so this workaround is necessary. */
      setDelayedCalEventsDispatch(
        {
          type: "setDate",
          id: id,
          newDate: newDate
        }
      );
    }
  }



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
      
      <div
      style={innerColumnStyle}
      onClick={e => {createEvent(e, dateIn, dispatchCalEvents)}}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      >
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


function HourBlock() {
  return <CalBlock></CalBlock>
  //return <CalBlock onClick={e => {createEvent(e, date, dispatchCalEvents)}}></CalBlock>
}


function getMinuteFromMouseY(mouseY: number): number {
  const height = ROW_HEIGHT * SPACING;
  const minuteRatio = MINUTES_IN_HOUR / height;
  const minutes = minuteRatio * mouseY;
  return floorToInt(minutes, MINUTE_INTERVAL);
}


function createEvent(event: React.MouseEvent<HTMLElement>, date: Date, dispatchCalEvents: Function) {
  const fromDate = new Date(date);

  const y = event.nativeEvent.layerY;
  const minutes = getMinuteFromMouseY(y);
  fromDate.setMinutes(minutes);

  dispatchCalEvents({
    type: "create",
    fromDate: fromDate
  });
}