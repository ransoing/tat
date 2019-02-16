import { Component, AfterViewInit } from '@angular/core';
import { MiscService, ModalService, UserDataService } from '../../services';
import { HoursLogFormComponent } from '../../modals-forms/hours-log-form/hours-log-form.component';

@Component({
  templateUrl: './hours-log.component.html',
  styleUrls: ['./hours-log.component.scss']
})
export class HoursLogComponent implements AfterViewInit {

  public modal: HTMLIonModalElement;
  public HoursLogFormComponent = HoursLogFormComponent;
  
  constructor(
    public miscService: MiscService,
    public modalService: ModalService,
    public userDataService: UserDataService
  ) {}

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

}
