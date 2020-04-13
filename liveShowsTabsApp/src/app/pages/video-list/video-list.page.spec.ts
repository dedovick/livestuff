import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideoListPage } from './video-list.page';

describe('VideoListPage', () => {
  let component: VideoListPage;
  let fixture: ComponentFixture<VideoListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
