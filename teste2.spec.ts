import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JobsComponent } from './jobs.component';
import { JobsService } from './jobs.service';
import { of } from 'rxjs';

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

  it('should fetch jobs on component initialization', () => {
    const mockResponse = {
      jobs: [
        {
          "1": "",
          "4": "",
          "name": "",
          "details": ""
        }
      ],
      tables: [
        {
          "1": "",
          "4": "",
          "name": "",
          "location_path": "",
          "layer": "",
          "trans_operations": "",
          "database": "",
          "schema": ""
        }
      ],
      edges: [
        {
          "from": "",
          "to": ""
        }
      ]
    };

    jest.spyOn(jobsService, 'getJobs').mockReturnValue(of(mockResponse).toPromise());

    fixture.detectChanges();

    expect(component.jobs).toEqual(mockResponse.jobs);
    expect(component.graphData).toBeDefined();
    expect(component.errorMsg).toBeUndefined();
    expect(component.isLoading).toBe(true);
  });

  it('should handle error when fetching jobs', () => {
    const errorMessage = 'Erro ao recuperar Jobs';

    jest.spyOn(jobsService, 'getJobs').mockRejectedValue(new Error(errorMessage));

    fixture.detectChanges();

    expect(component.jobs).toEqual([]);
    expect(component.graphData).toBeUndefined();
    expect(component.errorMsg).toEqual(`Erro ao recuperar Jobs = ${errorMessage}`);
    expect(component.isLoading).toBe(true);
  });
});
