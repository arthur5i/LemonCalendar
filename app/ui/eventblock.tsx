"use client";

import { useState, useReducer, useContext } from "react";
import { isSameDay } from "date-fns";
import { CalEvent } from "../lib/calevents";
import { formatAsTime } from "../lib/utils";
import { Preferences } from "../lib/context";
import { ROW_HEIGHT, SPACING, PLACEHOLDER_EVENT_TITLE, MINUTES_IN_HOUR } from "../lib/const";
import { EditingMode, CalEditingState } from "../lib/types";


type Props = {
  thisEvent: CalEvent,
  calEvents: CalEvent[],
  dispatchCalEvents: Function,
  calEditingState: CalEditingState,
  dispatchCalEditingState: Function,
}


/**
 * 
 * @prop thisEvent {CalEvent} The calendar event that this event block concerns. Technically redundant,
 * as it is contained within the "calEvents" prop, but passed for convenient reference.
 * @prop calEvents {CalEvent[]} The calEvents state
 * @prop setEvents {Function} The function for setting the calEvents state
 * @prop rowHeightValue {number} The value containing the height of the row on the calendar
 * @returns 
 */
export default function EventBlock(props: Props) {
  const {thisEvent, calEditingState, dispatchCalEditingState} = props;
  /*
  TODO: Handle having multiple calEvents happening at the same time
  */
  

  //const [editingMode, setEditingMode] = useState(EditingMode.None);

  const rowHeight = ROW_HEIGHT * SPACING;
  const cssStyle = {
    height: rowHeight,
    top: `calc(var(--spacing) * ${ROW_HEIGHT * getYPos()})`
  }
  const twStyle = "bg-blue-500 text-white p-1 w-full absolute border border-black cursor-grab";
  const draggable = calEditingState.getHoverEditingMode() === EditingMode.None || (
    calEditingState.getActiveEditingId() === thisEvent.id &&
    calEditingState.getActiveEditingMode() === EditingMode.Position
  );
  

  function getYPos() {
    return thisEvent.fromDate.getHours() +
    (thisEvent.fromDate.getMinutes() / MINUTES_IN_HOUR);
  }
  
  
  function handlePointerEnter() {
    dispatchCalEditingState({
      type: "eventBlockEnter",
      calEventId: thisEvent.id
    });
  }


  function handlePointerLeave() {
    dispatchCalEditingState({
      type: "eventBlockLeave"
    });
  }


  return <div
    style={cssStyle}
    className={twStyle}
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
  >
    <ResizeHandle {...props} topHandle={true} calEditingState={calEditingState} dispatchCalEditingState={dispatchCalEditingState} />
    <EventName {...props} calEditingState={calEditingState} dispatchCalEditingState={dispatchCalEditingState} />
    <DisplayTime {...props} />
    <ResizeHandle {...props} topHandle={false} calEditingState={calEditingState} dispatchCalEditingState={dispatchCalEditingState} />
  </div>
}


function EventName(props: Props & {calEditingState: CalEditingState, dispatchCalEditingState: Function}) {
  const {thisEvent, dispatchCalEvents, calEditingState, dispatchCalEditingState} = props;

  const [titleDraft, setTitleDraft] = useState(thisEvent.title);

  function onTitleClick(event: React.MouseEvent<HTMLElement>) {
    dispatchCalEditingState({
      type: "Title",
      calEventId: thisEvent.id
    });
    setTitleDraft(thisEvent.title);
  }

  function onPointerEnter() {
    dispatchCalEditingState({
      type: "eventNameEnter",
      calEventId: thisEvent.id
    });
  }

  function onPointerLeave() {
    dispatchCalEditingState({
      type: "eventNameLeave"
    });
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    setTitleDraft(target.value);
  }

  function setEventTitle(event: React.FocusEvent) {
    event.preventDefault();
    
    // Change event title
    dispatchCalEvents({
      type: "setTitle",
      id: thisEvent.id,
      titleDraft: titleDraft
    });

    dispatchCalEditingState({
      type: "clearActiveEditingState"
    });
  }

  let eventName;
  if (calEditingState.isEditingMode(thisEvent, EditingMode.Title)) {
    eventName = <input
      value={titleDraft}
      onChange={onInputChange}
      onBlur={setEventTitle}
      autoFocus={true}></input> 
  } else {
    eventName = <span
    onClick={onTitleClick}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    className="cursor-text">
      {(thisEvent.title === "") ? <i>{PLACEHOLDER_EVENT_TITLE}</i> : thisEvent.title}
    </span>
  }
  
  return <div>{eventName}</div>
}


function DisplayTime(props: Props) {
  const preferences = useContext(Preferences);
  const {thisEvent} = props;
  const displayTime = formatAsTime(thisEvent.fromDate, preferences.tfHourTime);
  return <div>{displayTime}</div>;
}


function ResizeHandle(props: Props & {topHandle: boolean, calEditingState: CalEditingState, dispatchCalEditingState: Function}) {
  const {thisEvent, topHandle, calEditingState, dispatchCalEditingState} = props;
  
  const visibleHandles = true;
  const pointerDeviation = 0;

  
  const twStyle = `absolute h-2 w-full bg-red-600 cursor-n-resize
  ${visibleHandles ? "" : "opacity-0"}`

  const cssStyle = {
    left: 0,
    top: topHandle ? (pointerDeviation - 2) : undefined,
    bottom: topHandle ? undefined : (pointerDeviation - 2)
  }


  return <div
    className={twStyle}
    style={cssStyle}>
  </div>
}