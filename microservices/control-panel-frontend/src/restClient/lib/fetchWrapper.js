// let fetch = {};
// let Headers = {};
// if (!window) {
// 	// fetch = import('node-fetch').default;
// 	// Headers = import('node-fetch').Headers;
// } else {
// 	fetch = window.fetch;
// 	Headers = window.Headers;
// }
class FetchWrap {
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
		return [...this._baseHeaders.entries()].reduce(
			(headersObj, [key, value]) => ({
				...headersObj,
				[key]: value,
			}),
			new BaseHeaders()
		);
	}

	get baseParams() {
		return new BaseParams(this._baseParams);
	}

	setBaseParams(argument) {
		if (typeof argument === 'function')
			this._baseParams = argument(this._baseParams, this._baseUrl);
		else if (typeof argument === 'object' && !(argument instanceof Array))
			this._baseParams = argument;
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

	setRequestHeaders(argument) {
		const parsedHeaders = this.parseHeaders(argument, this._requestHeaders);
		if (parsedHeaders) {
			this._requestHeaders = parsedHeaders;
			return this;
		} else return false;
	}

	get(url, getParamsObj = {}) {
		return this.getOrDelete('GET', url, getParamsObj);
	}

	post(url, body, getParamsObj = {}) {
		return this.patchOrPostOpts('POST', url, body, getParamsObj);
	}

	put(url, body, getParamsObj = {}) {
		return this.patchOrPostOpts('PUT', url, body, getParamsObj);
	}

	patch(url, body, getParamsObj = {}) {
		return this.patchOrPostOpts('PATCH', url, body, getParamsObj);
	}

	delete(url, getParamsObj = {}) {
		return this.getOrDelete('DELETE', url, getParamsObj);
	}

	async executeRequest(url, options = false) {
		try {
			const response =
				typeof options === 'object'
					? await fetch(url, options)
					: await fetch(url);
			if (!response.ok)
				throw new Error(
					'Something went wrong!\n' +
						JSON.stringify(await response.json())
				);
			return response;
		} catch (error) {
			console.log(error);
		} finally {
			this.setRequestHeaders(new Headers());
		}
	}

	patchOrPostOpts(method, url, body, getParamsObj) {
		const headers = this.mergeHeaders(
			this._baseHeaders,
			this._requestHeaders
		);
		url = this.urlHelper(url, getParamsObj);
		return this.executeRequest({
			method,
			headers,
			body: body,
		});
	}

	getOrDelete(method, url, getParamsObj) {
		const headers = this.mergeHeaders(
			this._baseHeaders,
			this._requestHeaders
		);
		url = this.urlHelper(url, getParamsObj);
		return this.executeRequest(url, {
			method,
			headers,
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

	parseHeaders(argument, currentHeaders = new Headers()) {
		if (typeof argument === 'function')
			return argument(currentHeaders, this._baseUrl);
		else if (typeof argument === 'object' && !(argument instanceof Array))
			if (argument instanceof Headers) return argument;
			else {
				return this.setOrAppendHeaders(currentHeaders, argument);
			}
		else return false;
	}

	setOrAppendHeaders(currentHeaders, appendHeaders) {
		if (!(appendHeaders instanceof Array))
			appendHeaders = Object.entries(appendHeaders);
		for (const [key, value] of appendHeaders) {
			if (currentHeaders.has(key)) currentHeaders.set(key, value);
			else currentHeaders.append(key, value);
		}
		return currentHeaders;
	}

	mergeHeaders(headers, moreHeaders, optionalAppend = {}) {
		const mergedHeaders =
			Object.keys(optionalAppend).length > 0
				? this.parseHeaders(optionalAppend)
				: new Headers();
		const allHeaders = [...headers.entries(), ...moreHeaders.entries()];
		return this.setOrAppendHeaders(mergedHeaders, allHeaders);
	}

	camelCaseToHeaderKey(headerKey) {
		const result =
			headerKey.charAt(0) +
			headerKey.slice(1).replace(/(?<!-)([A-Z])/g, '-$1');
		return result.charAt(0).toUpperCase() + result.slice(1);
	}
}

export { FetchWrap };

function BaseHeaders() {
	return this;
}

function BaseParams(params) {
	for (const [key, value] of Object.entries(params)) this[key] = value;
	return this;
}
