import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { JobsComponent } from './jobs.component';
import { JobsService } from './jobs.service';
import { createGraphData } from '../shared/utils/jobs';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsComponent],
      imports: [HttpClientModule],
      providers: [JobsService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch jobs and populate the component properties', async () => {
    const jobsService = TestBed.inject(JobsService);
    const jobsResponse = {
      jobs: [
        {
          '1': '',
          '4': '',
          name: 'Job 1',
          details: 'Job details'
        }
      ],
      tables: [
        {
          '1': '',
          '4': '',
          name: 'Table 1',
          location_path: '',
          layer: '',
          trans_operations: '',
          database: '',
          schema: ''
        }
      ],
      edges: [
        {
          from: '',
          to: ''
        }
      ]
    };
    spyOn(jobsService, 'getJobs').and.returnValue(Promise.resolve(jobsResponse));
    spyOn(component, 'fetchJob').and.callThrough();

    expect(component.isLoading).toBe(false);
    expect(component.jobs.length).toBe(0);
    expect(component.graphData).toBeUndefined();
    expect(component.errorMsg).toBeUndefined();

    await component.ngOnInit();
    fixture.detectChanges();

    expect(component.fetchJob).toHaveBeenCalled();
    expect(component.isLoading).toBe(true);
    expect(component.jobs.length).toBe(1);
    expect(component.jobs[0].name).toBe('Job 1');
    expect(component.graphData).toEqual(createGraphData(jobsResponse));
    expect(component.errorMsg).toBeUndefined();
  });

  it('should handle error while fetching jobs', async () => {
    const jobsService = TestBed.inject(JobsService);
    const errorMessage = 'Error fetching jobs';
    spyOn(jobsService, 'getJobs').and.returnValue(Promise.reject(new Error(errorMessage)));
    spyOn(component, 'fetchJob').and.callThrough();

    expect(component.isLoading).toBe(false);
    expect(component.jobs.length).toBe(0);
    expect(component.graphData).toBeUndefined();
    expect(component.errorMsg).toBeUndefined();

    await component.ngOnInit();
    fixture.detectChanges();

    expect(component.fetchJob).toHaveBeenCalled();
    expect(component.isLoading).toBe(true);
    expect(component.jobs.length).toBe(0);
    expect(component.graphData).toBeUndefined();
    expect(component.errorMsg).toBe(`Erro ao recuperar Jobs = ${errorMessage}`);
  });
});
