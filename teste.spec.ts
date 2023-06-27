import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject, Observable } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let msalBroadcastService: MsalBroadcastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MsalBroadcastService,
        {
          provide: 'MSAL_INSTANCE', // Assuming 'MSAL_INSTANCE' is the correct token used by MsalBroadcastService
          useValue: {} // Replace with the actual instance of MSAL_INSTANCE if needed
        }
      ],
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
    component['destroying$'] = destroying$; // Accessing the getter instead of the private property

    component.ngOnInit();

    const inProgress$ = new Observable<InteractionStatus>((observer) => {
      observer.next(InteractionStatus.None);
      observer.complete();
    });

    jest
      .spyOn(msalBroadcastService, 'inProgress$', 'get')
      .mockReturnValue(inProgress$);

    expect(component.isReady).toBe(true);

    // Cleanup the subscription
    destroying$.next();
    destroying$.complete();
  });
});
