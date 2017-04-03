
import {GOOGLE_MAPS_DIRECTIVES} from './directives';
import {GOOGLE_MAPS_PROVIDERS} from './services';

export * from './directives';
export * from './services';

export {LoaderOptions} from './loaders/lazy-google-maps-api-loader';

export default {
  directives: [GOOGLE_MAPS_DIRECTIVES],
  providers: [GOOGLE_MAPS_PROVIDERS]
}

export {GoogleMapsNg2Module} from './module';