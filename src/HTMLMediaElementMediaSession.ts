import MediaSession from './api/MediaSession';
import mediaSessionCallback from './mediaSessionCallback';

export default abstract class HTMLMediaElementMediaSession extends MediaSession {
    private updatePositionAndPlaybackIntervalId: number;
    private updatePositionAndPlaybackState: () => void;

    private mediaSelector: string;

    constructor(mediaSelector: string) {
        super();
        this.mediaSelector = mediaSelector;
        this.updatePositionAndPlaybackState = () => {
            const player = document.querySelector(this.mediaSelector);
            if (player && player instanceof HTMLMediaElement) {
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
            const player = document.querySelector(this.mediaSelector);
            if (player && player instanceof HTMLMediaElement) {
                player.play();
                this.playbackState = 'playing';
                this.updatePositionAndPlaybackIntervalId = window.setInterval(this.updatePositionAndPlaybackState, 1000);
            }
        });

        this.setActionHandler('pause', () => {
            const player = document.querySelector(this.mediaSelector);
            if (player && player instanceof HTMLMediaElement) {
                player.pause();
                this.playbackState = 'paused';
                window.clearInterval(this.updatePositionAndPlaybackIntervalId);
            }
        });
    }
}
