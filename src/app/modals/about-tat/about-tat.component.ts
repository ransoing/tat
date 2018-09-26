import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  selector: 'app-about-tat',
  templateUrl: './about-tat.component.html',
  styleUrls: ['./about-tat.component.scss']
})
export class AboutTatComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor( private miscService: MiscService ) { }

  ngOnInit() {
  }

}
