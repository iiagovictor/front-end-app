import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MsalBroadcastService, InteractionStatus } from '@azure/msal-angular';
import { Subject } from 'rxjs';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: MsalBroadcastService, useValue: { inProgress$: new Subject<InteractionStatus>() } }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set isFrame to false if not inside an iframe', () => {
    expect(component.isFrame).toBe(false);
  });

  it('should set isReady to true when msalBroadcastService emits InteractionStatus.None', () => {
    const msalBroadcastService = TestBed.inject(MsalBroadcastService);
    const inProgressSubject = msalBroadcastService.inProgress$ as Subject<InteractionStatus>;

    component.ngOnInit();
    expect(component.isReady).toBe(false);

    inProgressSubject.next(InteractionStatus.None);
    expect(component.isReady).toBe(true);
  });

  it('should unsubscribe from inProgress$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['_destroying$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
