/**
 * Created by Bosko-Vibe on 7.11.2016.
 */
import {Directive, Input, OnDestroy, forwardRef} from '@angular/core';
import {BaseGoogleMapComponent} from './base-google-map-component';
import {MapsManager} from '../services/maps-manager';


@Directive({
    selector: 'google-map-polyline',
    providers: [{provide: BaseGoogleMapComponent, useExisting: forwardRef(() => GoogleMapPolylineDirective)}]
})
export class GoogleMapPolylineDirective extends BaseGoogleMapComponent<google.maps.Polyline> implements OnDestroy {
    @Input()
    set options(value: google.maps.PolylineOptions) {
        this.proxy.then(o => o.setOptions(value));
    }

    constructor(mapsManager: MapsManager) {
        super();
        mapsManager
            .onApiLoad()
            .then(() => {
                this.proxyResolver(new google.maps.Polyline());
            });
    }

    ngOnDestroy(): void {
        this.proxy
            .then(p => {
                p.setMap(null);
                p.setPath([]);
            });
    }
}
