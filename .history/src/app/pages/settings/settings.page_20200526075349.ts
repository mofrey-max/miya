import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  fontSize: number; 

  ngOnInit() {
     if (!localStorage.getItem('fontSize')) {
      localStorage.setItem('fontSize', (15).toString());
    }
      this.fontSize = +(localStorage.getItem('fontSize') || 15);
  }
  onChange() {
    localStorage.setItem('fontSize', this.fontSize.toString());
  }

  constructor(@Inject(DOCUMENT) private document: Document, ) {}



}
