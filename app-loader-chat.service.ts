import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { AppLoaderChatComponent } from './app-loader-chat.component';


@Injectable()
export class AppLoaderChatService {
  
  constructor(public als : AppLoaderChatComponent) { }

  public open(title: string = 'Please wait') { 
    this.als.open(title);
  }

  public close() {
    this.als.close();
  }
}
