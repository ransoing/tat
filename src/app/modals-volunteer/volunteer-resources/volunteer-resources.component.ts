import { Component } from '@angular/core';
import { MiscService, UserDataService, DynamicURLsService } from '../../services';
import { VolunteerType } from '../../models/user-data';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-volunteer-resources',
  templateUrl: './volunteer-resources.component.html',
  styleUrls: ['./volunteer-resources.component.scss']
})
export class VolunteerResourcesComponent {

  public modal: HTMLIonModalElement;
  public VolunteerType = VolunteerType;
  public videoUrl: string;

  constructor(
    public miscService: MiscService,
    public userData: UserDataService,
    public dynamicUrls: DynamicURLsService,
    public domSanitizer: DomSanitizer
  ) {
    this.dynamicUrls.getURLs().then( urls => {
      this.videoUrl = urls.videos.resources['tat-training'];
    });
  }

}
