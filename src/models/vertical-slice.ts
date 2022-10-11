
/**
 * Vertical slice includes all attributes and values on given date
 * It consists of:
 *  1.) Date and time
 *  2.) Price attributes - low, high, open, close
 *  3.) Indicator value
 */
export class VerticalSlice {
  constructor(date: Date, open: number, close: number, high: number, low: number, volume: number) {
    this.date = date
    this.open = +open
    this.close = +close
    this.high = +high
    this.low = +low
    this.volume = +volume
  }

  date: Date
  open: number
  close: number
  high: number
  low: number
  volume: number
  next: VerticalSlice
  prev: VerticalSlice

  static copy(data: any): VerticalSlice {
    return new VerticalSlice(new Date(data.time), +data.open, +data.close, +data.high, +data.low, +data.volume)
  }
}
