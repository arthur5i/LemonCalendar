"use client";

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
//import { enableMapSet } from "immer";
import { useImmer, useImmerReducer } from "use-immer";
import { getWeekRangeOfDate } from "./lib/utils";
import CurrentTime from "./lib/time";
import { CalEventGroup, CalEvent} from "./lib/calevents";
import { Preferences } from "./lib/context";
import { PRESET_PREFERENCES } from "./lib/const";
import MainMenuBar from "./ui/mainmenubar";
import OptionsPanel from "./ui/optionspanel";
import CalendarPanel from "./ui/calendar";
import { DateRange } from 'react-day-picker';

//enableMapSet();

export default function Home() {
  // Placeholder data for testing groups, will be loaded from cookies or web API in future
  const [calEventGroups, setCalEventGroups] = useImmer([
    {
      "id": "5acf4f2d-9b2e-4abc-93eb-2ba2bf1e6bb2",
      "name": "Group 1",
      "events": [],
      "visible": true,
      "locked": false
    },
    {
      "id": "aa13cf91-da0f-4ef2-b81d-e82cc6faf231",
      "name": "Group 2",
      "events": [],
      "visible": true,
      "locked": false
    },
    {
      "id": "446ca558-27c4-4a88-8c41-b01759a6e13c",
      "name": "Group 3",
      "events": [],
      "visible": true,
      "locked": false
    }
  ]);

  // Stores the information about calendar events set by the user
  const [calEvents, dispatchCalEvents] = useImmerReducer(calEventsReducer, new Array<CalEvent>());

  // Keeps track of what week is currently being focused on
  const [selectedWeek, setSelectedWeek] = useState<DateRange>(
    getWeekRangeOfDate(CurrentTime.date)
  );

  const [preferences, setPreferences] = useState(PRESET_PREFERENCES.get("US")!);

  return (
    <div className="flex flex-col h-screen">
      <Preferences value={preferences}>
      <MainMenuBar />
        <div className="flex h-screen overflow-y-hidden">
            <OptionsPanel
            eventGroups={calEventGroups} setEventGroups={setCalEventGroups}
            selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek}
            />
            <CalendarPanel
            selectedWeek={selectedWeek}
            calEvents={calEvents} dispatchCalEvents={dispatchCalEvents}
            />
        </div>
      </Preferences>
    </div>
  );
}

function calEventsReducer(draft: CalEvent[], action: any): any {
  switch (action.type) {

    case "create":
      const newEvent = new CalEvent(action.fromDate);
      draft.push(newEvent);
      break;

    case "setTitle":
      try {
        var index = draft.findIndex(value => value.id === action.id);
        draft[index].title = action.titleDraft;
      } catch {
        throw Error("Undefined event upon changing title");
      }
      break;

    case "setDate":
      try {
        var index = draft.findIndex(value => value.id === action.id);
        draft[index].fromDate = action.newDate;
      } catch {
        throw Error("Undefined event upon changing date");
      }
      break;
    
    case "none":
      break;

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}