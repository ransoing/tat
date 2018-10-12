import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  public modal: HTMLIonModalElement;

  constructor() {}

  doIt() {
    this.modal.dismiss( 'thingy' );
  }

  ngOnInit() {
  }

}
