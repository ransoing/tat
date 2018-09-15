import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services/misc/misc.service';

@Component({
  selector: 'app-case-study-b',
  templateUrl: './case-study-b.component.html',
  styleUrls: ['./case-study-b.component.scss']
})
export class CaseStudyBComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor( public miscService: MiscService ) { }

  ngOnInit() {
  }

}
