import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEliminarComponent } from './agregar-eliminar.component';

describe('AgregarEliminarComponent', () => {
  let component: AgregarEliminarComponent;
  let fixture: ComponentFixture<AgregarEliminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarEliminarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
