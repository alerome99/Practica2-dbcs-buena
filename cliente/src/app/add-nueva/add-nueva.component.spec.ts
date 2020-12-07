import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNuevaComponent } from './add-nueva.component';

describe('AddNuevaComponent', () => {
  let component: AddNuevaComponent;
  let fixture: ComponentFixture<AddNuevaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNuevaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNuevaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
