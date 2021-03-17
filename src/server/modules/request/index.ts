import { AxiosRequestModule } from "./axios";
import http from 'http';
import https from 'https';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const RequestModule = new AxiosRequestModule({
    httpsAgent
});

export default RequestModule;