"use client";

import { useState } from "react";
import { MONTHS, DAYS_OF_WEEK } from "../lib/const";

// Temporary solution for testing, components ought to pull data from global API
const date = new Date("2026-07-03T12:00:00");
const currentMonth = date.getMonth();

export default function MiniCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  return <div className="p-2 border border-gray-300">
    <MonthHeader selectedMonth={selectedMonth} />
    <DateGrid />
  </div>
}

function MonthHeader({selectedMonth}: {selectedMonth: number}) {
  return <div className="">{MONTHS[selectedMonth].name}</div>
}

function MonthChangeButtons() {

}

function DateGrid() {
  const weekDays = DAYS_OF_WEEK.map((day) => {
    return <div className="min-w-4 min-h-4 text-center" key={day.id}>{day.shorterName}</div>
  });

  // Replace with actual date alignment calculation
  const dateValues = new Array(35);
  let date = 28;
  let lastDate = 30;
  for (let i = 0; i < 35; i++) {
    dateValues[i] = date;
    date++;
    if (date > lastDate) {
      date = 1;
      lastDate = 31;
    }
  }

  const dateCells = dateValues.map((thisDate, i) => {
    return <DateCell date={thisDate} key={i}/>;
  });

  return <div className="grid grid-cols-7 gap-1">
    {weekDays}
    {dateCells}
  </div>
}

function DateCell({date}: {date: number}) {
  return <button className="min-w-4 min-h-4 border-2 border-black hover:border-cyan-600 cursor-pointer">
    {date}
  </button>
}