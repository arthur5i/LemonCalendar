"use client";

import { useState, useReducer } from "react";
import { format, isSameDay } from "date-fns";
import { CalEvent } from "../lib/events";
import { calcSpacing } from "../lib/utils";

/**
 * 
 * @prop thisEvent {CalEvent} The event that this event block concerns. Technically redundant,
 * as it is contained within the "events" prop, but passed for convenient reference.
 * @prop events {CalEvent[]} The events state
 * @prop setEvents {Function} The function for setting the events state
 * @prop rowHeightValue {number} The value containing the height of the row on the calendar
 * @returns 
 */
export default function EventBlock({thisEvent, events, setEvents, rowHeightValue}:
  {thisEvent: CalEvent, events: CalEvent[], setEvents: Function, rowHeightValue: number}) {
  /*
  TODO: Handle having multiple events happening at the same time
  */
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(thisEvent.title);

  const rowHeight = calcSpacing(rowHeightValue);

  function getYPos() {
    return thisEvent.fromDate.getHours();
  }

  function onTitleClick(event: React.MouseEvent<HTMLElement>) {
    setEditingTitle(true);
    setTitleDraft(thisEvent.title);
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    setTitleDraft(target.value);
  }

  function setEventTitle(event: React.FocusEvent) {
    event.preventDefault();
    
    // Change event title
    setEvents((draft: CalEvent[]) => {
      const alterEvent = draft.find((val: CalEvent) => (val.id === thisEvent.id));
      if (alterEvent !== undefined) {
        alterEvent.title = titleDraft;
      } else {
        console.error("Undefined event upon changing title");
      }
    });

    setEditingTitle(false);
  }

  let eventName;
  if (editingTitle) {
    eventName = <input
      value={titleDraft}
      onChange={onInputChange}
      onBlur={setEventTitle}
      autoFocus={true}></input> 
  } else {
    eventName = <span onClick={onTitleClick}>
      {(thisEvent.title === "") ? <i>Untitled Event</i> : thisEvent.title}
    </span>
  }

  const cssStyle = {
    height: rowHeight,
    top: `calc(var(--spacing) * ${rowHeightValue * getYPos()})`
  }
  const twStyle = "bg-blue-500 text-white p-1 w-full absolute";

  return <div
  style={cssStyle}
  className={twStyle}>
    {eventName}
  </div>
}