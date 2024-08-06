import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

/**
 * https://juejin.cn/post/7295645152847986742
 * @param config
 */

function requestEnhancer(config: AxiosRequestConfig) {
  // 需要获取axios.defaults.adapter因为这个适配器是axios底层实现
  const adapter = axios.defaults.adapter;

  // 此处模拟需要获得ticket才可以没有满足的条件统一进入等待处理
  const hasTicket = false;

  const whiteList = ['/getTicket'];

  const request = (myConfig?: AxiosRequestConfig) => {
    // // 如果ticket是依赖后端处理的话，此处还需要配置一个请求白名单去获取ticket
    // // 否则获取ticket的请求将永远发不出去，一直等待get-ticket的返回
    // if (hasTicket || whiteList.includes(myConfig.url)) {
    //   return adapter(config);
    // } else {
    //   // 通过发布订阅模式监听ticket的返回
    //   bus.on('get-ticket', (ticket) => {
    //     // 可以重新配置axiosConfig，由于此处是等待某个字段满足请求
    //     // 一旦字段满足了请求就需要再调一次request方法使其真正调用adapter发起请求并进行处理
    //     // 此处就可以将ticket放到请求头
    //     // myConfig.headers['ticket'] = ticket
    //     request(myConfig);
    //   });
    // }
  };

  return request(config);
}
