import { PagesManagerService } from 'src/app/service/pages-manager.service';
import { WebPage } from './../model/page.model';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService implements OnDestroy {
  pageNumber: number = 1;
  updateSections = new Subject<number>();
  searchInput = '';
  getReqCounter = 0;

  nothingToDisplay = false;

  subscribe1: Subscription;
  subscribe2: Subscription;
  subscribe3: Subscription;
  subscribe4: Subscription;

  pageLimitChanged = new Subject<number>();
  pageLimit = '3';

  constructor(private http: HttpClient, private authService: AuthService) {}

  onSearchWithParams(url: string) {
    return this.http.get<WebPage[]>(
      'https://yootta-server.herokuapp.com/ricerca?q=' + url
    );
  }

  determineSections() {
    this.http
      .get<WebPage[]>(
        'https://yootta-server.herokuapp.com/ricerca?q=' + this.searchInput
      )
      .subscribe((response) => {
        if (response.length > 30) {
          this.getReqCounter = 10;
          this.updateSections.next(this.getReqCounter);
          this.nothingToDisplay = false;
        } else {
          this.getReqCounter = Math.ceil(response.length / +this.pageLimit);
          this.updateSections.next(this.getReqCounter);
          this.nothingToDisplay = false;
          if (response.length === 0) {
            this.nothingToDisplay = true;
          }
        }
      });
  }

  searchPage() {
    let section = this.pageNumber.toString();
    return this.http.get<WebPage[]>(
      'https://yootta-server.herokuapp.com/ricerca?q=' +
        this.searchInput +
        '&_page=' +
        section +
        '&_limit=' +
        this.pageLimit
    );
  }

  updatePage(webPage: WebPage) {
    this.http
      .put(
        'https://yootta-server.herokuapp.com/ricerca/' + webPage.id,
        webPage,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.authService.accessToken,
          }),
        }
      )
      .subscribe((response) => {});
  }

  postPage(webSite: WebPage) {
    return this.http.post<WebPage>(
      'https://yootta-server.herokuapp.com/ricerca',
      webSite,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.authService.accessToken,
        }),
      }
    );
  }

  deletePage(idPage: number) {
    return this.http.delete(
      'https://yootta-server.herokuapp.com/ricerca/' + idPage,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.authService.accessToken,
        }),
      }
    );
  }

  compareNewPage(url: string) {
    return this.http.get<WebPage[]>(
      'https://yootta-server.herokuapp.com/ricerca?url=' + url
    );
  }

  ngOnDestroy(): void {
    this.subscribe1.unsubscribe();
    this.subscribe2.unsubscribe();
    this.subscribe3.unsubscribe();
    this.subscribe4.unsubscribe();
  }
}
