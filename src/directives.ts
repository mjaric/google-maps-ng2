// Import all directives
import {GoogleMapComponent} from './directives/google-map';
import {GoogleMapDirectionsDirective} from './directives/google-map-directions';
import {GoogleMapMakerDirective} from './directives/google-map-marker';
import {GoogleMapPolylineDirective} from './directives/google-map-polyline';
// Export all directives
export * from './directives/base-google-map-component';
export * from './directives/google-map';
export * from './directives/google-map-directions';
export * from './directives/google-map-marker';
export * from './directives/google-map-polyline';

// Export convenience property
export const GOOGLE_MAPS_DIRECTIVES: any[] = [
    GoogleMapComponent,
    GoogleMapDirectionsDirective,
    GoogleMapMakerDirective,
    GoogleMapPolylineDirective
];
