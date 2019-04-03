import { Component, Input } from '@angular/core';

// 'right' is the default direction of the chevron, so use CSS to rotate it if it should be left-pointing.
@Component({
    selector: 'chevron-svg',
    template: `
    <div class="chevron-{{direction}}">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 14 24" enable-background="new 0 0 14 24" xml:space="preserve">
            <polygon class="chevron-polygon" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" points="2,0 0,2 10,12 0,22 2,24 14,12 "></polygon>
        </svg>
    </div>
    `,
    styles: [`
        div { display: flex }
        .chevron-left { transform: rotate(180deg) }
        svg {
            width: 45px;
            height: 15px;
        }
    `]
})
export class ChevronSVG {
    @Input() direction: 'right' | 'left';
    
    constructor() {}
}
        