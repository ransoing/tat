import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  public videos = [
    {
      title: 'resources.videos.video1.title',
      desc: 'resources.videos.video1.description',
      type: 'vimeo',
      id: '21392891'
    }, {
      title: 'resources.videos.video2.title',
      desc: 'resources.videos.video2.description',
      type: 'youtube',
      id: 'Oufu2oahutA'
    }, {
      title: 'resources.videos.video3.title',
      desc: 'resources.videos.video3.description',
      type: 'vimeo',
      id: '210270400'
    }, {
      title: 'resources.videos.video4.title',
      desc: 'resources.videos.video4.description',
      type: 'youtube',
      id: '9LdK55ixWqE'
    }
  ];

  constructor( public domSanitizer: DomSanitizer ) { }

  ngOnInit() {
  }

}
