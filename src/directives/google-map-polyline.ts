/**
 * Created by Bosko-Vibe on 7.11.2016.
 */
import {Directive, Input, Output, OnInit, OnDestroy, EventEmitter, forwardRef} from '@angular/core';
import {MapsManager} from '../services/maps-manager';
import {BaseGoogleMapComponent} from './base-google-map-component';


@Directive({
    selector: 'google-map-polyline',
    providers: [{provide: BaseGoogleMapComponent, useExisting: forwardRef(() => GoogleMapPolylineDirective)}]
})
export class GoogleMapPolylineDirective extends BaseGoogleMapComponent<google.maps.Polyline> implements OnInit, OnDestroy {
    @Input()
    set options(value:google.maps.PolylineOptions){
        this.proxy.then( o => o.setOptions(value));
    }    
    
    constructor(private _mapsManager:MapsManager){
        super();
    }
    
    ngOnInit():void {
        this._mapsManager
            .onApiLoad()
            .then( () => {
                this.proxyResolver(new google.maps.Polyline());
            });
    }
    
    

    ngOnDestroy():void {
    }
    
}