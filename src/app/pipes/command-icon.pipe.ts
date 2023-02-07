import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commandIcon'
})
export class CommandIconPipe implements PipeTransform {

  transform(value: string, args?: any): string {

    switch (value) {

      case 'OpenCommand':
        return 'start'

      case 'AssignCommand':
        return 'person'

      case 'CloseCommand':
          return 'stop'

      case 'ReopenCommand':
        return 'restart_alt'

      case 'SuspendCommand':
        return 'pause'

      default:
        return 'bolt'
    }

  }

}
