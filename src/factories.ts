import {BaseGoogleMapsApiLoader} from "./loaders/base-google-maps-api-loader";

export function  loaderFactory(loader: BaseGoogleMapsApiLoader){
  return () => loader.load();
}