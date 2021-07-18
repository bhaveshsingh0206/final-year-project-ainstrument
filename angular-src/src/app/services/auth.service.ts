import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { environment } from "../../environments/environment";
import { tokenNotExpired } from "angular2-jwt";
const BASE_URL = environment.backendUrl;

@Injectable()
export class AuthService {
  private authToken: string;
  private user: string;

  private apiUrl: string = `${BASE_URL}/v1`;

  constructor(public http: HttpClient) {}

  registerUser(user): any {
    let url: string = this.apiUrl + "/create-user";

    // prepare the request
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    let options = { headers: headers };
    let reqBody = user;

    // POST
    let observableReq = this.http
      .post(url, reqBody, options)
      .map(this.extractData);

    return observableReq;
  }

  postFile(data): any {
    let url: string = this.apiUrl + "/extractVocal";
    let reqBody = data;
    let headers = new HttpHeaders({ auth: this.authToken });
    let options = { headers: headers };
    // POST
    let observableReq = this.http
      .post(url, reqBody, options)
      .map(this.extractData);

    console.log(observableReq);

    return observableReq;
  }

  authenticateUser(user): any {
    let url: string = this.apiUrl + "/signin-user";

    // prepare the request
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    let options = { headers: headers };
    let reqBody = user;

    // POST
    let observableReq = this.http
      .post(url, reqBody, options)
      .map(this.extractData);

    console.log(observableReq);

    return observableReq;
  }

  getProfile(): any {
    let url: string = this.apiUrl + "/getProfileDetails";
    this.loadCredentials();

    // prepare the request
    console.log(this.authToken);
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      auth: this.authToken,
    });
    let options = { headers: headers };

    // POST
    let observableReq = this.http.get(url, options).map(this.extractData);

    return observableReq;
  }

  storeUserData(token, user): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getUserData(): any {
    this.loadCredentials();
    let jUser = JSON.parse(this.user);
    let jData = { token: this.authToken, user: jUser };

    return jData;
  }

  loadCredentials(): void {
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    this.authToken = token;
    this.user = user;
  }

  loggedIn(): boolean {
    this.loadCredentials();
    return tokenNotExpired();
  }

  logout(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  extractData(res: Response): any {
    let body = res;
    return body || {};
  }
}
