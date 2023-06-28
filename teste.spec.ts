import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
      imports: [HttpClientTestingModule],
      providers: [JobsService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    jobsService = TestBed.inject(JobsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch jobs on component initialization', async () => {
    const mockResponse = {
      jobs: [
        {
          id: 1,
          name: 'Job 1',
          details: 'Job details'
        }
      ],
      tables: [],
      edges: []
    };

    jest.spyOn(jobsService, 'getJobs').mockResolvedValue(mockResponse);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.jobs).toEqual(mockResponse.jobs);
    expect(component.graphData).toBeDefined();
    expect(component.errorMsg).toBeUndefined();
    expect(component.isLoading).toBe(true);
  });

  it('should handle error when fetching jobs', async () => {
    const errorMessage = 'Erro ao recuperar Jobs';

    jest.spyOn(jobsService, 'getJobs').mockRejectedValue(Promise.reject(errorMessage));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.jobs).toEqual([]);
    expect(component.graphData).toBeUndefined();
    expect(component.errorMsg).toEqual(`Erro ao recuperar Jobs = ${errorMessage}`);
    expect(component.isLoading).toBe(true);
  });
});
