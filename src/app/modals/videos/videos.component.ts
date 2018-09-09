import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor() { }

  ngOnInit() {
  }

}
