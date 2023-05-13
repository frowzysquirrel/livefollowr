import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
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
      axios.get(`${environment.apiUrl}/users`).then((response) => {
        this.users = response.data;
        this.users.sort((a, b) => a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 1);
        this.loading = false;
      });

    }
  }

}
