import { WebPage } from './../../model/page.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-single-page',
  templateUrl: './client-single-page.component.html',
  styleUrls: ['./client-single-page.component.css'],
})
export class ClientSinglePageComponent implements OnInit {
  @Input() page: WebPage;

  constructor() {}

  ngOnInit(): void {}
}
