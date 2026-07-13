//"use client";

import { ReactElement, EventHandler } from "react";
import MiniCalendar from "./minicalendar";
//import Image from "next/image";
//import Gear from "@/public/mdi--gear.svg";
import { Panel } from "./components";

export default function OptionsPanel() {
  return (
    <Panel direction="col" style="w-md p-2">
      <MiniCalendar />
      <GroupsSelection />
    </Panel>
  );
}

function GroupsSelection() {
  const tempGroups = ["Group 1", "Group 2"];

  return (
  <div>
    <ul className="list-none">
      {tempGroups.map(value => <li key={value}>
        <input type="checkbox" />
        <span>{value}</span>
      </li>)}
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