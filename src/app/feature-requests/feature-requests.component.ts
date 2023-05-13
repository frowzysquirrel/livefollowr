import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

import { environment } from '../../environments/environment';
@Component({
  selector: 'app-feature-requests',
  templateUrl: './feature-requests.component.html',
  styleUrls: ['./feature-requests.component.scss']
})
export class FeatureRequestsComponent implements OnInit {
  public user = localStorage.getItem('lf_user') ? JSON.parse(localStorage.getItem('lf_user')) : null;

  public users = [];
  public loading = true;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!['flashforce', 'frowzysquirrel'].includes(this.user.login)) {
      this.router.navigate(['home']);
    } else {
      axios.get(`${environment.apiUrl}/featured`).then((response) => {
        this.users = response.data;
        console.log(this.users);
        this.users.sort((a, b) => a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 1);
        this.loading = false;
      });

    }
  }

}
