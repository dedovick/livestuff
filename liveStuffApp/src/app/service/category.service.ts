import { Injectable} from '@angular/core';
import { ServerClientService } from './server-client.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  subCategorys = [];

  constructor(private serverClientService: ServerClientService) {
    const resCat = this.serverClientService.getCategories();
    resCat.subscribe(data => {
      const dataAux = data as Array<any>;
      dataAux.forEach(element => {
        this.subCategorys.push({
          key: element.nome,
          value: 0
        });
      });
    });
  }

  getSubCategorys() {
    return this.subCategorys;
  }

  addSubCategory(category) {
    let found = false;
    this.subCategorys.forEach(element => {
      if (element.key === category) {
        found = true;
        element.value++;
      }
    });
  }

  clearData() {
    this.subCategorys.forEach(element => {
      element.value = 0;
    });
  }

}
