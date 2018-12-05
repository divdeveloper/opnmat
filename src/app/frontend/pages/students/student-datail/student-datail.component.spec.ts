import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDatailComponent } from './student-datail.component';

describe('StudentDatailComponent', () => {
  let component: StudentDatailComponent;
  let fixture: ComponentFixture<StudentDatailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDatailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDatailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
