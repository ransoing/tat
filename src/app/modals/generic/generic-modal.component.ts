import { Component, Input, OnInit } from '@angular/core';
import { staticImplements } from '../../models/static-implements';
import { MiscService } from '../../services';
import { IViewLoggedModal } from '../../services/analytics.service';

@staticImplements<IViewLoggedModal>()
@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent implements OnInit {

  static screenName: string;

  @Input() title: string;
  @Input() bodyHtml: string;
  @Input() source?: {
    label: string;
    link: string;
  }

  public modal: HTMLIonModalElement;
  
  constructor( public miscService: MiscService ) { }

  ngOnInit() {
  }

}
