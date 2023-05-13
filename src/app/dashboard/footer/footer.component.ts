import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem('lf_user');
    localStorage.removeItem('lf_token');
    window.location.href = '/';
  }

}
