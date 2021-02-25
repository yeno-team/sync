import { Agent } from "https";

export type RequestOptions = {
    url?: string,
    method?: string,
    baseURL?: string,
    headers?: { name: string, value: string },
    params?: { name: string, value: any },
    body?: { name: string, value: any },
    CORS?: boolean,
    maxRedirects?: number,
    httpAgent?: Agent,
    httpsAgent?: Agent,
    proxy?: { host: string, port: number, auth: object}
}

export interface IRequestModule {
    request<R>(options: RequestOptions): Promise<R>;
}