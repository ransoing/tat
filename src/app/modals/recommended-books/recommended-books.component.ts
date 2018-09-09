import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recommended-books',
  templateUrl: './recommended-books.component.html',
  styleUrls: ['./recommended-books.component.scss']
})
export class RecommendedBooksComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  constructor() { }

  ngOnInit() {
  }

}
