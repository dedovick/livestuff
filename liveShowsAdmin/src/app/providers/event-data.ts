import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EventoModel } from '../interfaces/evento-model';
import { ServerApp } from './server-app.service';


@Injectable({
  providedIn: 'root'
})
export class EventData {
  eventos: any;
  HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(
    public serverApp: ServerApp
  ) { }

  addEvento(evento: EventoModel): void {
    this.eventos.push(evento);
  }

  getEventos() {
    return this.serverApp.getEvents();
  }

}
