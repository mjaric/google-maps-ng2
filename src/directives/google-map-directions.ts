/**
 * Created by mjaric on 9/30/16.
 */
import {Directive, Input, Output, OnInit, OnDestroy, EventEmitter, forwardRef} from '@angular/core';
import {MapsManager} from '../services/maps-manager';
import {BaseGoogleMapComponent} from './base-google-map-component';


@Directive({
    selector: 'google-map-directions',
    providers: [{provide: BaseGoogleMapComponent, useExisting: forwardRef(() => GoogleMapDirectionsDirective)}]
})
export class GoogleMapDirectionsDirective extends BaseGoogleMapComponent<google.maps.DirectionsRenderer> implements OnInit, OnDestroy {

    private _routeColor: string = '#ff9702';


    private _origin: any;
    private _destination: any;

    /**
     * Origin of directions
     * @param value can be google.maps.LatLngLiteral or Coordinates  or {latitude: number, longitude: number}
     */
    @Input()
    set origin(value: google.maps.LatLngLiteral | Coordinates | { latitude: number, longitude: number }) {
        if (this._origin !== value) {
            this._origin = value;
            if (this._destination) {
                this._mapsManager
                    .getDirections(this._origin, this._destination)
                    .then(directions => {
                        this.proxy
                            .then(renderer => {
                                renderer.setDirections(directions);
                            });
                    });
            }
        }
    }

    /**
     * Destination of directions
     * @param value can be google.maps.LatLngLiteral or Coordinates  or {latitude: number, longitude: number}
     */
    @Input()
    set destination(value: google.maps.LatLngLiteral | Coordinates | { latitude: number, longitude: number }) {
        if (this._destination !== value) {
            this._destination = value;
            if (this._origin) {
                this._mapsManager
                    .getDirections(this._origin, this._destination)
                    .then(directions => {
                        this.proxy
                            .then(renderer => {
                                renderer.setDirections(directions);
                            });
                    });
            }
        }
    }

    /**
     * Sets the color of rendered polygonal line as route in map view
     * @param value is as string e.g. '#ff9702'. Default value is '#ff9702'
     */
    @Input()
    set routeColor(value: string) {
        this._routeColor = value || '#ff9702';
        this.proxy.then(directions => {
            directions.setOptions(this.getOptions());
        });
    }

    /**
     * This event is fired when the directions route changes.
     */
    @Output()
    directions_changed: EventEmitter<void> = new EventEmitter<void>();
    /**
     * By default, the input map is centered and zoomed to the bounding box of this set of directions.
     * If this option is set to true, the viewport is left unchanged, unless the map's center and zoom were never set.
     * @type {boolean}
     */
    @Input()
    public preserveViewport: boolean = true;

    constructor(private _mapsManager: MapsManager) {
        super();
    }

    /*
     * Internal logic
     * **********************************************************
     */


    ngOnInit(): void {
        this._mapsManager
            .createDirections()
            .then(directionsRenderer => {
                this.bindEvents(directionsRenderer);
                this.proxyResolver(directionsRenderer);
            });
    }

    ngOnDestroy(): void {
        this.proxy.then(directions => {
            google.maps.event.clearInstanceListeners(directions);
            directions.setMap(null);
        });
    }

    private bindEvents(directions: google.maps.DirectionsRenderer) {
        directions.addListener('directions_changed', (e) => this.directions_changed.emit(e));
    }

    private getOptions(): google.maps.DirectionsRendererOptions {
        return {
            preserveViewport: this.preserveViewport,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: this._routeColor
            }
        };
    }
}
