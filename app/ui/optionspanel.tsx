"use client";

import { ReactElement, useState } from "react";
import { EventGroup } from "../lib/calevents";
import { Panel } from "./components";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { endOfWeek, startOfWeek } from "date-fns";
import { DateRange, rangeIncludesDate, Modifiers } from 'react-day-picker';
import calendarStyles from "react-day-picker/dist/style.module.css";

export default function OptionsPanel({eventGroups, setEventGroups, selectedWeek, setSelectedWeek}:
  {
    eventGroups: EventGroup[],
    setEventGroups: Function
    selectedWeek: DateRange,
    setSelectedWeek: Function
  }) {

  return (
    <Panel direction="col" style="w-md p-2">
      <MiniCalendar
      selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek}
      />
      <GroupsSelection
      eventGroups={eventGroups} setEventGroups={setEventGroups}
      />
    </Panel>
  );
}

function MiniCalendar({selectedWeek, setSelectedWeek}: {
  selectedWeek: DateRange,
  setSelectedWeek: Function
}) {
  function selectWeek(day: Date, modifiers: Modifiers) {
    if (modifiers.disabled || modifiers.hidden) return;
    setSelectedWeek({
      from: startOfWeek(day),
      to: endOfWeek(day),
    });
  }

  const calendarClassNames = {
    ...calendarStyles,
    weekday: calendarStyles.day
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

function GroupsSelection({eventGroups, setEventGroups}: {eventGroups: EventGroup[], setEventGroups: Function}) {
  function setChecked(checked: boolean, id: string) {
    setEventGroups((draft: EventGroup[]) => {
      const group = draft.find(g => g.id === id);
      if (group !== undefined) group.visible = checked;
    })
  }

  const checkboxes = eventGroups.map((group) => {
    return (
      <li key={group.id}>
        <Field orientation="horizontal" className="m-2">
          <Checkbox
          checked={group.visible}
          onCheckedChange={(checked) => {setChecked(checked, group.id)}} />
          <Label>{group.name}</Label>
        </Field>
      </li>
    )
  });
  
  return (
  <div>
    <ul className="list-none">
      {Array.from(checkboxes)}
    </ul>
  </div>
  );
}

function GroupCheckbox({name, visible}: {name: string, visible: boolean}) {
  const [checked, setChecked] = useState(visible);

  return <Field orientation="horizontal" className="m-2">
    <Checkbox
    checked={checked}
    onCheckedChange={(isChecked) => {setChecked(isChecked)}} />
    <Label>{name}</Label>
  </Field>
}

function BottomPanel({children}: {children: ReactElement}) {
  return <div className="h-8">
    {children}
  </div>
}