import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingMessagesComponent } from './loading-messages.component';

describe('LoadingMessagesComponent', () => {
  let component: LoadingMessagesComponent;
  let fixture: ComponentFixture<LoadingMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
