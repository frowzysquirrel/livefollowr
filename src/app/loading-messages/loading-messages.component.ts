import { Component, OnInit } from '@angular/core';
import { sample as _sample, remove as _remove } from 'lodash';

@Component({
  selector: 'app-loading-messages',
  templateUrl: './loading-messages.component.html',
  styleUrls: ['./loading-messages.component.scss']
})
export class LoadingMessagesComponent implements OnInit {

  private messages = [
    'Analyzing Followers Hidden Matrix',
    'Calculating Streamers Likeability',
    'Compressing Games Quantum Engines',
    'Starting Viewers Simulation Layer',
    'Depixelating Stream Thumbnails',
    'Checking Mic Volumes',
    'Resolving Stream Qubits',
    'Initializing Recalibration Routines',
    'Obfuscating Twitch\'s Neural Database',
  ];

  public currentMessage = 'Opening Twitch Communications Portal';

  constructor() {}

  ngOnInit(): void {
    let messages = [...this.messages];
    setInterval(() => {
      this.currentMessage = _sample(messages);
      _remove(messages, message => message === this.currentMessage);
      if (!messages.length) {
        messages = [...this.messages];
      }
    }, 2600);
  }

}
