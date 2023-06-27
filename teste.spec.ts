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

    // Simulating the behavior of MsalBroadcastService.inProgress$
    this.fakeMsalBroadcastServiceInProgress$
      .pipe(
        filter((status: any) => status === 'None'),
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

  // Simulated implementation of MsalBroadcastService.inProgress$
  private readonly fakeMsalBroadcastServiceInProgress$ = new Subject<string>();

  // Methods to trigger fake MsalBroadcastService.inProgress$ changes
  startFakeMsalInProgress(): void {
    this.fakeMsalBroadcastServiceInProgress$.next('In Progress');
  }

  completeFakeMsalInProgress(): void {
    this.fakeMsalBroadcastServiceInProgress$.next('None');
  }
}
