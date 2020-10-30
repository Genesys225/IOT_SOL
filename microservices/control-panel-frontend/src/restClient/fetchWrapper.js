export default class FetchWrap {
	constructor(baseUrl = '', baseHeaders = new Headers(), baseParams = {}) {
		this._baseUrl = baseUrl;
		this._baseHeaders = this.parseHeaders(baseHeaders);
		this._baseParams = baseParams;
		this._requestHeaders = new Headers();
	}

	get baseUrl() {
		return this._baseUrl;
	}

	get baseHeaders() {
		return this._baseHeaders;
	}

	setBaseParams(argument) {
		if (typeof argument === 'function')
			this._baseParams = argument(this._baseParams, this._baseUrl);
		else if (typeof argument === 'object') this._baseParams = argument;
		else return false;
		return this;
	}

	setBaseHeaders(argument) {
		const parsedHeaders = this.parseHeaders(argument, this._baseHeaders);
		if (parsedHeaders) {
			this._baseHeaders = parsedHeaders;
			return this;
		} else return false;
	}

	setHeaders(argument) {
		const parsedHeaders = this.parseHeaders(argument, this._requestHeaders);
		if (parsedHeaders) {
			this._requestHeaders = parsedHeaders;
			return this;
		} else return false;
	}

	parseHeaders(argument, currentHeaders = new Headers()) {
		if (typeof argument === 'function')
			return argument(currentHeaders, this._baseUrl);
		else if (typeof argument === 'object')
			if (argument instanceof Headers) return argument;
			else {
				const newHeaders = new Headers();
				for (let key in argument) {
					newHeaders.append(
						this.camelCaseToHeaderKey(key),
						argument[key]
					);
				}
				return newHeaders;
			}
		else return false;
	}

	get(url, getParamsObj = {}) {
		url = this.urlHelper(url, getParamsObj);
		return this.executeRequest(url, {
			headers: this._baseHeaders,
		});
	}

	post(url, body, getParamsObj = {}) {
		url = this.urlHelper(url, getParamsObj);
		return this.executeRequest(url, this.patchOrPostOpts('POST', body));
	}

	patch(url, body, getParamsObj = {}) {
		url = this.urlHelper(url, getParamsObj);
		return this.executeRequest(url, this.patchOrPostOpts('PATCH', body));
	}

	delete(url, getParamsObj = {}) {
		url = this.urlHelper(url, getParamsObj);
		return this.executeRequest(url, {
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
		this.setBaseHeaders((baseHeaders) => {
			if (baseHeaders.get('Authorization'))
				baseHeaders.set('Authorization', token);
			else 
				baseHeaders.append({Authorization: token})
			return baseHeaders;
		});
		return this;
	}

	async executeRequest(url, options = null) {
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
		} finally {
			this.setHeaders(new Headers());
		}
	}

	patchOrPostOpts(method, body) {
		const headers = new Headers({ 'Content-Type': 'application/json' });
		[
			...this._baseHeaders.entries(),
			...this._requestHeaders.entries(),
		].forEach((keyValueTuple) => {
			if (headers.has(keyValueTuple[0]))
				headers.set(keyValueTuple[0], keyValueTuple[1]);
			else headers.append(keyValueTuple[0], keyValueTuple[1]);
		});
		return {
			method,
			headers,
			body: JSON.stringify({ ...body }),
		};
	}

	camelCaseToHeaderKey(headerKey) {
		if (/^[a-z][A-Za-z]*$/.test(headerKey)) {
			const result = headerKey.replace(/([A-Z])/g, '-$1');
			return result.charAt(0).toUpperCase() + result.slice(1);
		} else return headerKey;
	}
}

export const rest = new FetchWrap();
