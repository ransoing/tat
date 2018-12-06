import { Component, OnInit } from '@angular/core';
import { MiscService, ModalService, UserDataService } from '../../services';
import { HoursLogFormComponent } from '../hours-log-form/hours-log-form.component';

@Component({
  templateUrl: './hours-log.component.html',
  styleUrls: ['./hours-log.component.scss']
})
export class HoursLogComponent implements OnInit {

  private modal: HTMLIonModalElement;
  private HoursLogFormComponent = HoursLogFormComponent;
  
  constructor(
    private miscService: MiscService,
    private modalService: ModalService,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
  }

}
