import MediaSession from '../MediaSession';
class AmazonMusicMediaSession extends MediaSession {
    private mouseEvent: MouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    private updatePositionIntervalId: number;
    private updatePositionState: () => void;

    constructor() {
        super();
        this.updatePositionState = () => {
            const scrubberBackground = document.querySelector('span.scrubberBackground');
            const remainingTime = document.querySelector('div.listViewDuration');
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
        };
        this.updatePositionIntervalId = window.setInterval(this.updatePositionState, 1000);

        this.setActionHandler('play', () => {
            const playButton = document.querySelector('span.playButton');
            if (playButton && !playButton.classList.contains('disabled') && playButton.classList.contains('playerIconPlay')) {
                playButton.dispatchEvent(this.mouseEvent);
                this.playbackState = 'playing';
                this.updatePositionIntervalId = window.setInterval(this.updatePositionState, 1000);
            }
        });
        this.setActionHandler('pause', () => {
            const playButton = document.querySelector('span.playButton');
            if (playButton && !playButton.classList.contains('disabled') && playButton.classList.contains('playerIconPause')) {
                playButton.dispatchEvent(this.mouseEvent);
                this.playbackState = 'paused';
                window.clearInterval(this.updatePositionIntervalId);
            }
        });

        this.setActionHandler('nexttrack', () => {
            const nextButton = document.querySelector('#transportPlayNext');
            if (nextButton && !nextButton.classList.contains('disabled')) {
                nextButton.dispatchEvent(this.mouseEvent);
            }
        });

        this.setActionHandler('previoustrack', () => {
            const previousButton = document.querySelector('#transportPlayPrevious');
            if (previousButton && !previousButton.classList.contains('disabled')) {
                previousButton.dispatchEvent(this.mouseEvent);
            }
        });
    }
}

if (!navigator.mediaSession) {
    navigator.mediaSession = new AmazonMusicMediaSession();
}
export default AmazonMusicMediaSession;
