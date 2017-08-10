/**
 * Created by mjaric on 9/28/16.
 */
import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    AfterContentInit,
    forwardRef,
    ElementRef,
    QueryList,
    Attribute, ContentChildren
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {MapsManager} from '../services/maps-manager';
import {BaseGoogleMapComponent} from './base-google-map-component';
import {IOptionalSetMapMethod} from './optional-set-map-method.interface';


@Component({
    selector: 'google-map',
    template: `
        <div class="google-map-container" style="width: inherit; height: inherit"></div>
        <ng-content></ng-content>
    `
})
export class GoogleMapComponent implements OnDestroy, OnInit, AfterContentInit {
    static counters = 0;

    private _id: number;
    private _map: Promise<google.maps.Map>;
    private _mapResolver: (map: google.maps.Map) => void;
    private _mapBackgroundColor: string;

    private _mapComponentsSubscriptions: Subscription;

    @ContentChildren(forwardRef(() => BaseGoogleMapComponent), {})
    public mapComponents: QueryList<BaseGoogleMapComponent<IOptionalSetMapMethod>>;

    /**
     * Should map auto resize bounds to current set of markers
     * @type {boolean} default is true
     */
    @Input()
    public autoFitMarkers: boolean = true;

    constructor(@Attribute('name')
                private _name: string,
                private _elem: ElementRef,
                private _mapsManager: MapsManager) {

        this._id = GoogleMapComponent.counters++;
        this._map = new Promise(resolve => this._mapResolver = resolve);
    }

    getMap(): Promise<google.maps.Map> {
        return this._map;
    }

    /**
     * Color used for the background of the Map div.
     * This color will be visible when tiles have not yet loaded as the user pans.
     * Note: This option can only be set when the map is initialized.
     */
    @Input()
    set backgroundColor(value: string) {
        if (this._mapBackgroundColor) {
            console.warn('Option "backgroundColor" can only be set when the map is initialized');
            return;
        }

        this._mapBackgroundColor = value;
    }

    /**
     * The initial Map center. Required.
     */
    @Input()
    set center(value: google.maps.LatLngLiteral | Coordinates | { latitude: number, longitude: number }) {
        this._map.then(map => {
            if (value) {
                map.setCenter({
                    lat: (<google.maps.LatLngLiteral>value).lat || (<Coordinates>value).latitude,
                    lng: (<google.maps.LatLngLiteral>value).lng || (<Coordinates>value).longitude
                });
            }

        });
    }


    /**
     * Enables/disables zoom and center on double click. Enabled by default.
     */
    @Input()
    set disableDoubleClickZoom(mode: boolean) {
        this._map.then(map => map.setOptions({disableDoubleClickZoom: mode}));
    }

    /**
     * If false, prevents the map from being dragged.
     * Dragging is enabled by default.
     */
    @Input()
    set draggable(mode: boolean) {
        this._map.then(map => map.setOptions({draggable: mode}));
    }

    /**
     * If false, prevents the map from being controlled by the keyboard.
     * Keyboard shortcuts are enabled by default.
     */
    @Input()
    set keyboardShortcuts(mode: boolean) {
        this._map.then(map => map.setOptions({keyboardShortcuts: mode}));
    }

    /**
     * If false, disables scrollwheel zooming on the map.
     * The scrollwheel is enabled by default.
     */
    @Input()
    set scrollwheel(mode: boolean) {
        this._map.then(map => map.setOptions({scrollwheel: mode}));
    }

    /*
     * Zoom options
     * **********************************************************
     */

    /**
     * Map zoom level.
     */
    @Input()
    set zoom(value: number) {
        this._map.then(map => map.setZoom(value));
    }

    /**
     * The maximum zoom level which will be displayed on the map.
     */
    @Input()
    set minZoom(value: number) {
        this._map.then(map => map.setOptions({minZoom: value}));
    }

    /**
     * The minimum zoom level which will be displayed on the map.
     */
    @Input()
    set maxZoom(value: number) {
        this._map.then(map => map.setOptions({maxZoom: value}));
    }

    /*
     * Control options
     * **********************************************************
     */

    /**
     * Enables/disables all default UI.
     */
    @Input()
    set disableDefaultUI(mode: boolean) {
        this._map.then(map => map.setOptions({disableDefaultUI: mode}));
    }

    /**
     * Enabled/Disabled state of the Map type control.
     */
    @Input()
    set mapTypeControl(mode: boolean) {
        this._map.then(map => map.setOptions({mapTypeControl: mode}));
    }

    /**
     * Enabled/Disabled state of the Rotate control.
     */
    @Input()
    set rotateControl(mode: boolean) {
        this._map.then(map => map.setOptions({rotateControl: mode}));
    }

    /**
     * Enabled/Disabled state of the Scale control.
     */
    @Input()
    set scaleControl(mode: boolean) {
        this._map.then(map => map.setOptions({scaleControl: mode}));
    }

    /**
     * Enabled/Disabled state of the Street View Pegman control.
     */
    @Input()
    set streetViewControl(mode: boolean) {
        this._map.then(map => map.setOptions({streetViewControl: mode}));
    }

    /**
     * Enabled/Disabled state of the Zoom control
     */
    @Input()
    set zoomControl(mode: boolean) {
        this._map.then(map => map.setOptions({zoomControl: mode}));
    }

    /*
     * Internal logic
     * **********************************************************
     */

    ngOnInit(): void {
        this._mapsManager
            .createMap(
                this._elem.nativeElement.querySelector('.google-map-container'),
                this.getOptions())
            .then(map => {
                this._mapsManager.addMap(this.toString(), map);
                this._mapResolver(map);
            });
    }

    ngOnDestroy(): void {
        this._mapsManager.removeMap(this._name);
        this._mapComponentsSubscriptions.unsubscribe();
    }

    ngAfterContentInit(): void {
        this._mapComponentsSubscriptions = this.mapComponents.changes.subscribe(() => {
            this.attachComponentsToMap();
        });

        this.attachComponentsToMap();

    }

    toString(): string {
        return this._name ? this._name : `fh.google-maps-${this._id}`;
    }

    private attachComponentsToMap(): void {
        this._map.then(map => {
            this.mapComponents
                .filter(v => !v.hasMapComponent())
                .forEach(v => {
                    v.setMapComponent(this, map);
                });
        });
    }

    private getOptions(): google.maps.MapOptions {
        return {
            center: <google.maps.LatLng><any>{lat: 0, lng: 0},
            zoom: 5,
            backgroundColor: this._mapBackgroundColor
        };
    }

    private resetMapBounds(bounds: google.maps.LatLngBounds) {
        this._map.then(map => {
            map.fitBounds(bounds);
        });
    }

    fitBounds(bounds: google.maps.LatLngBounds) {
        this.resetMapBounds(bounds);
    }
}


