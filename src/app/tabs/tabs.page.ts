import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  numTabs = 5;

  ngOnInit() {
    // when the tab icons have been fully initialized, use brute force to alter some styles in the shadow DOM
    let hackInterval = setInterval( () => {
      try {
        const tabbar = document.querySelector('ion-tabs').shadowRoot.querySelector('ion-tabbar');
        let styleEl = tabbar.shadowRoot.querySelector('style');
        // get rid of some goofy styling for active tab label text and for active icon
        styleEl.innerHTML = styleEl.innerHTML.replace( '--label-transform:scale3d(1.16667, 1.16667, 1);', '' ).replace( /--icon-transform-selected:translate3d\(.*?\)/g, '--icon-transform-selected:none' );
        // set a new max width for tab buttons to prevent them from overflowing over the sides of the screen
        styleEl.innerHTML += `.tab-btn { max-width: calc( 100vw / ${this.numTabs} ) }`;
        // prevent the previously active tab from having the "active" style when the user uses the android hardware back button
        styleEl.innerHTML += `.tab-btn:not(.tab-btn-selected):hover { color: inherit !important }`;
        // Set a media query to hide text for tab buttons when the screen is too narrow.
        // Without text, the icons need to be nudged down (different amounts for ios vs md)
        const tabBtnPaddingTop = document.documentElement.getAttribute('mode') === 'md' ? 16 : 6;
        styleEl.innerHTML += `
        @media only screen and (max-width: 430px) {
          .tab-btn > .tab-btn-text { display: none }
          .tab-btn { padding-top: ${tabBtnPaddingTop}px }
        }`;

        clearInterval( hackInterval );
      } catch ( e ) {
        // do nothing. just let the interval run again
      }
    }, 16 );

    setTimeout( () => clearInterval(hackInterval), 5000 );
  }
}
