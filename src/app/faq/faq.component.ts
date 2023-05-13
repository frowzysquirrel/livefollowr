import { Component, OnInit } from '@angular/core';

import { LightswitchService } from '../services/lightswitch/lightswitch.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public darkMode: boolean;

  constructor(private lightswitchService: LightswitchService) { }

  ngOnInit(): void {
    this.lightswitchService.darkMode$.subscribe((value) => {
      this.darkMode = value;
    });
  }

}
