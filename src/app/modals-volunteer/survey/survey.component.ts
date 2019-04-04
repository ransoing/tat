import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrxService, MiscService, GetFeedbackService } from '../../services';

export enum ISurveyFieldType {
  TEXT = 'text',    // text field
  EMAIL = 'email',  // text field
  TEL = 'tel',      // text field
  NUMBER = 'number',// text field
  SELECT = 'select',// select
  CHOICE = 'choice',// single- or multi-select, displayed as large buttons to tap. Usually the only field on the page.
  TEXTAREA = 'textarea', // usually the only field on the page.
  DATE = 'date'     // datepicker popup
}

export interface ISurveyField {
  type: ISurveyFieldType,
  name: string,
  labelTranslationKey?: string,
  defaultValue?: string,
  isRequired?: boolean,
  options?: {value: string, labelTranslationKey: string}[], // for 'SELECT' or 'CHOICE' input types
  multi?: boolean // for 'CHOICE' input type. allows selecting multiple options.
}

export interface ISurveyPage {
  topTextTranslationKey?: string,
  // `canContinue` whether the 'next' button is enabled
  canContinue?( formVals: any ): boolean,
  // `onContinue` executes when the 'next' button is clicked.
  // if it resolves, then the next page of the survey is loaded. if it rejects, then it stays on the same page.
  onContinue?( formVals: any ): Promise<any>,
  // if `isVisible` this returns false, then this page is skipped
  isVisible?( formVals: any ): boolean,
  fields?: ISurveyField[],
}

export interface ISurvey {
  // if onComplete resolves, then the modal closes. If it rejects, the modal does not close.
  onComplete( formVals: any ): Promise<any>,
  pages: ISurveyPage[]
}

@Component({
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  @Input('titleTranslationKey') titleTranslationKey: string;
  @Input('survey') survey: ISurvey;

  @ViewChild('form') formRef: ElementRef;

  modal: HTMLIonModalElement;
  ISurveyFieldType = ISurveyFieldType;

  activePage = -1;
  firstPage = -1;

  pageHistory: number[] = [];

  constructor(
    public miscService: MiscService,
    public getFeedbackService: GetFeedbackService,
    public trx: TrxService
  ) {}

  ngOnInit() {
    // assign default values to optional functions
    let noopTrue = () => true;
    let noopTruePromise = () => {
      return new Promise( (resolve,reject) => resolve() );
    };
    this.survey.pages.forEach( page => {
      page.canContinue = page.canContinue || noopTrue;
      page.onContinue = page.onContinue || noopTruePromise;
      page.isVisible = page.isVisible || noopTrue;
      page.fields = page.fields || [];
      page.fields.forEach( field => field.labelTranslationKey = field.labelTranslationKey || '' );
    });

    this.goToNextVisiblePage();
    this.firstPage = this.activePage; // in case we skipped some pages right off the bat
  }

  canContinue(): boolean {
    let page = this.survey.pages[this.activePage];

    // find out if required elements are filled out
    let passesFirstTest = !page.fields ? true : page.fields.every( field => {
      let fieldVal = this.getFieldVal( field );
      return !field.isRequired || fieldVal.length > 0;
    });

    // run the custom canContinue function for the active page
    return passesFirstTest && page.canContinue( this.getAllVals() );
  }

  advance() {
    // if the page has an `onContinue` function, execute that first before advancing
    this.survey.pages[this.activePage].onContinue( this.getAllVals() ).then( () => {
      // add the current page to the 'undo' history
      this.pageHistory.push( this.activePage );
      this.goToNextVisiblePage();
    }, () => {
      // do nothing if we're not allowed to advance
    });
  }

  goToNextVisiblePage() {
    // if any pages are not visible, skip over them
    do {
      this.activePage++;
    } while ( !this.survey.pages[this.activePage].isVisible(this.getAllVals()) );
  }

  goBack() {
    this.activePage = this.pageHistory.pop();
  }

  isLastPage() {
    // the active page is considered the "last" one if there are no visible pages after it
    let subsequentPages = this.survey.pages.slice( this.activePage + 1 );
    return !subsequentPages.some( page => page.isVisible(this.getAllVals()) );
  }

  finish() {
    this.survey.onComplete( this.getAllVals() ).then(
      () => this.modal.dismiss(),
      () => {} // do nothing
    );
  }

  pageHasRequiredFields( page: ISurveyPage ): boolean {
    return page.fields.some( field => field.isRequired );
  }

  getFormMarginLeft(): string {
    let percentVal = this.pageHistory.length * 100;
    let pixelVal = this.pageHistory.length * 16;
    return `calc( -${percentVal}% - ${pixelVal}px )`; 
  }

  // radio buttons were having some messed up behavior. The form element at [fieldName] only exists if I check it in an if-statement
  // before accessing the element's value.
  getFieldVal( field: ISurveyField ) {
    if ( this.formRef.nativeElement.elements[field.name] ) {
      let el = this.formRef.nativeElement.elements[field.name];
      if ( field.type === ISurveyFieldType.CHOICE && field.multi ) {
        // join the values of the checked boxes into a comma-separated list
        if ( el[0] ) {
          // there are multiple checkboxes, so this behaves like an array
          return Array.prototype.slice.call( el )
          .filter( checkboxInput => checkboxInput.checked )
          .map( checkboxInput => checkboxInput.value )
          .join( '; ' );
        } else {
          // just one checkbox.
          return el.checked ? el.value : '';
        }
      } else {
        // for ion select elements, a blank field has the string value "undefined"
        return el.value === 'undefined' ? '' : el.value.trim();
      }
    } else if ( field.type === ISurveyFieldType.DATE ) {
      let el = this.formRef.nativeElement.querySelector( 'ion-datetime[name='+field.name+']' );
      if ( el && el.value ) {
        // with Date, months are 0-indexed. With ion-datetime component, they are 1-indexed
        let date = new Date( el.value.year.value, el.value.month.value - 1, el.value.day.value );
        return date.toISOString();
      }
    }
    return '';
  }

  // returns an object -- each property is the name of a field, and the value of the property is the value of the field
  getAllVals() {
    let vals = {};
    this.survey.pages.forEach( page => {
      page.fields.forEach( field => {
        vals[field.name] = this.getFieldVal( field );
      });
    });
    return vals;
  }

  // angular lifecycle was not updating quickly for radio buttons, until I added (click). Nothing needs to happen... just making the lifecycle run.
  noop() {}

}
