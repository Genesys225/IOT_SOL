export default class FetchWrap {
	constructor(baseUrl = '', baseHeaders = {}, baseParams = {}) {
		this._baseUrl = baseUrl;
		this._baseHeaders = baseHeaders;
		this._baseParams = baseParams;
	}

	get baseUrl() {
		return this._baseUrl;
	}

	get baseHeaders() {
		return this._baseHeaders;
	}

	setBaseParams(setParams) {
		if (typeof setParams === 'function')
			this._baseParams = setParams(this._baseParams, this._baseUrl);
		else if (typeof setParams === 'object') this._baseParams = setParams;
		else return false;
		return this;
	}

	setBaseHeaders(setHeaders) {
		if (typeof setHeaders === 'function')
			this._baseHeaders = setHeaders(this._baseHeaders, this._baseUrl);
		else if (typeof setHeaders === 'object') this._baseHeaders = setHeaders;
		else return false;
		return this;
	}

	get(url, getParamsObj = {}) {
		url = this.urlHelper(url, getParamsObj);
		return this.handleRequest(url, {
			headers: this._baseHeaders,
		});
	}

	post(url, body, getParamsObj = {}) {
		url = this.urlHelper(url, getParamsObj);
		return this.handleRequest(url, this.patchOrPost('POST', body));
	}

	patch(url, body, getParamsObj = {}) {
		url = this.urlHelper(url, getParamsObj);
		return this.handleRequest(url, this.patchOrPost('PATCH', body));
	}

	delete(url, getParamsObj = {}) {
		url = this.urlHelper(url, getParamsObj);
		return this.handleRequest(url, {
			method: 'DELETE',
			headers: this._baseHeaders,
		});
	}

	urlHelper(url, getParamsObj = {}) {
		url = url.match(/^http/) ? url : this._baseUrl + url;
		const params = { ...this._baseParams, ...getParamsObj };
		const paramsKeys = Object.keys(params);
		if (paramsKeys.length > 0) {
			const paramsQuery = paramsKeys.reduce((paramsQuery, paramKey) => {
				paramsQuery !== '?' && (paramsQuery += '&');
				return (paramsQuery +=
					paramKey + '=' + encodeURIComponent(params[paramKey]));
			}, '?');
			return url + paramsQuery;
		}
		return url;
	}

	setAuthToken(token) {
		this.setBaseHeaders({ Authorization: token });
		return this;
	}

	async handleRequest(url, options = null) {
		try {
			const response = options
				? await fetch(url, options)
				: await fetch(url);
			if (!response.ok)
				throw new Error(
					'Something went wrong!\n' +
						JSON.stringify(await response.json())
				);
			return response.json();
		} catch (error) {
			console.log(error);
		}
	}

	patchOrPost(method, body) {
		return {
			method,
			headers: {
				...this._baseHeaders,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ...body }),
		};
	}
}

export const rest = new FetchWrap();
