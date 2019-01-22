import { LoaderOptions } from './src/loaders/loader-options.interface';
import {
    LazyGoogleMapsApiLoader,
    LAZY_LOADER_OPTIONS
} from './src/loaders/lazy-google-maps-api-loader';
import { APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { MapsManager } from './src/services/maps-manager';
import { GoogleMapComponent } from './src/directives/google-map';
import { GoogleMapDirectionsDirective } from './src/directives/google-map-directions';
import { GoogleMapMakerDirective } from './src/directives/google-map-marker';
import { GoogleMapPolylineDirective } from './src/directives/google-map-polyline';
export { LoaderOptions } from './src/loaders/loader-options.interface';

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

/**
 * Factory function which builds handler for application initialization
 * @param loader instance of loader, should be passed as dependency
 * @returns {()=>Promise<any>} function is executed by angular application initializer
 * @constructor
 */
export function MapsApiLoaderFactory(loader: LazyGoogleMapsApiLoader) {
    return goLoad;

    function goLoad(): Promise<any> {
        return loader.load();
    }
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
    /**
     * Used to register in top level or shared module in your application. Loader Options are mandatory.
     * {@expample
     *  import {NgModule} from '@angular/core';
     *
     *  @NgModule({
     *      declarations: [...],
     *      imports: [
     *          ...
     *          GoogleMapsNg2Module.forRoot(<LoaderOptions>{
     *              apiKey: "your google maps API key
     *              libraries: ["places", "geometry"]
     *          }),
     *          ...
     *     ],
     *     // optional, you can import module like below if your module depends only on component and directives
     *     exports: [
     *      GoogleMapsNg2Module
     *     ]
     *  })
     *  export class MySharedModule { }
     * }
     *
     * @param loaderOptions
     * @returns {ModuleWithProviders}
     */
    static forRoot(loaderOptions: LoaderOptions): ModuleWithProviders {
        return {
            ngModule: GoogleMapsNg2Module,
            providers: [
                {
                    provide: LAZY_LOADER_OPTIONS,
                    useValue: loaderOptions
                },
                LazyGoogleMapsApiLoader,
                {
                    provide: APP_INITIALIZER,
                    useFactory: MapsApiLoaderFactory,
                    deps: [LazyGoogleMapsApiLoader],
                    multi: true
                },
                { provide: MapsManager, useClass: MapsManager }
            ]
        };
    }
}
