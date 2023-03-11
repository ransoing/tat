import { Component, Input } from '@angular/core';
import { ModalService } from '../../../services';
import {
  CaseStudyBComponent,
  CaseStudyDComponent,
  GenericModalComponent
} from '../../../modals';

@Component({
  selector: 'app-red-flags-sex-section',
  templateUrl: './red-flags-sex-section.component.html'
})
export class RedFlagsSexSectionComponent {

  @Input() section: 'generic' | 'on-the-road' | 'in-the-neighborhood' | 'rideshare' | 'residential-brothel' | 'traffickers-home' | 
    'questions';
  @Input() introKey?: string;

  CaseStudyBComponent = CaseStudyBComponent;
  CaseStudyDComponent = CaseStudyDComponent;
  GenericModalComponent = GenericModalComponent;

  rideshareCaseStudyAProps = {
    title: 'redFlagsSex.caseStudy.title',
    bodyHtml: 'redFlagsSex.caseStudy.rideshareA',
    source: {
      label: 'redFlagsSex.caseStudy.source.nbcNews',
      link: 'https://www.nbcnews.com/news/latino/uber-driver-saves-16-year-old-girl-sex-trafficking-n701241'
    }
  };

  caseStudyLocalAProps = {
    title: 'redFlagsSex.caseStudy.title',
    bodyHtml: 'redFlagsSex.caseStudy.localA',
    source: {
      label: 'redFlagsSex.caseStudy.source.abc7',
      link: 'https://abc7chicago.com/postal-worker-sex-trafficking-teen-saved-from/3882907/'
    }
  };

  constructor( public modalService: ModalService ) {}

}
