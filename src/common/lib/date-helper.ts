import { isBefore } from "date-fns"

export class DateHelper {
  static isDateBefore(date1: Date, date2: Date): boolean {
    return isBefore(date1, date2)
  }
}
