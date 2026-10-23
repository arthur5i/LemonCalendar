import { CalEvent } from "./calevents";
import {immerable} from "immer";

export interface Month {
  id: number,
  name: string,
  shortName: string
}

export interface WeekDay {
  id: number,
  name: string,
  shortName: string,
  shorterName: string
}

export interface MenuBarOption {
  id: number,
  name: string,
  action: () => void,
}

export interface CalendarGroup {
  id: string,
  name: string,
  checked?: boolean
}

export enum DateFormat {
  DMY = "dd/MM/yyyy",
  MDY = "MM/dd/yyyy",
  YMD = "yyyy/MM/dd"
}

export interface PreferencesType {
  tfHourTime: boolean,
  dateFormat: DateFormat,
  weekStartsOnMonday: boolean
}

/**
* Controls how the calendar component reacts to mouse clicks
* @readonly
* @enum {number}
* @property None - When the mouse is outside of the calendar
* @property NewEvent - Mouse is on blank space, create CalEvent on click
* @property TitleHover - Mouse is hovering over title, start editing title on click
* @property Title - Editing title of calendar event
* @property PositionHover - Mouse is hovering over calendar event, initiate position dragging on mouse down
* @property Position - Mouse is dragging calendar event position
* @property FromDateHover - Mouse is hovering over top resize handle of event, initiate size dragging on mouse down
* @property FromDate - Mouse is dragging calendar event fromDate
* @property ToDateHover - Mouse is hovering over bottom resize handle of event, initiate size dragging on mouse down
* @property ToDate - Mouse is dragging calendar event toDate
*/
export enum EditingMode {
  None,
  NewEvent,
  Title,
  Position,
  FromDate,
  ToDate
}

/**
 * Stores the interaction state of the program, determining what a mouse click will do at any given point.
 * Might split into 2 classes
 */
export class CalEditingState {
  [immerable] = true;

  hoverStack: EditingMode[] = [];
  hoverId = "";

  activeEditingMode: EditingMode = EditingMode.None;
  activeEditingId = "";

  addHoverValue(editingInfo: EditingMode, id?: string) {
    if (this.hoverStack.includes(editingInfo) === false) {
      if (this.hoverStack[0] === EditingMode.None) {
        this.hoverStack[0] = editingInfo;
      } else {
        this.hoverStack.push(editingInfo);
      }

      if (id !== undefined) {
        this.hoverId = id;
      }
    }
  }

  removeHoverValue(editingMode: EditingMode, clearId?: boolean) {
    const infoIndex = this.hoverStack.findIndex((value: EditingMode) => {
      return (value === editingMode);
    });

    if (infoIndex === -1) {
      console.log("Warning: No calEventId found");
      return;
    }

    this.hoverStack = this.hoverStack.slice(0, infoIndex);

    if (clearId !== undefined && clearId) {
      this.hoverId = "";
    }
  }

  setSingleHoverValue(editingInfo: EditingMode, id?: string) {
    this.hoverStack = [editingInfo];
    if (id !== undefined) {
      this.hoverId = id;
    } else {
      this.hoverId = "";
    }
  }

  getHoverEditingMode(): EditingMode {
    return this.hoverStack[this.hoverStack.length - 1];
  }

  getHoverId(): string {
    return this.hoverId;
  }

  getActiveEditingMode(): EditingMode {
    return this.activeEditingMode;
  }

  getActiveEditingId(): string {
    return this.activeEditingId;
  }

  clearActiveEditingState() {
    this.activeEditingMode = EditingMode.None;
    this.activeEditingId = "";
  }

  isEditingMode(calEvent: CalEvent, editingMode: EditingMode): boolean {
    return (
      this.activeEditingId === calEvent.id &&
      this.activeEditingMode === editingMode
    );
  }

  isSizeMode(calEvent: CalEvent): boolean {
    return (
      this.activeEditingId === calEvent.id && (
        this.activeEditingMode === EditingMode.FromDate ||
        this.activeEditingMode === EditingMode.ToDate
      )
    );
  }

  toStringArray(): string[] {
    return [
      `hoverStack: [${this.hoverStack.map((val: EditingMode) => EditingMode[val])}]`,
      `hoverId: ${this.hoverId}`,
      `activeEditingMode: ${this.activeEditingMode}`,
      `activeEditingId: ${this.activeEditingId}`
    ]
  }
}

export type Coord = {
  x: number,
  y: number
}