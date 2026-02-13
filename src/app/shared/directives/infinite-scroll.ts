import { Directive, ElementRef, input, output } from '@angular/core';

@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScrollDirective {
  private observer?: IntersectionObserver;

  disabled = input<boolean>(false);
  intersected = output<void>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.disabled()) {
          this.intersected.emit();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
