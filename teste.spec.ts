import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobsComponent } from './jobs.component';
import { JobsService } from './jobs.service';
import { of, throwError } from 'rxjs';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;
  let jobsService: JobsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsComponent],
      providers: [JobsService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    jobsService = TestBed.inject(JobsService);
    spyOn(jobsService, 'getJobs').and.returnValue(of({ jobs: [] }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch jobs and update properties', async () => {
    const jobs = [{ id: 1, title: 'Job 1' }, { id: 2, title: 'Job 2' }];
    spyOn(jobsService, 'getJobs').and.returnValue(of({ jobs }));
    spyOn(component, 'createGraphData');

    await component.fetchJob();

    expect(jobsService.getJobs).toHaveBeenCalled();
    expect(component.jobs).toEqual(jobs);
    expect(component.createGraphData).toHaveBeenCalledWith({ jobs });
    expect(component.errorMsg).toBeUndefined();
    expect(component.isLoading).toBe(true);
  });

  it('should handle error during job fetch', async () => {
    const errorMessage = 'Error fetching jobs';
    spyOn(jobsService, 'getJobs').and.returnValue(throwError(new Error(errorMessage)));

    await component.fetchJob();

    expect(jobsService.getJobs).toHaveBeenCalled();
    expect(component.jobs).toEqual([]);
    expect(component.createGraphData).not.toHaveBeenCalled();
    expect(component.errorMsg).toBe(`Erro ao recuperar Jobs = ${errorMessage}`);
    expect(component.isLoading).toBe(true);
  });
});
