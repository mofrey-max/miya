
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, RouterEvent } from '@angular/router';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Song {
  id: number;
  title: string;
  verse1: string;
  verse2: string;
  verse3: string;
  verse4: string;
  verse5: string;
  verse6: string;
}

@Injectable({
  providedIn: 'root'
})
export class  DataService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  songs = new BehaviorSubject([]);
  selectedPath = '';


  constructor(  private plt: Platform, private router: Router, private sqlitePorter: SQLitePorter, private sqlite: SQLite,
                private http: HttpClient) {

    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'song.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.customDatabase();
      });
    });

   /*  filterItems(searchTerm) {
    return this.Song.filter(item => {
      return this.songs.id.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
      this.songs.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  } */
  }

  customDatabase() {
    this.http.get('assets/custom.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.loadSongs();
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 
  getSong(): Observable<Song[]> {
    return this.songs.asObservable();
  }

  loadSongs() {
    return this.database.executeSql('SELECT * FROM song', []).then(data => {
      const songs: Song[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          songs.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            verse1: data.rows.item(i).verse1,
            verse2: data.rows.item(i).verse2,
            verse3: data.rows.item(i).verse3,
            verse4: data.rows.item(i).verse4,
            verse5: data.rows.item(i).verse5,
            verse6: data.rows.item(i).verse6,
           });
        }
      }
      this.songs.next(songs);
    });
  }
 
  getSongs(id): Promise<Song> {
    return this.database.executeSql('SELECT * FROM song WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        title: data.rows.item(0).title,
        verse1: data.rows.item(0).verse1,
        verse2: data.rows.item(0).verse2,
        verse3: data.rows.item(0).verse3,
        verse4: data.rows.item(0).verse4,
        verse5: data.rows.item(0).verse5,
        verse6: data.rows.item(0).verse6,
      };
    });
  }
}

