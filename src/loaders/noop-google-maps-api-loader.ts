/**
 * Created by mjaric on 9/28/16.
 */
import {BaseGoogleMapsApiLoader} from './base-google-maps-api-loader';

export class NoopGoogleMapsApiLoader implements BaseGoogleMapsApiLoader {
    load(): Promise<void> {
        if (!(google && google.maps)) {
            return Promise.reject('Google Maps API not loaded on page. Make sure window.google.maps is available!');
        } else {
            return Promise.resolve();
        }
    }
}
