import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-live-loader',
  templateUrl: './live-loader.component.html',
  styleUrls: ['./live-loader.component.scss']
})
export class LiveLoaderComponent implements OnInit {
  @Input() size;
  @Input() inline: boolean;
  @Input() style: any;

  public customStyle: any;

  constructor() { }

  ngOnInit(): void {
    this.customStyle = {
      ...this.style,
      'width.px': this.size * 2,
      'height.px': this.size,
    };
  }

}
