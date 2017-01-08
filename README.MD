# google-maps-ng2

## Installation

To install this library, run:

```bash
$ npm install google-maps-ng2 --save
```

Then in your main app module (or common module shared with other modules in project) add:

```typescript
import {NgModule} from '@angular/core';
import {GoogleMapsNg2Module} from 'google-maps-ng2';

@NgModule({
  imports: [
    //...
    GoogleMapsModule.forRoot({
      apiKey: "......YOUR_API_KEY.......",
      libraries: ["places", "geometry"]
    })
    //...
  ]
})
export class MyRootOrSharedAppModule {}
```

optionally, you can set different google maps api loader using OpaqueToken LAZY_LOADER_OPTIONS. Simple register your
loader service as provider with this OpaqueToken key

## Markers Example

```typescript
import {Component, ViewChild} from '@angular/core';
import {GoogleMapComponent, MapsManager} from "google-maps-ng2";

@Component({
  selector: 'directions-map',
  template: `
<google-map #directionsMap name="directions-map" [zoom]="10">
    <google-map-marker [position]="origin"></google-map-marker>
    <google-map-marker [position]="destination"></google-map-marker>
</google-map>
`,
  styles: [':host, google-map {display:block; width: inherit; height: inherit}']

})
export class DirectionsMapComponent {
  
  @ViewChild('directionsMap') directionsMap:GoogleMapComponent;
  
  public origin = <Coordinates>{
    longitude: -71.19490009999998,
    latitude: 42.4258283
  };
  public destination = <Coordinates>{
    longitude: -96.99182660000002,
    latitude: 32.9854679
  };
  
  constructor(private mapsManager:MapsManager){}
  
  ngOnInit(){
    // center map to markers
    this.directionsMap
        .getMap()
        .then(map=>{
            let markers = [this.origin, this.destination];
            this.mapsManager
                .calculateMapBounds(markers)
                .then((bounds) => {
                  bounds && this.directionsMap.fitBounds(bounds);
                });
        });
  }
}
```

## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run tsc
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © Milan Jarić
