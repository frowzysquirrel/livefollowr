import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gtag } from 'angular-gtag';
import axios from 'axios';
import {
  each as _each,
  find as _find,
  uniqBy as _uniqBy,
  last as _last,
  pullAllBy as _pullAllBy,
  countBy as _countBy,
} from 'lodash';

import { UserService } from '../services/user/user.service';
import { FeaturedService } from '../services/featured/featured.service';
import { LightswitchService } from '../services/lightswitch/lightswitch.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public user = localStorage.getItem('lf_user')
    ? JSON.parse(localStorage.getItem('lf_user'))
    : null;
  private token = localStorage.getItem('lf_token') ? localStorage.getItem('lf_token') : null;
  public darkMode: boolean;

  public fetchAmount = 12;
  public streamsPool = [];
  public streams = [];
  public featured: any;
  public loading = false;
  public firstLoad = true;
  public fetchRequested = false;
  public noStreamersFound = false;
  public featuredUrl = '';

  public showFilters = false;
  public isTyping: boolean;
  public gameFilterLoading: boolean;
  public gameFilterId: string; // set by route params
  public noGamesFound: boolean;
  public selectedGameFilter: string;
  public gamesFound = [];
  public quickFilters = [];
  public nodesInspected = 0;

  public afterPoolLoading = 0;
  public picsAndGames = {};
  public mutualFollows = [];
  public preload = [];
  public fakeLoading: number;

  private fetching = false;
  private lastFollowersCursor: string;
  private typingTimeout: any;
  private twitchApiHeaders: any;

  constructor(
    private gtag: Gtag,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private featuredService: FeaturedService,
    private lightswitchService: LightswitchService,
  ) {
    this.twitchApiHeaders = {
      'client-id': this.userService.clientId,
      Authorization: `Bearer ${this.token}`,
    };
  }

  ngOnInit(): void {
    if (!this.user) {
      this.router.navigate(['login']);
    } else {
      // this.user.id = 102762045; // flash
      // this.user.id = 410062752; // rafa
    }

    this.lightswitchService.darkMode$.subscribe((value) => {
      this.darkMode = value;
    });

    // show loading by default
    this.loading = true;

    // fetch featured streamer
    this.featuredService.getStreamer().then((featuredStreamer) => {
      this.featured = featuredStreamer;
      this.featuredUrl = `https://player.twitch.tv/?channel=${this.featured.userName.toLowerCase()}&parent=${
        window.location.host
      }`;
      console.log(this.featured);
      console.log(this.featuredUrl);

      // check filters
      this.route.params.subscribe((params) => {
        const { gameFilter } = params;

        // we got filters
        if (gameFilter && gameFilter !== 'undefined') {
          this.showFilters = true;
          this.selectedGameFilter = gameFilter;
          axios
            .get('https://api.twitch.tv/helix/games', {
              params: {
                name: gameFilter,
              },
              headers: this.twitchApiHeaders,
            })
            .then((response) => {
              const game = response.data.data[0];
              if (game) {
                this.gameFilterId = game.id;
              }
              this.fetch();
            });
        } else {
          this.fetch();
        }
      });
    });
  }

  public searchGame(event) {
    const {
      target: { value },
    } = event;
    if (!!value.trim()) {
      this.gameFilterLoading = true;
      this.isTyping = true;
      this.noGamesFound = false;
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.isTyping = false;
        if (!this.isTyping) {
          axios
            .get('https://api.twitch.tv/helix/search/categories', {
              params: {
                query: value,
              },
              headers: this.twitchApiHeaders,
            })
            .then((response) => {
              this.gamesFound = response.data.data;
              this.noGamesFound = !!!this.gamesFound.length;
              this.isTyping = false;
              this.gameFilterLoading = false;
            });
        }
      }, 500);
    }
  }

  public selectGameFilter(gameName) {
    this.selectedGameFilter = gameName;
    this.gamesFound = [];
    this.noGamesFound = false;
  }

  public applyFilters() {
    if (this.selectGameFilter) {
      window.location.href = `/feed/${this.selectedGameFilter}`;
    }
  }

  public onClickOutsideAutocomplete(event) {
    // don't hide if click on input
    if (event.target.id !== 'gameFilter') {
      this.gamesFound = [];
      this.noGamesFound = false;
    }
  }

  public reload() {
    this.gtag.event('reload');
    window.location.reload();
  }

  public infinite(noScroll?) {
    this.gtag.event('view_more');
    this.addStreams();
    this.updateQuickFilters();

    if (!noScroll && this.preload.length) {
      this.scroll();
    }

    this.preload = [];
    this.firstLoad = false;
    this.afterPoolLoading = 0;

    if (this.fetching) {
      this.loading = true;
      this.fetchRequested = true;
    } else {
      this.fetch();
    }
  }

  private addStreams() {
    _pullAllBy(this.preload, [{ userName: this.featured.userName }], 'userName');
    this.streams.push(...this.preload);
    this.streams = _uniqBy(this.streams, 'userName');
  }

  private updateQuickFilters() {
    this.quickFilters = Object.entries(_countBy(this.picsAndGames, 'game'))
      .sort((a, b) => (a[1] > b[1] ? -1 : 1))
      .filter((row) => row[0] !== 'undefined')
      .splice(0, 2);
  }

  private fetch() {
    this.fetching = true;
    this.getFollowers(this.lastFollowersCursor).then(() => {
      console.log(this.streamsPool);
      this.afterPoolLoading = 1;
      if (this.streamsPool && this.streamsPool.length) {
        const names = [];
        const gameIds = [];
        this.streamsPool.forEach((stream) => {
          this.picsAndGames[stream.userName.toLowerCase()] = {
            gameId: stream.gameId,
          };
          names.push(stream.userName);
          gameIds.push(stream.gameId);
        });

        // get streamer pfps
        axios({
          url: 'https://api.twitch.tv/helix/users',
          method: 'get',
          params: {
            login: names,
          },
          headers: this.twitchApiHeaders,
        }).then((response) => {
          this.afterPoolLoading = 2;
          const streamers = response.data.data;
          streamers.forEach((streamer) => {
            this.picsAndGames[streamer.login].pic = streamer.profile_image_url;
          });

          // get games data
          axios({
            url: 'https://api.twitch.tv/helix/games',
            method: 'get',
            params: {
              id: gameIds,
            },
            headers: {
              'Client-ID': this.userService.clientId,
              Authorization: `Bearer ${localStorage.getItem('lf_token')}`,
            },
          }).then((gamesResponse) => {
            this.afterPoolLoading = 3;
            const games = gamesResponse.data.data;
            _each(this.picsAndGames, (streamer) => {
              const currentGame = _find(games, (game) => game.id === streamer.gameId);
              if (currentGame) {
                streamer.game = currentGame.name;
              }
            });

            // sort by viewer count
            this.streamsPool.sort((a, b) => b.viewerCount - a.viewerCount);

            // get who you follow
            const queue = [];
            this.streamsPool.forEach((stream) => {
              queue.push(
                axios({
                  method: 'get',
                  url: `https://api.twitch.tv/helix/users/follows?from_id=${this.user.id}&to_id=${stream.userId}`,
                  headers: this.twitchApiHeaders,
                }),
              );
            });

            axios.all(queue).then((mutualFollowResponses) => {
              this.afterPoolLoading = 3;
              mutualFollowResponses.forEach((mutualFollowResponse) => {
                const mutualFollow = mutualFollowResponse.data.data;
                if (mutualFollow.length) {
                  const follower = mutualFollow[0];
                  this.mutualFollows.push(follower.to_name);
                }
              });

              // preload thumbnails
              const thumbnailQueue = [];
              this.streamsPool.forEach((stream, i) => {
                if (i === 0) {
                  stream.scrollTarget = true;
                }
                thumbnailQueue.push(axios.get(stream.thumbnail));
              });

              axios.all(thumbnailQueue).then(() => {
                this.afterPoolLoading = 4;
                this.preload.push(...this.streamsPool);

                this.loading = false;
                this.fetching = false;
                this.streamsPool = [];

                if (!this.streams.length) {
                  this.infinite(true);
                }

                if (this.fetchRequested) {
                  this.addStreams();
                  this.fetchRequested = false;
                  this.preload = [];
                  this.scroll();
                  this.fetch();
                }
              });
            });
          });
        });
      } else {
        this.noStreamersFound = true;
        this.loading = false;
      }
    });
  }

  private scroll() {
    // scroll
    setTimeout(() => {
      const lastTarget = _last(document.querySelectorAll('.scroll-target')) as HTMLElement;
      window.scrollTo({
        top: lastTarget.offsetTop,
      });
    }, 400);
  }

  private getStreams(followersIDs: string[], cursor?: string) {
    this.nodesInspected++;
    return axios({
      method: 'get',
      url: 'https://api.twitch.tv/helix/streams',
      params: {
        user_id: followersIDs,
        first: 100,
        after: cursor || '',
        game_id: this.gameFilterId,
      },
      headers: this.twitchApiHeaders,
    }).then((streamsResponse) => {
      const streams = streamsResponse.data.data;
      if (streams.length) {
        streams.forEach((stream) => {
          const thumbnail = stream.thumbnail_url.replace('{width}', 440).replace('{height}', 248);

          this.streamsPool.push({
            thumbnail,
            userId: stream.user_id,
            title: stream.title,
            userName: stream.user_name,
            gameId: stream.game_id,
            viewerCount: stream.viewer_count,
          });
        });
        return streamsResponse.data.pagination.cursor;
      }
      return;
    });
  }

  private getFollowers(followersCursor?: string) {
    // get followers
    return axios({
      method: 'get',
      url: `https://api.twitch.tv/helix/users/follows?to_id=${this.user.id}`,
      params: {
        first: 100,
        after: followersCursor || '',
      },
      headers: this.twitchApiHeaders,
    }).then((followersResponse) => {
      const followers = followersResponse.data.data;
      const followersPaginationCursor = followersResponse.data.pagination.cursor;
      this.lastFollowersCursor = followersPaginationCursor;
      if (followers.length) {
        const followersIDs: string[] = [];
        followers.forEach((follower) => {
          followersIDs.push(follower.from_id);
        });

        // get active streams
        return this.getStreams(followersIDs).then((streamsPaginationCursor) => {
          if (this.streamsPool.length >= this.fetchAmount) {
            return this.streamsPool;
          } else if (streamsPaginationCursor) {
            return this.getStreams(followersIDs, streamsPaginationCursor);
          } else if (followersPaginationCursor) {
            return this.getFollowers(followersPaginationCursor);
          } else {
            return this.streamsPool;
          }
        });
      } else {
        return this.streams.length ? [] : this.streamsPool;
      }
    });
  }
}
