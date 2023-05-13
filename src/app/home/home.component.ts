import { Component, OnInit, ɵCodegenComponentFactoryResolver } from '@angular/core';

import { LightswitchService } from '../services/lightswitch/lightswitch.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private user = localStorage.getItem('lf_user') ? JSON.parse(localStorage.getItem('lf_user')) : null;
  public login: boolean;
  public darkMode: boolean;

  constructor(private lightswitchService: LightswitchService) { }

  ngOnInit(): void {
    if (this.user) {
      this.login = true;
    }

    this.lightswitchService.darkMode$.subscribe((value) => {
      this.darkMode = value;
    });
  }

}
