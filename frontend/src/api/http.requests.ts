import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

export interface HttpOptions {
    bearerToken?: string;
    contentType?: string;
    customHeaders?: Record<string, string>;
    timeout?: number;
    baseURL?: string;
}

const buildHeaders = (options: HttpOptions = {}): Record<string, string> => {
    const headers: Record<string, string> = {};

    // Content-Type por defecto o personalizado
    if (options.contentType) {
        headers['Content-Type'] = options.contentType;
    } else {
        headers['Content-Type'] = 'application/json';
    }

    // Bearer token solo si se proporciona y no está vacío
    if (options.bearerToken && options.bearerToken.trim() !== '') {
        headers['Authorization'] = `Bearer ${options.bearerToken}`;
    }

    // Headers personalizados adicionales
    if (options.customHeaders) {
        Object.assign(headers, options.customHeaders);
    }

    return headers;
};

// Cliente HTTP GET personalizado
export const httpGet = async <T = any>(
    url: string,
    options: HttpOptions = {}
): Promise<T> => {
    try {
        const config: AxiosRequestConfig = {
            headers: buildHeaders(options),
            timeout: options.timeout || 10000, // 10 segundos por defecto
        };

        // Base URL si se proporciona
        if (options.baseURL) {
            config.baseURL = options.baseURL;
        }
        // console.log(url, config);
        const response: AxiosResponse<T> = await axios.get(url, config);

        return response.data;
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
};

export class HttpClient {
    private defaultToken?: string;

    constructor(defaultToken?: string) {
        this.defaultToken = defaultToken;
    }

    get<T = any>(url: string, options: Omit<HttpOptions, 'baseURL'> = {}): Promise<T> {
        return httpGet<T>(url, {
            ...options,
            bearerToken: options.bearerToken || this.defaultToken
        });
    }
}