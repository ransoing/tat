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
  @Input() hasLargeHint = false;

  @Input() tall = false;
  @Input() required = false;
  @Input() completed = true;
  @Input() disabled = false;
  @Output() click: EventEmitter<MouseEvent> = new EventEmitter();

  bgCss: string;

  constructor() { }

  ngOnInit() {
    if ( this.image ) {
      this.bgCss = 'url(assets/image-buttons/' + this.image + ')';
    }
  }

  // intercept the click event; don't allow (click) handlers on host if the button is disabled
  onButtonClick( event: MouseEvent ) {
    if ( this.disabled ) {
      event.stopPropagation();
    }
  }

}
