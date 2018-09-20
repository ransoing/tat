import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  ngOnInit() {
    // when the tab icons have been fully initialized, use brute force to alter some styles in the shadow DOM
    let hackInterval = setInterval( () => {
      try {
        let styleEl = document.querySelector('ion-tabs').shadowRoot.querySelector('ion-tabbar').shadowRoot.querySelector('style');
        // get rid of some goofy styling for active tab label text and for active icon
        styleEl.innerHTML = styleEl.innerHTML.replace( '--label-transform:scale3d(1.16667, 1.16667, 1);', '' ).replace( /--icon-transform-selected:translate3d\(.*?\)/g, '--icon-transform-selected:none' );
        clearInterval( hackInterval );
      } catch ( e ) {
        // do nothing. just let the interval run again
      }
    }, 16 );

    setTimeout( () => clearInterval(hackInterval), 5000 );
  }
}
