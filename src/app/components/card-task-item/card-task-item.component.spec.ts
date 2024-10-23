import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTaskItemComponent } from './card-task-item.component';

describe('CardTaskItemComponent', () => {
  let component: CardTaskItemComponent;
  let fixture: ComponentFixture<CardTaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTaskItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTaskItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
