import { Component } from '@angular/core';
import { MiscService, ModalService, UserDataService } from '../../services';
import { HoursLogFormComponent } from '../hours-log-form/hours-log-form.component';

@Component({
  templateUrl: './hours-log.component.html',
  styleUrls: ['./hours-log.component.scss']
})
export class HoursLogComponent {

  public modal: HTMLIonModalElement;
  public HoursLogFormComponent = HoursLogFormComponent;
  
  constructor(
    public miscService: MiscService,
    public modalService: ModalService,
    public userDataService: UserDataService
  ) {}

}
