
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, RouterEvent } from '@angular/router';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Dev {
  id: number,
  name: string,
  // skills: any[],
  img: string
}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  developers = new BehaviorSubject([]);
  products = new BehaviorSubject([]);

  
  selectedPath = '';

  constructor(  private plt: Platform, private router: Router, private sqlitePorter: SQLitePorter, private sqlite: SQLite,
     private http: HttpClient) {

    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'developers.db',
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
          this.loadDevelopers();
          this.loadProducts();
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 
  getDevs(): Observable<Dev[]> {
    return this.developers.asObservable();
  }
 
  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }

  loadDevelopers() {
    return this.database.executeSql('SELECT * FROM developer', []).then(data => {
      let developers: Dev[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          
 
          developers.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name, 
            // skills: skills, 
            img: data.rows.item(i).img
           });
        }
      }
      this.developers.next(developers);
    });
  }

  addDeveloper(name, skills, img) {
    let data = [name, JSON.stringify(skills), img];
    return this.database.executeSql('INSERT INTO developer (name, skills, img) VALUES (?, ?, ?)', data).then(data => {
      this.loadDevelopers();
    });
  }
 
  getDeveloper(id): Promise<Dev> {
    return this.database.executeSql('SELECT * FROM developer WHERE id = ?', [id]).then(data => {
     
 
      return {
        id: data.rows.item(0).id,
        name: data.rows.item(0).name, 
        // skills: skills, 
        img: data.rows.item(0).img
      }
    });
  }

  deleteDeveloper(id) {
    return this.database.executeSql('DELETE FROM developer WHERE id = ?', [id]).then(_ => {
      this.loadDevelopers();
      this.loadProducts();
    });
  }
 
 
 
  loadProducts() {
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

  addProduct(name, creator) {
    let data = [name, creator];
    return this.database.executeSql('INSERT INTO product (name, creatorId) VALUES (?, ?)', data).then(data => {
      this.loadProducts();
    });
  }
}
