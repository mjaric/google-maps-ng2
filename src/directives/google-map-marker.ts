/**
 * Created by mjaric on 9/28/16.
 */
import {Directive, Input, Output, OnInit, OnDestroy, EventEmitter, forwardRef} from '@angular/core';
import {MapsManager} from '../services/maps-manager';
import {BaseGoogleMapComponent} from './base-google-map-component';


@Directive({
    selector: 'google-map-marker',
    providers: [{provide: BaseGoogleMapComponent, useExisting: forwardRef(() => GoogleMapMakerDirective)}]
})
export class GoogleMapMakerDirective extends BaseGoogleMapComponent<google.maps.Marker> implements OnInit, OnDestroy {

    /*
     * Outputs events
     * **********************************************************
     */

    /**
     * This event is fired when the marker icon was clicked.
     */
    @Output()
    click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    /**
     * This event is fired when the marker icon was double clicked.
     */
    @Output()
    dblclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    /**
     * This event is fired for a rightclick on the marker.
     */
    @Output()
    rightclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    /**
     * This event is fired when the marker position property changes.
     */
    @Output()
    position_changed: EventEmitter<void> = new EventEmitter<void>();

    /**
     * This event is fired when the marker icon property changes.
     */
    @Output()
    icon_changed: EventEmitter<void> = new EventEmitter<void>();

    /**
     * This event is fired when the marker title property changes.
     */
    @Output()
    title_changed: EventEmitter<void> = new EventEmitter<void>();

    /**
     * This event is fired when the marker visible property changes.
     */
    @Output()
    visible_changed: EventEmitter<void> = new EventEmitter<void>();


    /*
     * Inputs options
     * **********************************************************
     */
    /**
     * Marker position
     */
    @Input()
    set position(value: google.maps.LatLngLiteral | Coordinates | { latitude: number, longitude: number }) {
        this.proxy.then(marker => {
            let position = new google.maps.LatLng(
                (<google.maps.LatLngLiteral>value).lat || (<Coordinates>value).latitude,
                (<google.maps.LatLngLiteral>value).lng || (<Coordinates>value).longitude
            );
            marker.setPosition(position);
        });
    }

    /**
     * If true, the marker receives mouse and touch events.
     * Default value is true.
     */
    @Input()
    set clickable(mode: boolean) {
        this.proxy.then(marker => marker.setClickable(mode));
    }

    /**
     * Icon for the foreground. If a string is provided,
     * it is treated as though it were an Icon with the string as url.
     */
    @Input()
    set icon(value: string | google.maps.Icon) {
        this.proxy.then(marker => marker.setIcon(value));
    }

    /**
     * The marker's opacity between 0.0 and 1.0.
     */
    @Input()
    set opacity(value: number) {
        this.proxy.then(marker => marker.setOpacity(value));
    }

    /**
     * Rollover text
     */
    @Input()
    set title(value: string) {
        this.proxy.then(marker => marker.setTitle(value));
    }

    /**
     * If true, the marker is visible
     */
    @Input()
    set visible(mode: boolean) {
        this.proxy.then(marker => marker.setVisible(mode));
    }

    /**
     * Set marker zIndex for displayed on the map
     */
    @Input()
    set zIndex(value: number) {
        this.proxy.then(marker => marker.setZIndex(value));
    }


    @Input()
    set animation(value: google.maps.Animation) {
        this.proxy.then(marker => marker.setAnimation(<google.maps.Animation>value));
    }

    @Input('delay')
    set setDelay(value: number) {
        this.delay = value;
    }

    constructor(private _mapsManager: MapsManager) {
        super();
    }


    /*
     * Internal logic
     * **********************************************************
     */


    ngOnInit(): void {
        this._mapsManager.createMarker()
            .then(marker => {
                this.bindEvents(marker);
                this.proxyResolver(marker);
            });
    }

    ngOnDestroy(): void {
        this.proxy.then(marker => {
            google.maps.event.clearInstanceListeners(marker);
            marker.setMap(null);
        });
    }

    private bindEvents(marker: google.maps.Marker) {
        marker.addListener('click', e => this.click.emit(e));
        marker.addListener('dblclick', e => this.dblclick.emit(e));
        marker.addListener('rightclick', e => this.rightclick.emit(e));
        marker.addListener('position_changed', e => this.position_changed.emit(e));
        marker.addListener('title_changed', e => this.title_changed.emit(e));
        marker.addListener('icon_changed', e => this.icon_changed.emit(e));
        marker.addListener('visible_changed', e => this.visible_changed.emit(e));
    }
}
