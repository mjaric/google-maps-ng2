import {BaseGoogleMapsApiLoader} from './base-google-maps-api-loader';

export function MapsApiLoaderFactory(loader: BaseGoogleMapsApiLoader): () => Promise<any>{
  return () => {
    return loader.load();
  }
}
