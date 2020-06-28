import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringHandlerService {

  constructor() { }

  // ========================================

  stripWeekday(dateString: string) {
    const regex = /^.{4}/gi
    return dateString.replace(regex, '')
  }
}
