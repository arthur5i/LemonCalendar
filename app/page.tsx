import Image from "next/image";
import OptionsPanel from "./ui/optionspanel";
import CalendarPanel from "./ui/calendar";

export default function Home() {
  /*return (
    <>
      <MenuBar />
      <OptionsPanel />
      <CalendarPanel />
    </>
  );*/

  return (
    <div className="flex h-full">
      <OptionsPanel />
      <CalendarPanel />
    </div>
  )
}
