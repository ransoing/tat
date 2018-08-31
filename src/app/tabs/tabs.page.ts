import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  ngOnInit() {
    setTimeout( () => {
      let tabbar = document.querySelector('ion-tabs').shadowRoot.querySelector('ion-tabbar').shadowRoot;
      let btns = tabbar.querySelectorAll('.tab-btn');
      //@ts-ignore
      btns.forEach( (btn, i) => {
        //btn.querySelector('ion-icon').shadowRoot.querySelector('.icon-inner').innerHTML = icons[i];
      });
    }, 3000 );
  }
}
