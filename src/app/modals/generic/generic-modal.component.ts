import { Component, Input, OnInit } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent implements OnInit {

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
