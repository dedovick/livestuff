import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { EventoModel } from '../../interfaces/evento-model';
import { EventData } from '../../providers/event-data';

@Component({
  selector: 'page-evento',
  templateUrl: 'eventos.html',
  styleUrls: ['./evento.scss'],
})
export class EventosPage {
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
  eventos: any;
  submitted = false;

  constructor(
    public router: Router,
    public eventData: EventData
  ) {
    this.eventData.getEventos().subscribe(data  => {
      var events = data as EventoModel[];
      console.log(events);
      events.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      this.eventos = events;
    });
  }

  onCadastrar() {

    this.router.navigateByUrl('evento/cadastrar');
  }

}