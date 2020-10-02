import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cv-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  // Anti crawlers
  get phone(): string {
    let num = '0';
    let d = 4;
    num += (d--).toString();
    num += d.toString();
    num += d.toString();
    num += ' ';

    d = 7;
    num += (d++).toString();
    num += (d--).toString();
    num += (d).toString();
    num += ' ';

    d = 2;
    num += (d).toString();
    num += (d + 6).toString();
    num += (d).toString();
    return num;
  }


  get email(): string {
    let s = 'sy';
    s += 'fool';
    s += '@';
    s += 'hot';
    s += 'mail';
    s += '.';
    s += 'com';
    return s;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
