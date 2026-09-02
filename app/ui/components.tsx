export function Panel({children, direction = "row", style}: {children: React.ReactNode, direction: string, style: string}) {
  const elementStyle = `flex
  flex-${direction}
  ${style}`;
  
  return (<div className={elementStyle}>
    {children}
  </div>);
}