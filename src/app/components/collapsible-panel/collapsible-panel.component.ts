import { AfterViewInit, Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'collapsible-panel',
  templateUrl: './collapsible-panel.component.html',
  styleUrls: ['./collapsible-panel.component.scss']
})
export class CollapsiblePanelComponent implements OnChanges, AfterViewInit {
  @Input() title: string;
  @Input() expanded: boolean = false;

  @Output() expandedChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild( 'panelContent', {static: false} ) panelContent: ElementRef;
  @ViewChild( 'measuringWrapper', {static: false} ) measuringWrapper: ElementRef;

  constructor() { }

  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.expanded != null ) {
      this.onExpandChanged();
    }
  }

  ngAfterViewInit() {
    this.onExpandChanged();
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.expandedChange.emit( this.expanded );
    this.onExpandChanged();
  }

  onExpandChanged() {
    const margin = 24;
    this.panelContent.nativeElement.style.height = this.expanded ? (margin + this.measuringWrapper.nativeElement.clientHeight) + 'px' : 0;
  }
}
