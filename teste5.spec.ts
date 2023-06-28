import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { of, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let msalBroadcastService: MsalBroadcastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [MsalBroadcastService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    msalBroadcastService = TestBed.inject(MsalBroadcastService);
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
    const inProgressSubject = new Subject<InteractionStatus>();
    jest
      .spyOn(msalBroadcastService, 'inProgress$', 'get')
      .mockReturnValue(inProgressSubject.asObservable());

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
