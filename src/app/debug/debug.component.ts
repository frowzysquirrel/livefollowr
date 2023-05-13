import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('lf_user'));

  constructor() { }

  ngOnInit(): void {
  }

}
