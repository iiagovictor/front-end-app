import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DagsComponent } from './dags.component';
import { DagsService } from './dags.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DagsComponent', () => {
  let component: DagsComponent;
  let fixture: ComponentFixture<DagsComponent>;
  let dagsService: DagsService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DagsComponent],
      providers: [
        DagsService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                execPlanId: '12345'
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DagsComponent);
    component = fixture.componentInstance;
    dagsService = TestBed.inject(DagsService);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch DAG and set graph data on initialization', async () => {
    const mockDagResponse = {
      nodes: [
        {
          "1": "",
          "4": "",
          "name": "",
          "schema": "",
          "param": "",
          "type": "",
          "level": ""
        }
      ],
      edges: [
        {
          "from": "",
          "to": ""
        }
      ]
    };

    jest.spyOn(dagsService, 'getDags').mockReturnValue(Promise.resolve(mockDagResponse));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(dagsService.getDags).toHaveBeenCalledWith('12345');
    expect(component.graphData).toEqual(mockDagResponse);
    expect(component.isLoading).toBe(true);
    expect(component.errorMsg).toBeUndefined();
  });

  it('should handle error when fetching DAG', async () => {
    const mockError = new Error('API Error');

    jest.spyOn(dagsService, 'getDags').mockReturnValue(Promise.reject(mockError));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(dagsService.getDags).toHaveBeenCalledWith('12345');
    expect(component.graphData).toBeUndefined();
    expect(component.isLoading).toBe(true);
    expect(component.errorMsg).toBe('Erro ao recuperar JobRuns - API Error');
  });

  it('should handle missing execPlan parameter', () => {
    jest.spyOnProperty(activatedRoute.snapshot, 'params', 'get').mockReturnValue({ execPlanId: undefined });

    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('O parâmetro execPlan é nulo.');
  });
});
