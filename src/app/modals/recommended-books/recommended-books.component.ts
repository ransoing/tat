import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services';

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
      byline: 'Rachel Lloyd',
      link: 'https://www.amazon.com/Girls-Like-Us-Fighting-Activist/dp/0061582050'
    }, {
      image: 'paid-for.jpg',
      title: 'Paid For',
      byline: 'Rachel Moran',
      link: 'https://www.amazon.com/Paid-My-Journey-Through-Prostitution/dp/0393351971'
    }, {
      image: 'nobodys-girl.jpg',
      title: 'Nobody\'s Girl',
      byline: 'Barbara Amaya',
      link: 'https://animalmediagroup.com/products/nobodys-girl'
    }, {
      image: 'in-our-backyard.jpg',
      title: 'In Our Backyard',
      byline: 'Nita Belles',
      link: 'https://give.cornerstone.cc/In+Our+Backyard+Cart'
    }, {
      image: 'walking-prey.jpg',
      title: 'Walking Prey',
      byline: 'Holly Smith',
      link: 'https://www.amazon.com/Walking-Prey-Americas-Vulnerable-Slavery/dp/1137278730'
    }, {
      image: 'and-life-continues.jpg',
      title: 'And Life Continues',
      byline: 'Wendy Barnes',
      link: 'https://www.amazon.com/Life-Continues-Trafficking-Journey-Freedom/dp/1502304171'
    }, {
      image: 'the-same-kind-of-human.jpg',
      title: 'The Same Kind of Human',
      byline: 'Christine McDonald',
      link: 'http://www.christinesvision.org/books.html'
    }
  ];

  public films = [
    {
      image: 'i-am-jane-doe.jpg',
      title: 'I am Jane Doe',
      byline: 'Netflix',
      bylineAlt: 'iTunes',
      link: 'https://itunes.apple.com/us/movie/i-am-jane-doe/id1227166034'
    }, {
      image: 'rape-for-profit.jpg',
      title: 'Rape for Profit',
      byline: 'iTunes',
      link: 'https://itunes.apple.com/us/movie/rape-for-profit/id667564959'
    }, {
      image: 'be-the-one.jpg',
      title: 'Be the One',
      byline: 'Vimeo',
      link: 'http://texasatt.prod.acquia-sites.com/initiatives/human-trafficking'
    }
  ];

  constructor( private miscService: MiscService ) { }

  ngOnInit() {
  }

}
