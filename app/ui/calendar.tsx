//"use client";

import { useState, useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import EventBlock from "./eventblock";
import {
  ROW_HEIGHT,
  SPACING,
  MINUTE_INTERVAL,
  MINUTES_IN_HOUR,
  DAYS_OF_WEEK,
  HOURS_IN_DAY,
  HOURS_SEQUENCE,
  TEST_EDITING_STATE
} from "../lib/const";
import CurrentTime from "../lib/time";
import { CalEvent } from "../lib/calevents";
import { getSimpleTime, roundToInt, floorToInt } from "../lib/utils";
import { EditingMode, CalEditingState, Coord } from "../lib/types";
import { format, addDays, isSameDay, setHours, set } from "date-fns";
import { DateRange } from "react-day-picker";
import { Properties } from "csstype";
import { Preferences } from "../lib/context";
import { validate as uuidValidate } from "uuid";


type dispatchAction = {
  type: string
}

type DateColumnProps = {
  dateIn: Date,
  calEvents: CalEvent[],
  dispatchCalEvents: Function,
  setDelayedCalEventsDispatch: Function,
  calEditingState: CalEditingState,
  dispatchCalEditingState: Function
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

  const [calEditingState, dispatchCalEditingState] 
    = useImmerReducer(calEditingStateReducer, new CalEditingState());
  const [delayedCalEventsDispatch, setDelayedCalEventsDispatch] 
    = useState<dispatchAction>({type: "none"});

  let dateOfWeek = selectedWeek.from!;

  const dateColumns = DAYS_OF_WEEK.map((weekDay) => {
    const dateColumn = <DateColumn
    dateIn={dateOfWeek}
    calEvents={calEvents}
    dispatchCalEvents={dispatchCalEvents}
    setDelayedCalEventsDispatch={setDelayedCalEventsDispatch}
    calEditingState={calEditingState}
    dispatchCalEditingState={dispatchCalEditingState}
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

  
  function handlePointerEnter(event: React.PointerEvent) {
    dispatchCalEditingState({
      type: "calendarEnter"
    })
  }

  function handlePointerLeave(event: React.PointerEvent) {
    dispatchCalEditingState({
      type: "calendarLeave"
    })
  }
  


  return (
    <div
    className="flex flex-auto items-start overflow-y-scroll"
    onPointerEnter={handlePointerEnter}
    onPointerMove={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    >
      {TEST_EDITING_STATE && <div className="absolute top-0 left-0 w-64 h-32 bg-slate-300 z-10">
        {calEditingState.toStringArray().map((value, index) => <div key={index}>{value}</div>)}
      </div>}
      <TimeColumn />
      {dateColumns}
    </div>
  );
}


function calEditingStateReducer(draft: CalEditingState, action: any): any {
  switch (action.type) {
    case "calendarEnter":
      draft.addHoverValue(EditingMode.NewEvent);
      break;
    case "calendarLeave":
      draft.setSingleHoverValue(EditingMode.None);
      break;
    case "eventBlockEnter":
      draft.addHoverValue(EditingMode.NewEvent);
      draft.addHoverValue(EditingMode.Position, action.calEventId);
      break;
    case "eventBlockLeave":
      draft.removeHoverValue(EditingMode.Position, true);
      console.log("eventBlockLeave");
      break;
    case "eventNameEnter":
      draft.addHoverValue(EditingMode.NewEvent);
      draft.addHoverValue(EditingMode.Position, action.calEventId);
      draft.addHoverValue(EditingMode.Title, action.calEventId);
      break;
    case "eventNameLeave":
      draft.removeHoverValue(EditingMode.Title);
      break;
    case "eventResizeEnter":
      let editingMode: EditingMode;
      if (action.fromDate) {
        editingMode = EditingMode.FromDate;
      } else {
        editingMode = EditingMode.ToDate;
      }
      draft.addHoverValue(editingMode, action.calEventId);
      break;
    case "eventResizeLeave":
      draft.removeHoverValue(action.FromDate);
      draft.removeHoverValue(action.ToDate);
      break;
    case "clearActiveEditingState":
      draft.clearActiveEditingState();
      break;
    default:
      console.log("Invalid action type in calEditingStateReducer");
  }
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


function DateColumn(props: DateColumnProps) {
  const {dateIn, calEvents, dispatchCalEvents, setDelayedCalEventsDispatch, dispatchCalEditingState} = props;

  const columnStyle = "bg-white w-full relative";
  const innerColumnStyle: Properties = {
    position: "absolute",
    width: "100%",
    top: `calc(var(--spacing) * ${ROW_HEIGHT} + ${ROW_HEIGHT})`,
  };

  return (
    <div className={columnStyle}>
      <DateColumnHeader {...props} />
      <DateColumnSpace {...props} innerColumnStyle={innerColumnStyle} />
      <CalEventBlocks {...props} innerColumnStyle={innerColumnStyle} />
    </div>
  );
}


function DateColumnHeader(props: DateColumnProps) {
  const {dateIn} = props;
  const isCurrentDay = isSameDay(dateIn, CurrentTime.date);
  const columnDate = dateIn.getDate();
  const weekDay = DAYS_OF_WEEK[dateIn.getDay()];

  return <CalBlock headerType={isCurrentDay}>
    <div>
      {weekDay.shortName}
    </div>
    <div>
      {columnDate}
    </div>
  </CalBlock>
}


function DateColumnSpace(props: DateColumnProps & {innerColumnStyle: Properties}) {
  const {dateIn, dispatchCalEvents, setDelayedCalEventsDispatch, dispatchCalEditingState} = props;

  const hourBlocks = HOURS_SEQUENCE.map((hour, index) => {
    const dateOfHour = setHours(dateIn, hour);
    return <HourBlock key={index}/>
  });


  function createEvent(event: React.MouseEvent<HTMLElement>) {
    const fromDate = new Date(dateIn);

    const y = event.nativeEvent.layerY;
    const minutes = getMinuteFromMouseY(y);
    fromDate.setMinutes(minutes);
    const newEvent = new CalEvent(fromDate);

    dispatchCalEvents({
      type: "create",
      calEvent: newEvent,
      dispatchCalEditingState: dispatchCalEditingState
    });

    dispatchCalEditingState({
      type: "eventBlockEnter",
      calEventId: newEvent.id
    });
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();

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


  return <div
    style={props.innerColumnStyle}
    onClick={createEvent}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
    >
      {hourBlocks}
  </div>
}


function CalEventBlocks(props: DateColumnProps & {innerColumnStyle: Properties}) {
  const {
    dateIn,
    calEvents,
    dispatchCalEvents,
    calEditingState: calEditingState,
    dispatchCalEditingState
  } = props;

  // Get all calEvents for the day that this column represents
  const thisDayEvents = calEvents.filter(event => {
    return (isSameDay(dateIn, event.fromDate));
  });

  const eventBlocks = thisDayEvents.map((event, index) => {
    return <EventBlock
      thisEvent={event}
      calEvents={calEvents}
      dispatchCalEvents={dispatchCalEvents}
      calEditingState={calEditingState}
      dispatchCalEditingState={dispatchCalEditingState}
      key={event.id}/>;
  });

  return <div style={props.innerColumnStyle}>
    {eventBlocks}
  </div>
}


function TimeBlock({hour}: {hour: number}) {
  //const pref = useContext(Preferences);

  return <CalBlock>
    {getSimpleTime(hour, false)}
  </CalBlock>
}


function HourBlock() {
  return <CalBlock></CalBlock>
}


function getMinuteFromMouseY(mouseY: number): number {
  const height = ROW_HEIGHT * SPACING;
  const minuteRatio = MINUTES_IN_HOUR / height;
  const minutes = minuteRatio * mouseY;
  return floorToInt(minutes, MINUTE_INTERVAL);
}