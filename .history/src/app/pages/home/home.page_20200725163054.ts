import { Component, OnInit } from '@angular/core';
import { DatabaseService, Song } from '../services/database.service';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

   song: Song[] = [];
   showSearchbar: boolean;
   public queryText: '';


   constructor( public http: HttpClient, private db: DatabaseService, private platform: Platform) {
       this.platform.ready().then(() => {
       }).catch(error => {
         console.log(error);
       });
   }
 
    ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getSong().subscribe(content => {
          this.song = content;
        });
      }
    });
   }
 
   
}
