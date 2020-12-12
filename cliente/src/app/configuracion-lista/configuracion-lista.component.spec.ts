import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionListaComponent } from './configuracion-lista.component';

describe('ConfiguracionListaComponent', () => {
  let component: ConfiguracionListaComponent;
  let fixture: ComponentFixture<ConfiguracionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
