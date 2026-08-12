import { useState, ReactElement } from "react";
import { MenuBarOption } from "../lib/types";

export function Panel({children, direction = "row", style}: {children: ReactElement[], direction: string, style: string}) {
  const elementStyle = `flex
  flex-${direction}
  ${style}`;
  
  return (<div className={elementStyle}>
    {children}
  </div>);
}

// Problematic, as this has the potential to extend a page's height or width, consider fixings
export function MaxSeparator() {
  return <div className="grow"></div>
}

export function MenuBar({children}: {children: ReactElement|ReactElement[]}) {
  return <div className="flex">
    {children}
  </div>
}

export function MenuBarDropdown({children, label}:
  {children: ReactElement[], label: string}) {
  //const [menuOpen, setMenuOpen] = useState(false);

  function showMenu(e: React.MouseEvent) {
    console.log("Opened menu");
    const target = e.target as HTMLElement;
    const menu = target.parentElement!.lastChild! as HTMLElement;
    menu.focus();
    menu.style.display = "flex";
  }

  function hideMenu(e: React.FocusEvent) {
    console.log("Closed menu");
    const target = e.target as HTMLElement;
    const menu = target.parentElement!.lastChild! as HTMLElement;
    menu.style.display = "none";
  }

  return <div>
    <button onClick={showMenu} className="p-1 bg-white hover:bg-blue-400">{label}</button>
    <div onBlur={hideMenu} className="hidden flex-col">
      {children}
    </div>
  </div>
}

export function MenuBarItem({label, action}: {label: string, action: any}) {
  return <button onClick={action}>{label}</button>
}