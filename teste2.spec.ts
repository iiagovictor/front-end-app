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

  const activatedRouteMock = {
    snapshot: {
      params: {
        jobName: 'test-job'
      }
    }
  };

  const jobsDetailsServiceMock = {
    getJobDetails: jest.fn().mockReturnValue(Promise.resolve({
      job_runs: [
        { id: '1', details: '' },
        { id: '2', details: '' },
      ],
      execution_plans: [
        { id: 'plan-1', read_metrics: '', write_metrics: '', duration: '', spark_version: '', spline_version: '' },
        { id: 'plan-2', read_metrics: '', write_metrics: '', duration: '', spark_version: '', spline_version: '' },
      ]
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobDetailsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: JobsDetailsService, useValue: jobsDetailsServiceMock }
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

  it('should fetch job details on initialization', async () => {
    const jobName = activatedRouteMock.snapshot.params.jobName;
    await component.ngOnInit();

    expect(component.jobName).toBe(jobName);
    expect(jobsDetailsService.getJobDetails).toHaveBeenCalledWith(jobName);
    expect(component.jobRuns).toEqual([{ id: '1', details: '' }, { id: '2', details: '' }]);
    expect(component.execPlans).toEqual([
      { id: 'plan-1', read_metrics: '', write_metrics: '', duration: '', spark_version: '', spline_version: '' },
      { id: 'plan-2', read_metrics: '', write_metrics: '', duration: '', spark_version: '', spline_version: '' }
    ]);
    expect(component.jobRunsCount).toBe(2);
    expect(component.errorMsg).toBeUndefined();
  });

  it('should handle error when fetching job details', async () => {
    const errorMessage = 'Error fetching job details';
    jobsDetailsServiceMock.getJobDetails.mockReturnValue(Promise.reject(new Error(errorMessage)));
    await component.ngOnInit();

    expect(component.errorMsg).toBe(`Erro ao recuperar JobRuns - ${errorMessage}`);
  });
});
