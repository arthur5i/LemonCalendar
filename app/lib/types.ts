export interface Month {
  id: number,
  name: string,
  shortName: string
}

export interface WeekDay {
  id: number,
  name: string,
  shortName: string,
  shorterName: string
}

export interface MenuBarOption {
  id: number,
  name: string,
  action: () => void,
}

export interface CalendarGroup {
  id: string,
  name: string,
  checked?: boolean
}