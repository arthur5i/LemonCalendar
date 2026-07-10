//"use client";

import { ReactElement } from "react";
import MiniCalendar from "./minicalendar";
//import Image from "next/image";
//import Gear from "@/public/mdi--gear.svg";
//import { MaxSeparator } from "./components";

export default function OptionsPanel() {
  return (
    <div className="flex flex-col w-md p-2">
      <MiniCalendar />
      <GroupsSelection />
    </div>
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

