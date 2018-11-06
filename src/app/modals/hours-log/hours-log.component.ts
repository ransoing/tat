import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  templateUrl: './hours-log.component.html',
  styleUrls: ['./hours-log.component.scss']
})
export class HoursLogComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor( private miscService: MiscService ) { }

  ngOnInit() {
  }

}
