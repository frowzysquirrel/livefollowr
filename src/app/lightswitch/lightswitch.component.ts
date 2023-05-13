import { Component, OnInit } from '@angular/core';

import { LightswitchService } from '../services/lightswitch/lightswitch.service';

@Component({
  selector: 'app-lightswitch',
  templateUrl: './lightswitch.component.html',
  styleUrls: ['./lightswitch.component.scss']
})
export class LightswitchComponent implements OnInit {
  public darkMode: boolean;

  constructor(private lightswitchService: LightswitchService) { }

  ngOnInit(): void {
    this.lightswitchService.darkMode$.subscribe((value) => {
      this.darkMode = value;
      if (this.darkMode) {
        document.getElementsByTagName('body')[0].classList.add('dark-mode');
      }
    });
  }

  public toggleDarkMode() {
    this.lightswitchService.toggleDarkMode();
  }

}
