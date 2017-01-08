// Import all services
import {MapsManager} from './services/maps-manager';
import {BaseGoogleMapsApiLoader} from './loaders/base-google-maps-api-loader';
import {
  LazyGoogleMapsApiLoader,
  LAZY_LOADER_OPTIONS,
  LOADER_OPTIONS_DEFAULT
} from './loaders/lazy-google-maps-api-loader';
import {NoopGoogleMapsApiLoader} from "./loaders/noop-google-maps-api-loader";

// Export all services
export * from './services/maps-manager';


/**
 * The following list shows the approximate level of detail
 * you can expect to see at each zoom level
 */
export enum ZoomLevel {
  World = 1,
  Continent = 5,
  City = 10,
  Streets = 15,
  Buildings = 20
}

/**
 * Animations that can be played on a marker.
 * @see https://developers.google.com/maps/documentation/javascript/reference?hl=ru#Animation
 */
export enum Animation {
  /**
   * Marker bounces until animation is stopped.
   */
  BOUNCE = 1,

      /**
       * Marker falls from the top of the map ending with a small bounce.
       */
  DROP = 2
}

export {BaseGoogleMapsApiLoader, LazyGoogleMapsApiLoader, LAZY_LOADER_OPTIONS};
export {NoopGoogleMapsApiLoader} from './loaders/noop-google-maps-api-loader';

export const GOOGLE_MAPS_PROVIDERS: any[] = [
  {provide: LAZY_LOADER_OPTIONS, useValue: LOADER_OPTIONS_DEFAULT},
  {provide: BaseGoogleMapsApiLoader, useClass: LazyGoogleMapsApiLoader},
  {provide: MapsManager, useClass: MapsManager}
];


