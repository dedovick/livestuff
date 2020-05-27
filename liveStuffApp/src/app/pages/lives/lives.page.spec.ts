import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LivesPage } from './lives.page';

describe('LivesPage', () => {
  let component: LivesPage;
  let fixture: ComponentFixture<LivesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
