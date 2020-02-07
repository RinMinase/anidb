import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: "root" })
export class ApiService {

	private apiURL: string = (process.env.API_URL || "").replace(/\/+$/, "");
	private httpHeaders: HttpHeaders;

	private currentBearerKey = new BehaviorSubject("");
	bearerKey = this.currentBearerKey.asObservable();

	constructor(
		private http: HttpClient,
	) { }

	get(url: string, params: object = {}): Observable<any> {
		const httpParams = new HttpParams();

		Object.keys(params).forEach((key) => {
			httpParams.append(key, params[key]);
		});

		const options: {headers?: HttpHeaders, params?: HttpParams} = {
			headers: this.httpHeaders,
		};

		if (Object.keys(params).length) {
			options.params = httpParams
		}

		return this.http.get(`${this.apiURL}/api/${url}`, {...options});
	}

	post(url: string, body: object): Observable<any> {
		return this.http.post(`${this.apiURL}/api/${url}`, {...body}, { headers: this.httpHeaders });
	}

	put(url: string, body: object): Observable<any> {
		return this.http.put(`${this.apiURL}/api/${url}`, {...body}, { headers: this.httpHeaders });
	}

	delete(url: string): Observable<any> {
		return this.http.delete(`${this.apiURL}/api/${url}`, { headers: this.httpHeaders });
	}

	/**
	 * Observable Subjects
	 */
	setBearerKey(state: string) {
		this.httpHeaders = new HttpHeaders({ token: state });
		this.currentBearerKey.next(state);
	}

}
