import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureClickedBoxComponent } from './picture-clicked-box.component';

describe('PictureClickedBoxComponent', () => {
  let component: PictureClickedBoxComponent;
  let fixture: ComponentFixture<PictureClickedBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureClickedBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureClickedBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
