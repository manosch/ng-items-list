import { AfterViewInit, Directive, inject } from '@angular/core';
import { AutoScroll } from '../services/auto-scroll';

@Directive({
  selector: '[restoreScrollPosition]',
  standalone: true,
})
export class RestoreScrollPosition implements AfterViewInit {
  autoScrollService = inject(AutoScroll);

  ngAfterViewInit(): void {
    this.autoScrollService.shouldScroll.next(true);
  }
}
