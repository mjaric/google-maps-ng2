import {NgModule, ModuleWithProviders, Provider, APP_INITIALIZER} from '@angular/core';
import {GOOGLE_MAPS_DIRECTIVES} from './directives';
import {GOOGLE_MAPS_PROVIDERS} from './services';
import {LoaderOptions, LAZY_LOADER_OPTIONS, LazyGoogleMapsApiLoader} from "./loaders/lazy-google-maps-api-loader";
import {MapsManager} from "./services/maps-manager";
import {BaseGoogleMapsApiLoader} from "./loaders/base-google-maps-api-loader";
import {NoopGoogleMapsApiLoader} from "./loaders/noop-google-maps-api-loader";

export * from './directives';
export * from './services';

export default {
  directives: [GOOGLE_MAPS_DIRECTIVES],
  providers: [GOOGLE_MAPS_PROVIDERS]
}

@NgModule({
  declarations: GOOGLE_MAPS_DIRECTIVES,
  exports: GOOGLE_MAPS_DIRECTIVES
})
export class GoogleMapsNg2Module {
  static forRoot(config?: LoaderOptions): ModuleWithProviders {

    let GoogleMapsModuleInitializer = {
      provide: APP_INITIALIZER,
      useFactory: (loader: BaseGoogleMapsApiLoader) => {
        return () => loader.load();
      },
      deps: [BaseGoogleMapsApiLoader],
      multi: true
    };

    const providers: Provider[] =
        [
          GoogleMapsModuleInitializer,
          {provide: MapsManager, useClass: MapsManager}
        ];
    if (config) {
      providers.push({provide: LAZY_LOADER_OPTIONS, useValue: config});
      providers.push({provide: BaseGoogleMapsApiLoader, useClass: LazyGoogleMapsApiLoader});
    } else {
      providers.push({provide: BaseGoogleMapsApiLoader, useClass: NoopGoogleMapsApiLoader});
    }
    return {
      ngModule: GoogleMapsNg2Module,
      providers: providers,
    };
  }
}