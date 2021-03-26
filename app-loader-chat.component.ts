import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-app-loader',
  templateUrl: './app-loader-chat.component.html',
  styleUrls: ['./app-loader-chat.component.css']
})
export class AppLoaderChatComponent implements OnInit {
  title;
  message : string = 'Loading...';
  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit() {
  }

  public open(loadMsg: string = 'message') {
    this.message = loadMsg;
    this.spinner.show();
  }

  public close() {
    this.spinner.hide();
  }

}
