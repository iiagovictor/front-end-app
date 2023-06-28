import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobDetailsComponent } from './job-details.component';
import { JobsDetailsService } from './jobs-details.service';

describe('JobDetailsComponent', () => {
  let component: JobDetailsComponent;
  let fixture: ComponentFixture<JobDetailsComponent>;
  let jobsDetailsService: JobsDetailsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobDetailsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        JobsDetailsService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { jobName: 'job1' } }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailsComponent);
    component = fixture.componentInstance;
    jobsDetailsService = TestBed.inject(JobsDetailsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch job details on initialization', () => {
    const jobName = 'job1';
    const jobDetails = {
      job_runs: [{ id: 1 }, { id: 2 }],
      execution_plans: [{ id: 1 }, { id: 2 }]
    };

    spyOn(jobsDetailsService, 'getJobDetails').and.returnValue(Promise.resolve(jobDetails));

    component.ngOnInit();

    expect(jobsDetailsService.getJobDetails).toHaveBeenCalledWith(jobName);
    expect(component.jobName).toBe(jobName);
    expect(component.jobRuns).toEqual(jobDetails.job_runs);
    expect(component.execPlans).toEqual(jobDetails.execution_plans);
    expect(component.graphData).toBeDefined();
    expect(component.errorMsg).toBeUndefined();
    expect(component.jobRunsCount).toBe(jobDetails.job_runs.length);
  });

  it('should handle error when fetching job details', () => {
    const errorMessage = 'Failed to fetch job details';

    spyOn(jobsDetailsService, 'getJobDetails').and.returnValue(Promise.reject(new Error(errorMessage)));

    component.ngOnInit();

    expect(jobsDetailsService.getJobDetails).toHaveBeenCalled();
    expect(component.errorMsg).toBe(`Erro ao recuperar JobRuns - ${errorMessage}`);
  });
});
