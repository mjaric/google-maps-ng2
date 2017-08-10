/**
 * Created by mjaric on 9/28/16.
 */
import { Injectable, ElementRef } from '@angular/core';
// import {BaseGoogleMapsApiLoader} from '../loaders/base-google-maps-api-loader';
import { LazyGoogleMapsApiLoader } from '../loaders/lazy-google-maps-api-loader';

import { LongLat } from './long-lat.type';

const DefaultCoords: { latitude: number, longitude: number } = {
    latitude: 40.730610,
    longitude: -73.935242
};
const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
    zoom: 10,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false
};

function noop() {
}
/**
 * Service responsible to execute arbitrary functions in specific google map context
 */
@Injectable()
export class MapsManager {

    private _maps: Map<string, google.maps.Map> = new Map<string, google.maps.Map>();
    private _browserLocationPromise: Promise<{ latitude: number, longitude: number }>;

    constructor(private loader: LazyGoogleMapsApiLoader) {
        // check browser location
        this.getBrowserLocation()
            .then(noop);
        // preload map immediately
        this.loader
            .load()
            .then(noop);
    }

    onApiLoad(): Promise<void> {
        return this
            .loader
            .load();
    }

    createMarker(options?: google.maps.MarkerOptions): Promise<google.maps.Marker> {
        return this
            .loader
            .load()
            .then(() => new google.maps.Marker(options));
    }

    createDirections(options?: google.maps.DirectionsRendererOptions): Promise<google.maps.DirectionsRenderer> {
        return this.loader
            .load()
            .then(() => {
                return new google.maps.DirectionsRenderer(options);
            });
    }

    getDirections(origin: LongLat,
        destination: LongLat): Promise<google.maps.DirectionsResult> {
        return this
            .loader
            .load()
            .then(() => {
                let svc = new google.maps.DirectionsService();
                return new Promise<google.maps.DirectionsResult>((resolve, reject) => {
                    let request = {
                        origin: new google.maps.LatLng(
                            (<google.maps.LatLngLiteral>origin).lat || (<Coordinates>origin).latitude,
                            (<google.maps.LatLngLiteral>origin).lng || (<Coordinates>origin).longitude
                        ),
                        destination: new google.maps.LatLng(
                            (<google.maps.LatLngLiteral>destination).lat || (<Coordinates>destination).latitude,
                            (<google.maps.LatLngLiteral>destination).lng || (<Coordinates>destination).longitude
                        ),
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    svc.route(request, (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
                        if (status === google.maps.DirectionsStatus.OK) {
                            resolve(result);
                        } else {
                            console.error({ message: 'fail to get directions', status, result });
                            reject({ status, result });
                        }
                    });
                });
            });
    }

    createMap(el: HTMLElement, options?: google.maps.MapOptions): Promise<google.maps.Map> {
        return this.loader
            .load()
            .then(() => {
                return this.getBrowserLocation()
                    .then((coords: Coordinates) => {
                        options = Object.assign({}, options, DEFAULT_MAP_OPTIONS, {
                            center: new google.maps.LatLng(coords.latitude, coords.longitude),
                            zoom: 8
                        });
                        return new google.maps.Map(el, options);
                    });

            });
    }

    getMap(name: string): Promise<google.maps.Map> {
        return this.loader
            .load()
            .then(() => <google.maps.Map>this._maps.get(name));
    }

    addMap(name: string, map: google.maps.Map): void {
        this._maps.set(name, map);
    }

    removeMap(name: string): boolean {
        return this._maps.delete(name);
    }

    createAutocomplete(input: ElementRef,
        options: google.maps.places.AutocompleteOptions): Promise<google.maps.places.Autocomplete> {
        return this.loader.load().then(() => {
            return new google.maps.places.Autocomplete(input.nativeElement, options);
        });
    }

    getBrowserLocation(): Promise<Coordinates | { longitude: number, latitude: number }> {
        if (this._browserLocationPromise) {
            return (this._browserLocationPromise);
        }

        return this._browserLocationPromise = new Promise<{ latitude: number, longitude: number }>((resolve) => {
            if (location.protocol === 'https' && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (success: { coords: Coordinates, timestamp: number }) => {
                        resolve(success.coords);
                    }, (error) => {
                        console.error(error);
                        if (error.code !== PositionError.PERMISSION_DENIED) {
                            console.warn(`Permission is accepted but error encounter with message: ${error.message}`);
                        }
                        // if user didn't answer return default
                        resolve(DefaultCoords);
                    });
            } else {
                // if browser do not support location API return default (NYC)
                resolve(DefaultCoords);
            }
        });

    }

    calculateMapBounds(markers: Array<Coordinates> = []) {
        return this.loader.load().then(() => {
            return new Promise<google.maps.LatLngBounds>((resolve, reject) => {


                if (markers && markers.length > 1) {
                    let latLng = new google.maps.LatLng(markers[0].latitude, markers[0].longitude);
                    let bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds(latLng);
                    for (let i = 1; i < markers.length; i++) {
                        let marker = markers[i];
                        bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
                    }
                    resolve(bounds);
                    return;
                }
                reject({ error: 'There is no markers in markers array', centerTo: DefaultCoords });
                return;

            });
        });
    }
}
