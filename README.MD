# google-maps-ng2

## Installation

To install this library, run:

```bash
$ npm install google-maps-ng2 --save
```

Then in your main app module (or common module shared with other modules in project) add:

```javascript
import {NgModule} from '@angular/core';
import {GoogleMapsNg2Module} from 'google-maps-ng2';

@NgModule({
  imports: [
    ...
    GoogleMapsModule.forRoot({
      apiKey: "......YOUR_API_KEY.......",
      libraries: ["places", "geometry"]
    })
    ...
  ]
})
export MyRootOrSharedAppModule {}
```

optionally, you can set different google maps api loader using OpaqueToken LAZY_LOADER_OPTIONS. Simple register your
loader service as provider with this OpaqueToken key

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

MIT © Milan Jaric
