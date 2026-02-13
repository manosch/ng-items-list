import { ViewportScroller } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router, Scroll } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AutoScroll {
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private destroyRef = inject(DestroyRef);

  shouldScroll = new BehaviorSubject<boolean>(false);
  private readonly shouldScroll$ = this.shouldScroll.asObservable();
  private scrollPositions = new Map<string, [number, number]>();

  constructor() {
    this.init();
  }

  init() {
    // Store scroll position before navigation
    this.router.events.pipe(
      filter((event): event is NavigationStart => event instanceof NavigationStart),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      const position = this.viewportScroller.getScrollPosition();

      this.scrollPositions.set(currentUrl, position);
    });

    // Restore scroll position after navigation
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      switchMap((position) =>
        this.shouldScroll$.pipe(
          filter(Boolean),
          map(() => position)
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (event) => {
        const savedPosition = this.scrollPositions.get(event.urlAfterRedirects);
        this.viewportScroller.scrollToPosition(savedPosition || [0, 0]);
      },
    });
  }
}
