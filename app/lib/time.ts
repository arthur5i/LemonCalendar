"use client";

export class CurrentTime {
  static readonly date = new Date();
  
  static getDay() {
    return CurrentTime.date.getDay();
  }

  static getDate() {
    return CurrentTime.date.getDate();
  }
  
  static getMonth() {
    return CurrentTime.date.getMonth();
  }

  static getDateForFirstDayOfWeek(): Date {
    const dateOut = new Date(CurrentTime.date);
    const day = dateOut.getDay();
    dateOut.setDate(dateOut.getDate() - day);
    return dateOut;
  }
}

