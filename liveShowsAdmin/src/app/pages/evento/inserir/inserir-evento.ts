import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { IonicSelectableComponent } from 'ionic-selectable';
import { EventoModel } from '../../../interfaces/evento-model';
import { CanalModel } from '../../../interfaces/canal-model';
import { EventData } from '../../../providers/event-data';
import { CanalData } from '../../../providers/canal-data';

@Component({
  selector: 'page-evento',
  templateUrl: 'inserir-evento.html',
  styleUrls: ['../evento.scss'],
})
export class CadastrarEventoPage {
  evento: EventoModel = {
    canal: undefined,
    data: undefined,
    type: '',
    time: undefined,
    title: '',
    status: '',
    videoId: '',
    submitted: false
  };
  canais: any;
  canal: CanalModel;
  submitted = false;

  constructor(
    public router: Router,
    public eventData: EventData,
    public canalData: CanalData
  ) {
    this.canais = [];
    this.canalData.getCanais().subscribe(data => {
      this.canais = data;
    });;
  }

  onSalvar(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.eventData.addEvento(this.evento);
      this.router.navigateByUrl('/app/tabs/schedule');
    }
  }

  canalChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    
  }

}