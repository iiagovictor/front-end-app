import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DagsService } from './dags.service';
import { JobDetailsComponent } from './dags.component';

describe('JobDetailsComponent', () => {
  let component: JobDetailsComponent;
  let fixture: ComponentFixture<JobDetailsComponent>;
  let dagsService: DagsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                execPlanId: '123'
              }
            }
          }
        },
        {
          provide: DagsService,
          useValue: {
            getDags: jest.fn(() =>
              Promise.resolve({
                nodes: [
                  {
                    '1': '',
                    '4': '',
                    name: '',
                    schema: '',
                    param: '',
                    type: '',
                    level: ''
                  }
                ],
                edges: [
                  {
                    from: '',
                    to: ''
                  }
                ]
              })
            )
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailsComponent);
    component = fixture.componentInstance;
    dagsService = TestBed.inject(DagsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch dag and set graphData', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(dagsService.getDags).toHaveBeenCalledWith('123');
    expect(component.isLoading).toBe(true);
    expect(component.graphData).toEqual({
      nodes: [
        {
          '1': '',
          '4': '',
          name: '',
          schema: '',
          param: '',
          type: '',
          level: ''
        }
      ],
      edges: [
        {
          from: '',
          to: ''
        }
      ]
    });
    expect(component.errorMsg).toBeUndefined();
  });

  it('should handle error when fetching dag', async () => {
    const error = new Error('Error message');
    (dagsService.getDags as jest.Mock).mockRejectedValueOnce(error);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isLoading).toBe(true);
    expect(component.graphData).toBeUndefined();
    expect(component.errorMsg).toBe('Erro ao recuperar JobRuns - Error message');
  });
});
