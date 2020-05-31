import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingControlleServiceService {

  isLoading = false;

  constructor(private loadingController: LoadingController) { }

  async present() {
    if (!this.isLoading) {
      this.isLoading = true;
      setTimeout( () => {
        if (this.isLoading) {
          this.dismiss();
          this.isLoading = false;
        }
      }, 8000);
      return await this.loadingController.create({
        // duration: 5000,
      }).then(a => {
        a.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
    }
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }
  }
}
