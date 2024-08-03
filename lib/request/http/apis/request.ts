import HttpRequest from '@lib/request/http/http-request';
import axios from 'axios';

const httpRequest = new HttpRequest({
  baseURL: "/api"
}, axios.create);

export default httpRequest;
