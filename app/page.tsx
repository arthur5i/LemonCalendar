"use client";

import { useState } from "react";
import { CalendarGroup } from "./lib/types";
import Image from "next/image";
import MainMenuBar from "./ui/mainmenubar";
import OptionsPanel from "./ui/optionspanel";
import CalendarPanel from "./ui/calendar";

export default function Home() {
  let initialGroups: CalendarGroup[] = [
    {id: "0", "name": "Group 1"},
    {id: "1", "name": "Group 2"}
  ];

  initialGroups = initialGroups.map(group => {
    return {...group, "checked": false}
  });

  const [calendarGroups, setCalendarGroups] = useState(initialGroups);

  return (
    <div className="flex flex-col">
      <MainMenuBar />
      <div className="flex">
        <OptionsPanel calendarGroups={calendarGroups} setCalendarGroups={setCalendarGroups}/>
        <CalendarPanel calendarGroups={calendarGroups}/>
      </div>
    </div>
  );
}