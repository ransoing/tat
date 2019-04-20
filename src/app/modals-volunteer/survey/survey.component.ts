import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrxService, MiscService } from '../../services';
import { ISurvey, ISurveyField, SurveyFieldType, ISurveyPage } from '../../models/survey';

/**
 * This component is a modal that shows a survey.
 * If the modal dismisses with the value 'true', then the survey was completed and submitted successfully.
 * Use like this:
 * 
 * let someSurvey: ISurvey = { ... };
 * this.modalService.open( SurveyComponent, {
 *   titleTranslationKey: 'some.translation.key',
 *   successTranslationKey: 'some.other.key',
 *   survey: someSurvey,
 *   onSuccess: () => {
 *     // survey was completed successfully
 *   }
 * });
 *
 */

@Component({
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  @Input('titleTranslationKey') titleTranslationKey: string;
  @Input('successTranslationKey') successTranslationKey?: string;
  @Input('survey') survey: ISurvey;
  // if the survey is submitted and the response indicates success, this function runs after the modal closes
  @Input('onSuccess') onSuccess: Function;

  @ViewChild('form') formRef: ElementRef;

  modal: HTMLIonModalElement;
  SurveyFieldType = SurveyFieldType;

  activePage = -1;
  firstPage = -1;

  pageHistory: number[] = [];

  constructor(
    public trx: TrxService,
    public miscService: MiscService
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
    this.survey.onSubmit( this.getAllVals() ).then(
      async () => {
        if ( this.successTranslationKey ) {
          // show a success alert
          await this.miscService.showSimpleAlert( await this.trx.t( 'misc.success' ), await this.trx.t( this.successTranslationKey ) );
        }
        await this.modal.dismiss( true );
        this.onSuccess();
      },
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
      if ( field.type === SurveyFieldType.CHOICE && field.multi ) {
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
    } else if ( field.type === SurveyFieldType.DATE ) {
      let el = this.formRef.nativeElement.querySelector( 'ion-datetime[name='+field.name+']' );
      if ( el && el.value ) {
        // with Date, months are 0-indexed. With ion-datetime component, they are 1-indexed
        let date = new Date( el.value.year.value, el.value.month.value - 1, el.value.day.value );
        return date.toISOString();
      }
    } else if ( field.type === SurveyFieldType.TIME ) {
      let el = this.formRef.nativeElement.querySelector( 'ion-datetime[name='+field.name+']' );
      if ( el && el.value ) {
        // return the time value as HH:MM:SS, but SS is always 00
        const hour = el.value.hour.value.toString().padStart( 2, '0' );
        const minute = el.value.minute.value.toString().padStart( 2, '0' );
        return hour + ':' + minute + ':00';
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
