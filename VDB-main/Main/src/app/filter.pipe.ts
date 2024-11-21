import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    return value.filter((item: any) => {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
