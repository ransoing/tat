import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'image-button',
  templateUrl: './image-button.component.html',
  styleUrls: ['./image-button.component.scss']
})
export class ImageButtonComponent implements OnInit {
  // the image is assumed to be at /src/assets/image-buttons/
  @Input() image: string;
  // 'hint' is shown below the main button text
  @Input() hint: string;

  @Input() tall: boolean = false;
  @Input() required: boolean = false;
  @Input() completed: boolean = true;
  
  bgCss: string;

  constructor() { }

  ngOnInit() {
    this.bgCss = 'url(../../../assets/image-buttons/' + (this.image || 'default.jpg') + ')';
  }

}
