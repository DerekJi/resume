/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LcdNumberComponent } from './lcd-number.component';

describe('LcdNumberComponent', () => {
  let component: LcdNumberComponent;
  let fixture: ComponentFixture<LcdNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcdNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcdNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
