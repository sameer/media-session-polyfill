import MediaSession from '../api/MediaSession';
import mediaSessionCallback from '../mediaSessionCallback';
import HTMLMediaElementMediaSession from '../HTMLMediaElementMediaSession';

class YoutubeMediaSession extends HTMLMediaElementMediaSession {
    constructor() {
        super('div.html5-video-container > video');
    }
}

browser.runtime.onMessage.addListener(mediaSessionCallback(new YoutubeMediaSession()));
