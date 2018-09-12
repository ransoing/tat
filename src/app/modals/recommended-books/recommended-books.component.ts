import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recommended-books',
  templateUrl: './recommended-books.component.html',
  styleUrls: ['./recommended-books.component.scss']
})
export class RecommendedBooksComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  public books = [
    {
      image: 'girls-like-us.jpg',
      title: 'Girls Like Us',
      byline: 'by Rachel Lloyd'
    }, {
      image: 'paid-for.jpg',
      title: 'Paid For',
      byline: 'by Rachel Moran'
    }, {
      image: 'nobodys-girl.jpg',
      title: 'Nobody\'s Girl',
      byline: 'by Barbara Amaya'
    }, {
      image: 'in-our-backyard.jpg',
      title: 'In Our Backyard',
      byline: 'by Nita Belles'
    }, {
      image: 'walking-prey.jpg',
      title: 'Walking Prey',
      byline: 'by Holly Smith'
    }, {
      image: 'and-life-continues.jpg',
      title: 'And Life Continues',
      byline: 'by Wendy Barnes'
    }, {
      image: 'the-same-kind-of-human.jpg',
      title: 'The Same Kind of Human',
      byline: 'by Christine McDonald'
    }
  ];

  public films = [
    {
      image: 'i-am-jane-doe.jpg',
      title: 'I am Jane Doe',
      byline: 'Netflix'
    }, {
      image: 'rape-for-profit.jpg',
      title: 'Rape for Profit',
      byline: 'iTunes'
    }, {
      image: 'be-the-one.jpg',
      title: 'Be the One',
      byline: 'Vimeo'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
