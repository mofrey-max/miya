import { Component, OnInit } from '@angular/core';
import * as CapacitorSQLPlugin from 'capacitor-sqlite';
const { CapacitorSQLite,Device } = Plugin;

@Component({
  selector: 'app-p1',
  templateUrl: './p1.page.html',
  styleUrls: ['./p1.page.scss'],
})
export class P1Page implements OnInit {
  sqlite: any;

  constructor() { }

  ngOnInit() {
  }

  async ngAfterViewInit () {
    const info = await Device.getInfo();
    if (info.platform === 'ios' || info.platform === 'android') {
      this.sqlite = CapacitorSQLite;
    } else if(info.platform === 'electron') {
      this.sqlite = CapacitorSQLPlugin.CapacitorSQLiteElectron;
    } else {
      this.sqlite = CapacitorSQLPlugin.CapacitorSQLite;
    }

  }

  async testSQLite() {
      let result: any = await this.sqlite.open({database:'testsqlite'});
      const retOpenDB = result.result;
      if (retOpenDB) {
          // Create Tables if not exist
          let sqlcmd: string = `
          BEGIN TRANSACTION;
          CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY NOT NULL,
              email TEXT UNIQUE NOT NULL,
              name TEXT,
              age INTEGER
          );
          PRAGMA user_version = 1;
          COMMIT TRANSACTION;
          `;
          var retExe: any = await this.sqlite.execute({statements: sqlcmd});
          console.log('retExe ', retExe.changes.changes);
          // Insert some Users
          sqlcmd = `
          BEGIN TRANSACTION;
          DELETE FROM users;
          INSERT INTO users (name,email,age) VALUES ("Whiteley","Whiteley.com",30);
          INSERT INTO users (name,email,age) VALUES ("Jones","Jones.com",44);
          COMMIT TRANSACTION;
          `;
          retExe = await this.sqlite.execute({statements:sqlcmd});
          // will print the changes  2 in that case
          console.log('retExe ',retExe.changes.changes);
          // Select all Users
          sqlcmd = 'SELECT * FROM users';
          let retSelect: any = await this.sqlite.query({statement: sqlcmd, values:[]});
          console.log('retSelect.values.length ', retSelect.values.length);
          const row1: any = retSelect.values[0];
          console.log('row1 users ', JSON.stringify(row1) );
          const row2: any = retSelect.values[1];
          console.log('row2 users ', JSON.stringify(row2));

          // Insert a new User with SQL and Values

          sqlcmd = 'INSERT INTO users (name,email,age) VALUES (?,?,?)';
          let values: Array<any>  = ['Simpson','Simpson@example.com',69];
          var retRun: any = await this.sqlite.run({statement:sqlcmd, values: values});
          console.log('retRun ',retRun.changes.changes,retRun.changes.lastId);

          // Select Users with age > 35
          sqlcmd = 'SELECT name,email,age FROM users WHERE age > ?';
          retSelect = await this.sqlite.query({statement: sqlcmd, values:['35']});
          console.log('retSelect ', retSelect.values.length);
          
      
      }
  }

}
