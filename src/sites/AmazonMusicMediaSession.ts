import MediaSession from '../api/MediaSession';
import mediaSessionCallback from '../mediaSessionCallback';

class AmazonMusicMediaSession extends MediaSession {
    private mouseEventBuilder: () => MouseEvent = () => new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    private updatePositionAndPlaybackIntervalId: number;
    private updatePositionAndPlaybackState: () => void;

    private playButtonSelector = 'span.playButton';

    constructor() {
        super();
        this.updatePositionAndPlaybackState = () => {
            const scrubberBackground = document.querySelector('span.scrubberBackground');
            const remainingTime = document.querySelector('div.listViewDuration');
            const playButton = document.querySelector(this.playButtonSelector);
            if (scrubberBackground && scrubberBackground instanceof HTMLElement && remainingTime && remainingTime instanceof HTMLElement) {
                const positionNormalized = (Number.parseFloat(scrubberBackground.style.width)) / 100.0;
                const remaining = remainingTime.innerText.split(':').map(Number.parseInt).map(Math.abs).reverse().reduce((acc, cur, i) => i < 2 ? acc + cur * (60 ** i) : acc, 0);
                const duration = remaining / (1 - positionNormalized);
                const position = positionNormalized * duration;
                this.setPositionState({
                    duration,
                    playbackRate: 1,
                    position,
                });
            }
            this.playbackState = playButton ? (playButton.classList.contains('disabled') ? 'none' : (playButton.classList.contains('playerIconPlay') ? 'paused' : 'playing')) : 'none';
        };
        this.updatePositionAndPlaybackState();
        this.updatePositionAndPlaybackIntervalId = this.playbackState == 'playing' ? window.setInterval(this.updatePositionAndPlaybackState, 1000) : -1;

        this.setActionHandler('play', () => {
            const playButton = document.querySelector(this.playButtonSelector);
            if (playButton && !playButton.classList.contains('disabled') && playButton.classList.contains('playerIconPlay')) {
                playButton.dispatchEvent(this.mouseEventBuilder());
                this.playbackState = 'playing';
                if (this.updatePositionAndPlaybackIntervalId == -1) {
                    this.updatePositionAndPlaybackIntervalId = window.setInterval(this.updatePositionAndPlaybackState, 1000);
                }
            }
        });

        this.setActionHandler('pause', () => {
            const playButton = document.querySelector(this.playButtonSelector);
            if (playButton && !playButton.classList.contains('disabled') && playButton.classList.contains('playerIconPause')) {
                playButton.dispatchEvent(this.mouseEventBuilder());
                this.playbackState = 'paused';
                if (this.updatePositionAndPlaybackIntervalId != -1) {
                    window.clearInterval(this.updatePositionAndPlaybackIntervalId);
                }
                this.updatePositionAndPlaybackIntervalId = -1;
            }
        });

        this.setActionHandler('nexttrack', () => {
            const nextButton = document.querySelector('#transportPlayNext');
            if (nextButton && !nextButton.classList.contains('disabled')) {
                nextButton.dispatchEvent(this.mouseEventBuilder());
                if (this.updatePositionAndPlaybackIntervalId == -1) {
                    this.updatePositionAndPlaybackIntervalId = window.setInterval(this.updatePositionAndPlaybackState, 1000);
                }
            }
        });

        this.setActionHandler('previoustrack', () => {
            const previousButton = document.querySelector('#transportPlayPrevious');
            if (previousButton && !previousButton.classList.contains('disabled')) {
                previousButton.dispatchEvent(this.mouseEventBuilder());
                if (this.updatePositionAndPlaybackIntervalId == -1) {
                    this.updatePositionAndPlaybackIntervalId = window.setInterval(this.updatePositionAndPlaybackState, 1000);
                }
            }
        });
    }
}

browser.runtime.onMessage.addListener(mediaSessionCallback(new AmazonMusicMediaSession()));
