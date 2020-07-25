
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, RouterEvent } from '@angular/router';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Song {
  id: number,
  title: string,
  verse1: string,
  verse2: string,
  verse3: string,
  verse4: string,
  verse5: string,
  verse6: string
}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  songs = new BehaviorSubject([]);
  // products = new BehaviorSubject([]);
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

   

  /* filterItems(searchTerm) {
    return this.items.filter(item => {
      return item.id.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
      item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
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
      let songs: Song[] = [];
 
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let songs = [];
          if (data.rows.item(i).songs !== '') {
            songs = JSON.parse(data.rows.item(i).songs);
          }
 
          songs.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            verse1: data.rows.item(i).verse1,
            verse2: data.rows.item(i).verse1,
            verse3: data.rows.item(i).verse1,
            verse4: data.rows.item(i).verse1,
            verse5: data.rows.item(i).verse1,
            verse6: data.rows.item(i).verse1,
           });
        }
      }
      this.songs.next(songs);
    });
  }

 /*  addDeveloper(name, skills, img) {
    let data = [name, JSON.stringify(skills), img];
    return this.database.executeSql('INSERT INTO developer (name, skills, img) VALUES (?, ?, ?)', data).then(data => {
      this.loadDevelopers();
    });
  } */
 
  getSongs(id): Promise<songs> {
    return this.database.executeSql('SELECT * FROM song WHERE id = ?', [id]).then(data => {
      let songs = [];
      if (data.rows.item(0).skills != '') {
        skills = JSON.parse(data.rows.item(0).skills);
      }
 
      return {
        id: data.rows.item(0).id,
        name: data.rows.item(0).name, 
        skills: skills, 
        img: data.rows.item(0).img
      }
    });
  }

/*   deleteDeveloper(id) {
    return this.database.executeSql('DELETE FROM developer WHERE id = ?', [id]).then(_ => {
      this.loadDevelopers();
      this.loadProducts();
    });
  } */
 
 /*  updateDeveloper(dev: Dev) {
    let data = [dev.name, JSON.stringify(dev.skills), dev.img];
    return this.database.executeSql(`UPDATE developer SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`, data).then(data => {
      this.loadDevelopers();
    })
  } */
 
/*   loadProducts() {
    let query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId';
    return this.database.executeSql(query, []).then(data => {
      let products = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          products.push({ 
            name: data.rows.item(i).name,
            id: data.rows.item(i).id,
            creator: data.rows.item(i).creator,
           });
        }
      }
      this.products.next(products);
    });
  }
 */
 /*  addProduct(name, creator) {
    let data = [name, creator];
    return this.database.executeSql('INSERT INTO product (name, creatorId) VALUES (?, ?)', data).then(data => {
      this.loadProducts();
    });
  } */
}
