import type { HttpRequestConfig } from '@lib/request/http/http-request';
import axios, { type Canceler } from 'axios';

export const axiosCancelCallback = (
  config: HttpRequestConfig,
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
