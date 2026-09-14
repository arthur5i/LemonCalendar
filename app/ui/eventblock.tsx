"use client";

import { useState, useReducer, useContext } from "react";
import { isSameDay } from "date-fns";
import { CalEvent } from "../lib/events";
import { formatAsTime } from "../lib/utils";
import { Preferences } from "../lib/context";
import { ROW_HEIGHT, SPACING, PLACEHOLDER_EVENT_TITLE, MINUTES_IN_HOUR } from "../lib/const";

/**
 * 
 * @prop thisEvent {CalEvent} The event that this event block concerns. Technically redundant,
 * as it is contained within the "events" prop, but passed for convenient reference.
 * @prop events {CalEvent[]} The events state
 * @prop setEvents {Function} The function for setting the events state
 * @prop rowHeightValue {number} The value containing the height of the row on the calendar
 * @returns 
 */
export default function EventBlock({thisEvent, events, setEvents}:
  {thisEvent: CalEvent, events: Map<string, CalEvent>, setEvents: Function}) {
  /*
  TODO: Handle having multiple events happening at the same time
  */
  const preferences = useContext(Preferences);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(thisEvent.title);

  const rowHeight = ROW_HEIGHT * SPACING;

  function getYPos() {
    return thisEvent.fromDate.getHours() +
    (thisEvent.fromDate.getMinutes() / MINUTES_IN_HOUR);
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
    setEvents((draft: Map<string, CalEvent>) => {
      const alterEvent = events.get(thisEvent.id);
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
    eventName = <span onClick={onTitleClick} className="cursor-text">
      {(thisEvent.title === "") ? <i>{PLACEHOLDER_EVENT_TITLE}</i> : thisEvent.title}
    </span>
  }

  const cssStyle = {
    height: rowHeight,
    top: `calc(var(--spacing) * ${ROW_HEIGHT * getYPos()})`
  }
  const twStyle = "bg-blue-500 text-white p-1 w-full absolute border border-black cursor-grab";
  const displayTime = formatAsTime(thisEvent.fromDate, preferences.tfHourTime);

  return <div
  style={cssStyle}
  className={twStyle}>
    <div>{eventName}</div>
    <div>{displayTime}</div>
  </div>
}