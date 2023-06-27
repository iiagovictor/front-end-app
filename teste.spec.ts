import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MsalBroadcastService, InteractionStatus } from '@azure/msal-angular';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let msalBroadcastService: MsalBroadcastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsalBroadcastService],
      declarations: [AppComponent],
    }).compileComponents();

    msalBroadcastService = TestBed.inject(MsalBroadcastService);
    component = TestBed.createComponent(AppComponent).componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isFrame to false if not in an iframe', () => {
    component.ngOnInit();
    expect(component.isFrame).toBe(false);
  });

  it('should set isFrame to true if in an iframe', () => {
    // Mock window object to simulate being in an iframe
    Object.defineProperty(window, 'parent', { value: {} });
    Object.defineProperty(window, 'opener', { value: {} });

    component.ngOnInit();
    expect(component.isFrame).toBe(true);
  });

  it('should set isReady to true when msalBroadcastService emits None status', () => {
    const destroying$ = new Subject<void>();
    component['_destroying$'] = destroying$;

    component.ngOnInit();
    msalBroadcastService.inProgress$.next(InteractionStatus.None);

    expect(component.isReady).toBe(true);

    // Cleanup the subscription
    destroying$.next();
    destroying$.complete();
  });
});
