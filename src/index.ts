import {NgModule, ModuleWithProviders} from '@angular/core';
import {MapsManager} from "./services/maps-manager";
import {BaseGoogleMapsApiLoader} from "./loaders/base-google-maps-api-loader";
import {NoopGoogleMapsApiLoader} from "./loaders/noop-google-maps-api-loader";
import {GoogleMapComponent} from "./directives/google-map";
import {GoogleMapDirectionsDirective} from "./directives/google-map-directions";
import {GoogleMapMakerDirective} from "./directives/google-map-marker";
import {GoogleMapPolylineDirective} from "./directives/google-map-polyline";

export {
    BaseGoogleMapComponent,
    GoogleMapComponent,
    GoogleMapDirectionsDirective,
    GoogleMapMakerDirective,
    GoogleMapPolylineDirective,
    IOptionalSetMapMethod
} from './directives';
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
} from './services';

export {LoaderOptions} from './loaders/loader-options.interface';

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