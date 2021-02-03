import { FetchWrap } from './fetchWrapper';

class RestClient extends FetchWrap {
  async executeRequest(...args) {
    return (await super.executeRequest(...args)).json();
  }

  patchOrPostOpts(method, url, body, getParamsObj) {
    const headers = this.mergeHeaders(
      this._baseHeaders,
      this._requestHeaders,
      {
        'Content-Type': 'application/json',
      }
    );
    url = this.urlHelper(url, getParamsObj);
    return super.executeRequest(url, {
      method,
      headers,
      body: JSON.stringify({ ...body }),
    });
  }
}

const rest = new RestClient();

export { RestClient, rest };