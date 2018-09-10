import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AboutTatComponent } from '../../modals/';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {

  constructor( public modalController: ModalController, public navCtrl: NavController ) { }

  ngOnInit() {
  }

  async openModal( component: any, props: any = {} ) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: props
    });
    return await modal.present();
  }

  openAboutTatModal() { this.openModal(AboutTatComponent) }

}
