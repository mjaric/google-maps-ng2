import {NgModule, ModuleWithProviders} from '@angular/core';
import {MapsManager} from "./src/services/maps-manager";
import {BaseGoogleMapsApiLoader} from "./src/loaders/base-google-maps-api-loader";
import {NoopGoogleMapsApiLoader} from "./src/loaders/noop-google-maps-api-loader";
import {GoogleMapComponent} from "./src/directives/google-map";
import {GoogleMapDirectionsDirective} from "./src/directives/google-map-directions";
import {GoogleMapMakerDirective} from "./src/directives/google-map-marker";
import {GoogleMapPolylineDirective} from "./src/directives/google-map-polyline";

export {
    BaseGoogleMapComponent,
    GoogleMapComponent,
    GoogleMapDirectionsDirective,
    GoogleMapMakerDirective,
    GoogleMapPolylineDirective,
    IOptionalSetMapMethod
} from './src/directives';
export {
    BaseGoogleMapsApiLoader,
    LAZY_LOADER_OPTIONS,
    LazyGoogleMapsApiLoader,
    MapsManager,
    NoopGoogleMapsApiLoader,
    LongLat,
    Animation,
    IAnimation,
    ZoomLevel,
    IZoomLevel
} from './src/services';

export {LoaderOptions} from './src/loaders/loader-options.interface';

@NgModule({
    declarations: [
        GoogleMapComponent,
        GoogleMapDirectionsDirective,
        GoogleMapMakerDirective,
        GoogleMapPolylineDirective
    ],
    exports: [
        GoogleMapComponent,
        GoogleMapDirectionsDirective,
        GoogleMapMakerDirective,
        GoogleMapPolylineDirective
    ]
})
export class GoogleMapsNg2Module {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: GoogleMapsNg2Module,
            providers: [
                {provide: MapsManager, useClass: MapsManager},
                {provide: BaseGoogleMapsApiLoader, useClass: NoopGoogleMapsApiLoader}
            ],
        };
    }
}