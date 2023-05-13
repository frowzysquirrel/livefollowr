import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveLoaderComponent } from './live-loader.component';

describe('LiveLoaderComponent', () => {
  let component: LiveLoaderComponent;
  let fixture: ComponentFixture<LiveLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
