// Import all services
import {MapsManager} from './services/maps-manager';
import {BaseGoogleMapsApiLoader} from './loaders/base-google-maps-api-loader';
import {
  LazyGoogleMapsApiLoader,
  LAZY_LOADER_OPTIONS,
} from './loaders/lazy-google-maps-api-loader';
import {NoopGoogleMapsApiLoader} from "./loaders/noop-google-maps-api-loader";

// Export all services
export {MapsManager, LongLat} from './services/maps-manager';

export interface IZoomLevel {
  World: number,
  Continent: number,
  City: number,
  Streets: number,
  Buildings: number
}

/**
 * The following list shows the approximate level of detail
 * you can expect to see at each zoom level
 */
export const ZoomLevel: IZoomLevel = {
  World: 1,
  Continent: 5,
  City: 10,
  Streets: 15,
  Buildings: 20
};

export interface IAnimation {
  BOUNCE: number,
  DROP: number
}

/**
 * Animations that can be played on a marker.
 * @see https://developers.google.com/maps/documentation/javascript/reference?hl=ru#Animation
 */
export const Animation: IAnimation = {
  /**
   * Marker bounces until animation is stopped.
   */
  BOUNCE:1,
  /**
   * Marker falls from the top of the map ending with a small bounce.
   */
  DROP: 2
};

export {BaseGoogleMapsApiLoader, LazyGoogleMapsApiLoader, LAZY_LOADER_OPTIONS};
export {NoopGoogleMapsApiLoader} from './loaders/noop-google-maps-api-loader';



