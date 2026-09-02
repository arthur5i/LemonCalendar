"use client";

export default class CurrentTime {
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
}

