import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  selector: 'app-volunteer-resources',
  templateUrl: './volunteer-resources.component.html',
  styleUrls: ['./volunteer-resources.component.scss']
})
export class VolunteerResourcesComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor( private miscService: MiscService ) { }

  ngOnInit() {
  }

}
