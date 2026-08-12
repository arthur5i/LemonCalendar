"use client";

import { ReactElement, useState, useContext } from "react";
import { produce } from "immer";
import { CalendarGroup } from "../lib/types";
import MiniCalendar from "./minicalendar";
import { Panel } from "./components";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";


export default function OptionsPanel({ calendarGroups, setCalendarGroups }:
  {
    calendarGroups: CalendarGroup[]
    setCalendarGroups: Function
  }) {
  return (
    <Panel direction="col" style="w-md p-2">
      <MiniCalendar />
      <GroupsSelection calendarGroups={calendarGroups} setCalendarGroups={setCalendarGroups}/>
    </Panel>
  );
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