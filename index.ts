import { Component, AfterViewInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

export class GoogleSignInSuccess {
  public googleUser: gapi.auth2.GoogleUser;

  constructor(googleUser: gapi.auth2.GoogleUser) {
    this.googleUser = googleUser;
  }
}

export class GoogleSignInFailure {
}

@Component({
  selector: 'google-signin',
  template: '<div [id]="id"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleSignInComponent implements AfterViewInit {
  private id: string = 'google-signin2';

  // Render options
  @Input() private scope: string;
  // Api Key
  @Input() private apiKey: string
  // Client Id
  @Input() private clientId: string
  // Array of API discovery doc URLs for APIs used by the quickstart 
  private discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];


  private _width: number;

  get width(): string {
    return this._width.toString();
  }

  @Input() set width(value: string) {
    this._width = Number(value);
  }

  private _height: number;

  get height(): string {
    return this._height.toString();
  }

  @Input() set height(value: string) {
    this._height = Number(value);
    gapi.load('', '');
  }

  private _longTitle: boolean;

  get longTitle(): string {
    return this._longTitle.toString();
  }

  @Input() set longTitle(value: string) {
    this._longTitle = Boolean(value);
  }

  @Input() private theme: string;

  // Init params
  @Input() private clientId: string;
  @Input() private cookiePolicy: string;

  private _fetchBasicProfile: boolean;

  get fetchBasicProfile(): string {
    return this._fetchBasicProfile.toString();
  }

  @Input() set fetchBasicProfile(s: string) {
    this._fetchBasicProfile = Boolean(s);
  }

  @Input() private hostedDomain: string;
  @Input() private openidRealm: string;

  @Output() googleSignInSuccess: EventEmitter<GoogleSignInSuccess> = new EventEmitter<GoogleSignInSuccess>();

  @Output() googleSignInFailure: EventEmitter<GoogleSignInFailure> = new EventEmitter<GoogleSignInFailure>();

  ngAfterViewInit() {
    this.libInit();
    this.renderButton();
  }

  private libInit() {
    if (this.clientId == null)
      throw new Error(
        'clientId property is necessary. (<google-signin [clientId]="..."></google-signin>)');

    gapi.load('client:auth2', this.initClient)
  }
  private initClient() {
    gapi.client.init({
      apiKey: this.apiKey,
      clientId: this.clientId,
      hosted_domain: this.hostedDomain,
      discoveryDocs: this.discoveryDocs,
      scope: this.scope

    });
  }
  private handleFailure() {
    this.googleSignInFailure.next(new GoogleSignInFailure());
  }

  private handleSuccess(googleUser: gapi.auth2.GoogleUser) {
    this.googleSignInSuccess.next(new GoogleSignInSuccess(googleUser));
    gapi.client.people.people.connections.list({
      'resourceName': 'people/me',
      'pageSize': 10,
      'personFields': 'names,emailAddresses',
    }).then(function (response) {
      var connections = response.result.connections;
      console.log(response)
    });

  }

  private renderButton() {
    gapi.signin2.render(
      this.id, {
        scope: this.scope,
        width: this._width,
        height: this._height,
        longtitle: this._longTitle,
        theme: this.theme,
        onsuccess: (googleUser: gapi.auth2.GoogleUser) => this.handleSuccess(googleUser),
        onfailure: () => this.handleFailure()
      });
  }
}
