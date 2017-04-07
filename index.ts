import {LoaderOptions} from './src/loaders/loader-options.interface';
import {LazyGoogleMapsApiLoader, LAZY_LOADER_OPTIONS} from './src/loaders/lazy-google-maps-api-loader';
import {APP_INITIALIZER, Provider,  NgModule,   ModuleWithProviders} from '@angular/core';
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


export function MapsApiLoaderFactory(loader: BaseGoogleMapsApiLoader) {
  console.info("INITI");
  return loader.load();
}

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
    static forRoot(loaderOptions: LoaderOptions): ModuleWithProviders {
        return {
            ngModule: GoogleMapsNg2Module,
            providers: [
        
                {
                    provide: LAZY_LOADER_OPTIONS,
                    useValue: loaderOptions
                },{
                    provide: BaseGoogleMapsApiLoader,
                    useClass: LazyGoogleMapsApiLoader
                }, {
                    provide: APP_INITIALIZER,
                    useFactory: MapsApiLoaderFactory,
                    deps: [BaseGoogleMapsApiLoader],
                    multi: true
                },
                {provide: MapsManager, useClass: MapsManager}
            ]
        };
    }
}