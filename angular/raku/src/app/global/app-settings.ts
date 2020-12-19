export class AppSettings {
  public static BASE_URL = "http://localhost:6789";
  public static COOKIE_TOKEN_NAME = "RakuToken";
  public static COOKIE_TOKEN_EXPIRE_TIME = 864000000; // second
  public static ENDPOINT = "http://localhost:9876";
  public static OAUTH2_REDIRECT_URI = "http://localhost:6789/oauth2/redirect";
  public static GOOGLE_AUTH_URL = encodeURI(AppSettings.ENDPOINT + "/oauth2/authorize/google?redirect_uri=" + AppSettings.OAUTH2_REDIRECT_URI);
  public static FACEBOOK_AUTH_URL = encodeURI(AppSettings.ENDPOINT + '/oauth2/authorize/facebook?redirect_uri=' + AppSettings.OAUTH2_REDIRECT_URI);
}
