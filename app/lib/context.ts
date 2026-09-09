import { createContext } from "react";
import { DateFormat, PreferencesType } from "./types";
import { PRESET_PREFERENCES } from "./const";

export const Preferences = createContext<PreferencesType>(PRESET_PREFERENCES.get("US")!);