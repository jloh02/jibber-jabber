export interface CookieAuthResult {
  cookie: string;
  RSOtoken: string;
  idToken: string;
}

export interface StoredRiotCookie extends CookieAuthResult {
  expire: number;
}
