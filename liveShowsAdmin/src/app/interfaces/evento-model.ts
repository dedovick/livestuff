import { Time } from '@angular/common';
import { CanalModel } from './canal-model';

export interface EventoModel {
  canal: CanalModel,
  data: string,
  type: string,
  time: Time,
  title: string,
  status: string,
  videoId: string,
  submitted: boolean
}
