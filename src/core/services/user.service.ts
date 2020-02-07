import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: "root" })
export class UserService {

	private apiKey: string = process.env.API_KEY || "";
	private apiURL: string = (process.env.API_URL || "").replace(/\/+$/, "");
	private httpHeaders = new HttpHeaders({ "api-key": this.apiKey });

	constructor(
		private http: HttpClient,
	) { }

	login(username: string, password: string): Observable<any> {
		return this.http.post(
			`${this.apiURL}/api/login`,
			{ username, password },
			{ headers: this.httpHeaders },
		);
	}

	logout(token: string): Observable<any> {
		return this.http.post(
			`${this.apiURL}/api/logout`,
			{ token },
			{ headers: this.httpHeaders },
		)
	}

	register(username: string, password: string): Observable<any> {
		return this.http.post(
			`${this.apiURL}/api/register`,
			{ username, password },
			{ headers: this.httpHeaders },
		);
	}

}
