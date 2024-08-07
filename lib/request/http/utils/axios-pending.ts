import axios, { type Canceler } from 'axios';
import type { IHttpRequestConfig } from '@lib/request/http/types/http-request';

export const axiosCancelCallback = (
  config: IHttpRequestConfig,
  requestQueue: Map<string, Canceler>,
  token: string,
) => {
  const CancelToken = axios.CancelToken;
  const abortController = CancelToken.source();
  config['cancelToken'] = abortController.token;

  // const message = `请求重复: ${token}, 请求已被取消( 可以通过 abortAble: false 禁用 )`;
  // abortController.cancel(message, config);
  // console.log(message);

  if (requestQueue.has(token)) {
    const message = `请求重复: ${token}, 请求已被取消( 可以通过 abortAble: false 禁用 )`;
    abortController.cancel(message, config);
    console.log(message);
  } else {
    requestQueue.set(token, abortController.cancel);
  }
};
