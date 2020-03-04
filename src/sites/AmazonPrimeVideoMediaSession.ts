import MediaSession from '../api/MediaSession';
import mediaSessionCallback from '../mediaSessionCallback';

class AmazonPrimeVideoMediaSession extends MediaSession {
    private updatePositionAndPlaybackIntervalId: number;
    private updatePositionAndPlaybackState: () => void;

    private playerSelector = 'div.rendererContainer > video';

    constructor() {
        super();
        this.updatePositionAndPlaybackState = () => {
            const player = document.querySelector(this.playerSelector);
            if (player && player instanceof HTMLVideoElement) {
                this.setPositionState({
                    duration: player.duration,
                    playbackRate: player.playbackRate,
                    position: player.currentTime,
                });
                this.playbackState = player.paused ? 'paused' : 'playing';
            } else {
                this.playbackState = 'none';
            }
        };
        this.updatePositionAndPlaybackState();
        this.updatePositionAndPlaybackIntervalId = this.playbackState == 'playing' ? window.setInterval(this.updatePositionAndPlaybackState, 1000) : -1;

        this.setActionHandler('play', () => {
            const player = document.querySelector(this.playerSelector);
            if (player && player instanceof HTMLVideoElement) {
                player.play();
                this.playbackState = 'playing';
                this.updatePositionAndPlaybackIntervalId = window.setInterval(this.updatePositionAndPlaybackState, 1000);
            }
        });

        this.setActionHandler('pause', () => {
            const player = document.querySelector(this.playerSelector);
            if (player && player instanceof HTMLVideoElement) {
                player.pause();
                this.playbackState = 'paused';
                window.clearInterval(this.updatePositionAndPlaybackIntervalId);
            }
        });
    }
}

browser.runtime.onMessage.addListener(mediaSessionCallback(new AmazonPrimeVideoMediaSession()));
