import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  selector: 'app-human-trafficking-laws',
  templateUrl: './human-trafficking-laws.component.html',
  styleUrls: ['./human-trafficking-laws.component.scss']
})
export class HumanTraffickingLawsComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor( private miscService: MiscService ) { }

  ngOnInit() {
  }

}
