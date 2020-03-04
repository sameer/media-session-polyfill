import MediaSession from '../api/MediaSession';
import mediaSessionCallback from '../mediaSessionCallback';
import HTMLMediaElementMediaSession from '../HTMLMediaElementMediaSession';

class AmazonPrimeVideoMediaSession extends HTMLMediaElementMediaSession {
    constructor() {
        super('div.rendererContainer > video');
    }
}

browser.runtime.onMessage.addListener(mediaSessionCallback(new AmazonPrimeVideoMediaSession()));
