import { ReactElement } from "react";

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