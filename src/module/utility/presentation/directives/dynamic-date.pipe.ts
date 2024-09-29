import {inject, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

type Formats = 'short' | 'medium' | 'shortDate';

const predefinedFormats: Record<Formats, Intl.DateTimeFormatOptions> = {
  short: {
    hour: '2-digit',
    minute: '2-digit',
      // second: '2-digit',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hourCycle: 'h23',
  },
  medium: {
    timeStyle: 'short',
    dateStyle: 'full',
    hourCycle: 'h23',
  },
  shortDate: {
    dateStyle: 'short',
    hourCycle: 'h23',
  },
};

@Pipe({
  name: 'dynamicDate',
  pure: false,
  standalone: true,
})
export class DynamicDatePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  public transform(value: string, format: Formats = 'short') {
    return new Intl.DateTimeFormat(
      this.translateService.currentLang,
      predefinedFormats[format],
    ).format(new Date(value));
  }
}
