import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgLightningComponent } from './ng-lightning.component';

describe('NgLightningComponent', () => {
  let component: NgLightningComponent;
  let fixture: ComponentFixture<NgLightningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgLightningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgLightningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
