import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() disabled: boolean = false;
  @Output() click: EventEmitter<MouseEvent> = new EventEmitter();
  
  bgCss: string;

  constructor() { }

  ngOnInit() {
    this.bgCss = 'url(../../../assets/image-buttons/' + (this.image || 'default.jpg') + ')';
  }

  // intercept the click event; don't allow (click) handlers on host if the button is disabled
  onButtonClick( event: MouseEvent ) {
    if ( this.disabled ) {
      event.stopPropagation();
    }
  }

}
