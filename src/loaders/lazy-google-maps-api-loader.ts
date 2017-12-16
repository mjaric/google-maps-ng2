/**
 * Created by mjaric on 9/28/16.
 */
import {Injectable, Inject, InjectionToken} from '@angular/core';
import {BaseGoogleMapsApiLoader} from './base-google-maps-api-loader';
import {LoaderOptions} from "./loader-options.interface";
import {ScriptLoaderProtocol} from "./script-loader-protocol";





export const LAZY_LOADER_OPTIONS = new InjectionToken('_gmapsng2.LazyLoaderGoogleMapsApiOptions');
export const LOADER_OPTIONS_DEFAULT: LoaderOptions = {
    apiVersion: 3,
    protocol: ScriptLoaderProtocol.AUTO,
    hostAndPath: 'maps.googleapis.com/maps/api/js',
    libraries: []
};

@Injectable()
export class LazyGoogleMapsApiLoader extends BaseGoogleMapsApiLoader {
    private _options: LoaderOptions;
    private _promise: Promise<void>;

    constructor(@Inject(LAZY_LOADER_OPTIONS) options: LoaderOptions) {
        super();
        this._options = Object.assign({}, LOADER_OPTIONS_DEFAULT, options);
    }

    load(): Promise<void> {
        if (this._promise) {
            return this._promise;
        }
        return this._promise = this.createPromise();
    }

    private createPromise(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const callbackName = `_gmi${new Date().getTime()}`;

            (<any>window)[callbackName] = resolve;
            document.body.appendChild(this.createScript(callbackName, reject));
        });
    }

    private createScript(callbackName: string, onError: (error: Event) => void): HTMLScriptElement {
        let script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = this.createScriptUrl(callbackName);
        script.async = true;
        script.defer = true;
        script.onerror = onError;

        return script;
    }

    private createScriptUrl(callbackName: string): string {
        return `${this.getProtocol()}//${this._options.hostAndPath}${this.getQueryParams(callbackName)}`;
    }

    private getProtocol(): string {
        switch (this._options.protocol) {
            case ScriptLoaderProtocol.AUTO:
                return '';
            case ScriptLoaderProtocol.HTTP:
                return 'http:';
            // case ScriptLoaderProtocol.HTTPS:
            default:
                return 'https:';
        }
    }

    private getQueryParams(callbackName: string): string {
        const queryParams: { [k: string]: any } = {
            v: this._options.apiVersion,
            callback: callbackName
        };

        if (this._options.apiKey) {
            queryParams['key'] = this._options.apiKey;
        }

        if (this._options.libraries && this._options.libraries.length) {
            queryParams['libraries'] = this._options.libraries.join(',');
        }

        if (this._options.region) {
            queryParams['region'] = this._options.region;
        }

        if (this._options.language) {
            queryParams['language'] = this._options.language;
        }

        const params: string[] = [];

        Object.keys(queryParams)
            .forEach(key => {
                params.push(`${key}=${queryParams[key]}`);
            });

        return `?${params.join('&')}`;
    }
}
