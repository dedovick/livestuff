import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { CanalData } from '../../../providers/canal-data';
import { CanalModel } from '../../../interfaces/canal-model';



@Component({
  selector: 'page-canal',
  templateUrl: 'inserir-canal.html',
  styleUrls: ['../canal.scss'],
})
export class CadastrarCanalPage {
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
  submitted = false;

  constructor(
    public router: Router,
    public canalData: CanalData
  ) {}

  onSalvar(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.canalData.addCanal(this.canal).subscribe(data => {
      }, error => {
        console.error("Erro", error);
      });
      this.router.navigateByUrl('/canal');
    }
  }
}
