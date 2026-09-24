"use client";

import { useState, useReducer, useContext } from "react";
import { isSameDay } from "date-fns";
import { CalEvent } from "../lib/calevents";
import { formatAsTime } from "../lib/utils";
import { Preferences } from "../lib/context";
import { ROW_HEIGHT, SPACING, PLACEHOLDER_EVENT_TITLE, MINUTES_IN_HOUR } from "../lib/const";

enum Editing {
  None,
  Title,
  Position,
  Size
}

type Props = {
  thisEvent: CalEvent;
  calEvents: CalEvent[];
  dispatchCalEvents: Function;
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
  const {thisEvent} = props;
  /*
  TODO: Handle having multiple calEvents happening at the same time
  */
  

  const [editing, setEditing] = useState(Editing.None);

  const rowHeight = ROW_HEIGHT * SPACING;
  const cssStyle = {
    height: rowHeight,
    top: `calc(var(--spacing) * ${ROW_HEIGHT * getYPos()})`
  }
  const twStyle = "bg-blue-500 text-white p-1 w-full absolute border border-black cursor-grab";
  
  

  function getYPos() {
    return thisEvent.fromDate.getHours() +
    (thisEvent.fromDate.getMinutes() / MINUTES_IN_HOUR);
  }


  function handleDragStart(event: React.DragEvent) {
    if (editing === Editing.None) {
      setEditing(Editing.Position);
      event.dataTransfer.setData("text/parameters", thisEvent.id);
      //event.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
    } else {
      event.stopPropagation();
    }
  }

  function handleDragMove(event: React.DragEvent) {
    
  }

  function handleDragEnd(event: React.DragEvent) {
    setEditing(Editing.None);
  }


  return <div
    style={cssStyle}
    className={twStyle}
    draggable={true}
    onDragStart={handleDragStart}
    onDrag={handleDragMove}
    onDragEnd={handleDragEnd}
  >
    <EventName {...props} editing={editing} setEditing={setEditing} />
    <DisplayTime props={props} />
  </div>
}


function EventName(props: Props & {editing: Editing, setEditing: Function}) {
  const {thisEvent, dispatchCalEvents, editing, setEditing} = props;

  const [titleDraft, setTitleDraft] = useState(thisEvent.title);

  function onTitleClick(event: React.MouseEvent<HTMLElement>) {
    setEditing(Editing.Title);
    setTitleDraft(thisEvent.title);
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

    setEditing(Editing.None);
  }

  let eventName;
  if (editing === Editing.Title) {
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
  
  return <div>{eventName}</div>
}


function DisplayTime({props}: {props: Props}) {
  const preferences = useContext(Preferences);
  const {thisEvent} = props;
  const displayTime = formatAsTime(thisEvent.fromDate, preferences.tfHourTime);
  return <div>{displayTime}</div>;
}