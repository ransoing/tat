
export enum SurveyFieldType {
  TEXT = 'text',    // text field
  EMAIL = 'email',  // text field
  TEL = 'tel',      // text field
  NUMBER = 'number', // text field
  SELECT = 'select', // select
  CHOICE = 'choice', // single- or multi-select, displayed as large buttons to tap. Usually the only field on the page.
  TEXTAREA = 'textarea', // usually the only field on the page.
  DATE = 'date',    // datepicker popup
  TIME = 'time',    // timepicker popup
  COUNTRY = 'country', // a 'select' dropdown with a list of countries
  STATE = 'state'   // a 'select' dropdown with a list of states or provinces, depending on the country selected
}

export interface ISurveyField {
  type: SurveyFieldType;
  name: string;

  preFieldTextTranslationKey?: string; // text that shows above the field

  // either `label` or `labelTranslationKey` is required
  label?: string;
  labelTranslationKey?: string;

  defaultValue?: string;
  isRequired?: boolean;
  helperTranslationKey?: string; // some helper text, for TEXTAREA, TEXT, EMAIL, TEL, or NUMBER

  // for 'SELECT' or 'CHOICE' input types.
  options?: {
    value: string,
    // either `label` or `labelTranslationKey` is required
    label?: string,
    labelTranslationKey?: string
  }[];

  // for 'STATE' input type
  countryDropdownName?: string;

  multi?: boolean; // for 'CHOICE' input type. allows selecting multiple options.

  // for 'DATE' input type. both fields can be a year like '2016' or a date like '2020-10-31'
  // also for 'NUMBER' input type.
  min?: string | number;
  max?: string | number;
}

export interface ISurveyPage {
  titleText?: string;
  topTextTranslationKey?: string;
  topText?: string;
  fields?: ISurveyField[];
  // `canContinue` whether the 'next' button is enabled
  canContinue?( formVals: any ): boolean;
  // `onContinue` executes when the 'next' button is clicked.
  // if it resolves, then the next page of the survey is loaded. if it rejects, then it stays on the same page.
  onContinue?( formVals: any ): Promise<any>;
  // if `isVisible` returns false, then this page is skipped
  isVisible?( formVals: any ): boolean;
}

export type ISurveyPageFunc = () => ISurveyPage;

export interface ISurvey {
  // if onComplete resolves, then the modal closes. If it rejects, the modal does not close.
  pages?: ISurveyPageFunc[];
  submitButtonTranslationKey?: string;
  onSubmit( formVals: any ): Promise<any>;
}
