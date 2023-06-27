import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  isFrame = false;
  isReady = false;
  private readonly destroying$ = new Subject<void>();

  ngOnInit(): void {
    this.isFrame = window !== window.parent && !window.opener;

    this.msalInProgress$
      .pipe(
        filter((status: string) => status === 'None'),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        this.isReady = true;
      });
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }

  // Mock implementation of MsalBroadcastService.inProgress$
  private readonly msalInProgress$ = new Subject<string>();

  // Methods to trigger mock MsalBroadcastService.inProgress$ changes
  triggerMsalInProgress(): void {
    this.msalInProgress$.next('In Progress');
  }

  completeMsalInProgress(): void {
    this.msalInProgress$.next('None');
  }
}
