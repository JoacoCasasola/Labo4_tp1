import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanderasComponent } from './banderas.component';

describe('BanderasComponent', () => {
  let component: BanderasComponent;
  let fixture: ComponentFixture<BanderasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanderasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanderasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
