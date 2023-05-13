import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

import { environment } from '../../environments/environment';

import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private clientId: string;

  constructor(
    private router: Router,
    private user: UserService,
  ) {}

  ngOnInit(): void {
    const accessToken = new URLSearchParams(
      window.location.hash.replace('#', '?')
    ).get('access_token');

    if (accessToken) {
      axios({
        url: 'https://api.twitch.tv/helix/users',
        method: 'GET',
        headers: {
          'Client-ID': this.user.clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {

          // log user visit
          axios.get(`${environment.apiUrl}/users`, {
            params: {
              username: response.data.data[0].display_name
            },
          }).then((apiSearchResponse) => {

            // first time user
            if (!apiSearchResponse.data.length) {
              axios.post(`${environment.apiUrl}/users`, {
                username: response.data.data[0].display_name,
                visits: 1,
              }).then(() => {
                this.login(accessToken, response.data.data[0]);
              });

              // has been before, so update # of visits
            } else {
              const dbUser = apiSearchResponse.data[0];
              axios.patch(`${environment.apiUrl}/users/${dbUser.id}`, {
                visits: dbUser.visits + 1,
              }).then(() => {
                this.login(accessToken, response.data.data[0]);
              });
            }
          });

        })
        .catch((errorResponse) => {
          console.log(errorResponse);
          alert('An error has occurred. Please contact Frowzy for help :)');
        });

        // not logged in nor trying to, so: login
      } else {
        this.twitchLogin();
      }
    }

    private login(token, data) {
      localStorage.setItem('lf_token', token);
      localStorage.setItem('lf_user', JSON.stringify(data));
      this.router.navigate(['feed']);
  }

  private twitchLogin() {
    const redirectUri = environment.redirectUri;
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${this.user.clientId}&redirect_uri=${redirectUri}&response_type=token`;
    window.location.href = url;
  }
}
