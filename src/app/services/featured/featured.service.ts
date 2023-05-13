import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FeaturedService {
  private token = localStorage.getItem('lf_token') ? localStorage.getItem('lf_token') : null;

  constructor(
    private userService: UserService,
  ) { }

  getStreamer(): any {
    let stream = {};
    const streamer = 'flashforce';
    return axios({
      method: 'get',
      url: 'https://api.twitch.tv/helix/search/channels',
      params: {
        query: streamer,
      },
      headers: {
        'client-id': this.userService.clientId,
        Authorization: `Bearer ${this.token}`,
      }
    }).then((channelResponse) => {
      const channels = channelResponse.data.data;
      const channel  = channels.find((_channel) => _channel.broadcaster_login === streamer);

      // get game
      return this.getGame(channel.game_id).then((game) => {
        if (channel.is_live) {
          return axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/streams',
            params: {
              user_id: channel.id,
            },
            headers: {
              'client-id': this.userService.clientId,
              Authorization: `Bearer ${this.token}`,
            }
          }).then((streamResponse) => {
            const streamData = streamResponse.data.data[0];
            stream = {
              thumbnail: streamData.thumbnail_url.replace('{width}', 440).replace('{height}', 248),
              pic: channel.thumbnail_url,
              title: streamData.title,
              userName: streamData.user_name,
              game: game.name,
              viewerCount: streamData.viewer_count,
              live: true,
            };
            return stream;
          });

        } else {
          return axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/users',
            params: {
              login: channel.display_name,
            },
            headers: {
              'client-id': this.userService.clientId,
              Authorization: `Bearer ${this.token}`,
            }
          }).then((response) => {
            const user = response.data.data[0];
            stream = {
              thumbnail: user.offline_image_url || 'https://picsum.photos/440/248',
              pic: user.profile_image_url,
              title: channel.title,
              userName: user.display_name,
              game: game.name,
              live: false,
            };
            console.log(stream);
            return stream;
          });
        }
      });
    });
  }

  private getGame(gameId) {
    return axios({
      url: 'https://api.twitch.tv/helix/games',
      method: 'get',
      params: {
        id: gameId,
      },
      headers: {
        'Client-ID': this.userService.clientId,
        Authorization: `Bearer ${this.token}`,
      },
    }).then((gameResponse) => {
      return gameResponse.data.data[0];
    });
  }
}
