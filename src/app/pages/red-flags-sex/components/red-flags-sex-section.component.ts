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

  CaseStudyBComponent = CaseStudyBComponent;
  CaseStudyDComponent = CaseStudyDComponent;
  GenericModalComponent = GenericModalComponent;

  constructor( public modalService: ModalService ) {}

}
