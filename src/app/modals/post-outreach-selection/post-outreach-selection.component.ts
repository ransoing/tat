import { Component, AfterViewInit } from '@angular/core';
import { UserDataService, IUnfinishedOutreachTarget, ModalService } from '../../services';
import { PostOutreachFormComponent } from '../post-outreach-form/post-outreach-form.component';

@Component({
  templateUrl: './post-outreach-selection.component.html',
  styleUrls: ['./post-outreach-selection.component.scss']
})
export class PostOutreachSelectionComponent implements AfterViewInit {
  public modal: HTMLIonModalElement;
  
  constructor(
    public userDataService: UserDataService,
    public modalService: ModalService
  ) {}

  onTargetClick( outreachTarget: IUnfinishedOutreachTarget ) {
    // open the post-outreach form modal and pass in the target
    this.modalService.open( PostOutreachFormComponent, {outreachTarget: outreachTarget} );
  }

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

}
