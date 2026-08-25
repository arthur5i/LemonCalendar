"use client";

import { ReactElement, useState, useContext } from "react";
import { produce } from "immer";
import { getWeekRangeOfDate } from "../lib/utils";
import { CurrentTime } from "../lib/time";
import { CalendarGroup } from "../lib/types";
import { Panel } from "./components";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { endOfWeek, startOfWeek } from "date-fns";
import { ClassNames, DayPicker, DateRange, rangeIncludesDate, Modifiers } from 'react-day-picker';
import styles from "./optionspanel.module.css";
import calendarStyles from "react-day-picker/dist/style.module.css";

export default function OptionsPanel({ calendarGroups, setCalendarGroups, selectedWeek, setSelectedWeek }:
  {
    calendarGroups: CalendarGroup[],
    setCalendarGroups: Function,
    selectedWeek: DateRange,
    setSelectedWeek: Function
  }) {

  return (
    <Panel direction="col" style="w-md p-2">
      <MiniCalendar
      selectedWeek={selectedWeek}
      setSelectedWeek={setSelectedWeek}
      />
      <GroupsSelection calendarGroups={calendarGroups} setCalendarGroups={setCalendarGroups}/>
    </Panel>
  );
}

function MiniCalendar({selectedWeek, setSelectedWeek}: {
  selectedWeek: DateRange,
  setSelectedWeek: Function
}) {
  function selectWeek(day: Date, modifiers: Modifiers) {
    /*const weekRange = getWeekRangeOfDate(day);
    setSelectedWeek(weekRange);*/
    if (modifiers.disabled || modifiers.hidden) return;
    /*if (modifiers.selected) {
      setSelectedWeek(undefined);
      return;
    }*/
    setSelectedWeek({
      from: startOfWeek(day),
      to: endOfWeek(day),
    });
  }

  const calendarClassNames = {
    ...calendarStyles,
    weekday: calendarStyles.day,
    selected: styles.selected
  };

  return <Calendar
    modifiers={{
      selected: selectedWeek,
      range_start: selectedWeek.from,
      range_end: selectedWeek.to,
      range_middle: (date: Date) =>
        selectedWeek ? rangeIncludesDate(selectedWeek, date, true) : false,
    }}
    onDayClick={selectWeek}
    footer={
      selectedWeek &&
      `Week from ${selectedWeek?.from?.toLocaleDateString()} to ${selectedWeek?.to?.toLocaleDateString()}`
    }
    classNames={calendarClassNames}
    weekStartsOn={0}
    showOutsideDays
    fixedWeeks
    />
}

function GroupsSelection({ calendarGroups, setCalendarGroups }:
  {
    calendarGroups: CalendarGroup[]
    setCalendarGroups: Function
  }) {

  function toggleChecked(index: number, checked: boolean) {
    setCalendarGroups(produce(calendarGroups, draft => {
      draft[index]["checked"] = checked;
    }));
  }

  const checkboxes = calendarGroups.map((value, index) => {
    return (
      <li key={value["id"]}>
        <Field orientation="horizontal" className="m-2">
          <Checkbox
          checked={calendarGroups[index]["checked"]}
          onCheckedChange={(checked) => toggleChecked(index, checked)} />
          <Label>{value["name"]}</Label>
        </Field>
      </li>
    )
  });
  
  return (
  <div>
    <ul className="list-none">
      {checkboxes}
    </ul>
  </div>
  );
}

function BottomPanel({children}: {children: ReactElement}) {
  return <div className="h-8">
    {children}
  </div>
}

/*function SettingsButton() {
  return <button className="cursor-pointer" onClick={() => {console.log("settings menu")}}>
    <Gear className="h-8" fill="#000" />
  </button>
}*/