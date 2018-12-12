import { Component, OnInit } from '@angular/core';
import { MiscService, SettingsService } from '../../services';

@Component({
  templateUrl: './volunteer-settings.component.html'
})
export class VolunteerSettingsComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor( private miscService: MiscService, private settings: SettingsService ) { }

  ngOnInit() {
  }

}
