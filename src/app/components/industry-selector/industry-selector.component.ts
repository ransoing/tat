import { Component } from '@angular/core';
import { SettingsService } from '../../services';

@Component({
  selector: 'app-industry-selector',
  templateUrl: './industry-selector.component.html',
  styleUrls: ['./industry-selector.component.scss']
})
export class IndustrySelectorComponent {
  
  constructor(
    public settings: SettingsService
  ) {}

  onSetIndustry() {
    this.settings.saveSettings();
  }
}
