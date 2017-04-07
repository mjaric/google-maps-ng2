/**
 * Created by mjaric on 9/28/16.
 */

export abstract class BaseGoogleMapsApiLoader {
    abstract load(): Promise<void>;
}
