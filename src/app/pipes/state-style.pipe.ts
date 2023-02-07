import { Pipe, PipeTransform } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Pipe({
  name: 'stateStyle'
})
export class StateStylePipe implements PipeTransform {

  transform(value: string, args?: any): string {

    if (value === 'I') {
      return 'bg-red-200 text-red-900'
    }

    if (value === 'O') {
      return 'bg-green-200 text-green-900'
    }

    if (value === 'S') {
      return 'bg-gray-200 text-gray-900'
    }

    if (value === 'C') {
      return 'bg-black text-white'
    }

    if (value === 'R') {
      return 'bg-white text-red-900'
    }

    return ''

  }

}
