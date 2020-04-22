import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CanalData } from '../../providers/canal-data';
import { CanalModel } from '../../interfaces/canal-model';



@Component({
  selector: 'page-canal',
  templateUrl: 'canal.html',
  styleUrls: ['./canal.scss'],
})
export class CanalPage {
  canal: CanalModel = { 
    id: '',
    nome: '',
    idYoutube: '',
    idFacebook: '',
    idVimeo: '',
    idTwitch: '',
    status: 0,
    categoria: 0
  };
  canais: any;
  submitted = false;

  constructor(
    public router: Router,
    public canalData: CanalData
  ) {
    
  }

  ionViewWillEnter(){
    console.log("Passamos aqui");
    this.canalData.getCanais().subscribe(data  => {
      var events = data as CanalModel[];
      this.canais = events;
    });
  }

  onCadastrar() {

    this.router.navigateByUrl('canal/cadastrar');
  }

}
