import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { JobsComponent } from './jobs.component';
import { JobsService } from './jobs.service';

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
    spyOn(jobsService, 'getJobs').and.returnValue(
      of({
        jobs: [
          {
            '1': '',
            '4': '',
            name: '',
            details: ''
          }
        ],
        tables: [
          {
            '1': '',
            '4': '',
            name: '',
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
      })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch jobs on initialization', () => {
    expect(jobsService.getJobs).toHaveBeenCalled();
    expect(component.jobs.length).toBe(1);
    expect(component.graphData).toBeTruthy();
  });

  it('should set error message on API error', () => {
    const errorMessage = 'Error message';
    spyOn(jobsService, 'getJobs').and.throwError(errorMessage);
    component.ngOnInit();
    expect(component.errorMsg).toBe(`Erro ao recuperar Jobs = ${errorMessage}`);
  });

  it('should set error message if jobs fetching fails', () => {
    spyOn(jobsService, 'getJobs').and.returnValue(
      of({
        error: 'Error message'
      })
    );
    component.ngOnInit();
    expect(component.errorMsg).toBe('Erro ao recuperar Jobs.');
  });

  it('should display error message when errorMsg is set', () => {
    component.errorMsg = 'Error message';
    fixture.detectChanges();
    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Error message');
  });

  it('should display loading indicator while jobs are being fetched', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const loadingIndicator = fixture.nativeElement.querySelector('.container_loading');
    expect(loadingIndicator).toBeTruthy();
  });

  it('should display job list when jobs are available', () => {
    component.jobs = [
      {
        name: 'Job 1'
      },
      {
        name: 'Job 2'
      }
    ];
    fixture.detectChanges();
    const jobLinks = fixture.nativeElement.querySelectorAll('a');
    expect(jobLinks.length).toBe(2);
    expect(jobLinks[0].textContent).toContain('Job 1');
    expect(jobLinks[1].textContent).toContain('Job 2');
  });

  it('should display network component when graphData is available', () => {
    component.graphData = {
      nodes: [],
      edges: []
    };
    fixture.detectChanges();
    const networkComponent = fixture.nativeElement.querySelector('app-network');
    expect(networkComponent).toBeTruthy();
    expect(networkComponent.getAttribute('graphData')).toBe(JSON.stringify(component.graphData));
  });
});
