export class TokenManager {
  private static instance: TokenManager
  private fetchingNewToken: boolean = false
  private tokenUpdated: boolean = false

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  public isFetchingNewToken(): boolean {
    return this.fetchingNewToken
  }

  public isTokenUpdated(): boolean {
    return this.tokenUpdated
  }

  public setFetchingNewToken(value: boolean): void {
    this.fetchingNewToken = value
  }

  public setTokenUpdated(value: boolean): void {
    this.tokenUpdated = value
  }
}
