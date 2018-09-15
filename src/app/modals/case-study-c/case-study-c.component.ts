import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  selector: 'app-case-study-c',
  templateUrl: './case-study-c.component.html',
  styleUrls: ['./case-study-c.component.scss']
})
export class CaseStudyCComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor( public miscService: MiscService ) { }

  ngOnInit() {
  }

}
