import MediaSession from '../api/MediaSession';
class AmazonMusicMediaSession extends MediaSession {
    private mouseEventBuilder: () => MouseEvent = () => new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    private updatePositionIntervalId: number;
    private updatePositionAndPlaybackState: () => void;

    constructor() {
        super();
        this.updatePositionAndPlaybackState = () => {
            const scrubberBackground = document.querySelector('span.scrubberBackground');
            const remainingTime = document.querySelector('div.listViewDuration');
            const playButton = document.querySelector('span.playButton');
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
        this.updatePositionIntervalId = window.setInterval(this.updatePositionAndPlaybackState, 1000);

        this.setActionHandler('play', () => {
            const playButton = document.querySelector('span.playButton');
            if (playButton && !playButton.classList.contains('disabled') && playButton.classList.contains('playerIconPlay')) {
                playButton.dispatchEvent(this.mouseEventBuilder());
                this.playbackState = 'playing';
                this.updatePositionIntervalId = window.setInterval(this.updatePositionAndPlaybackState, 1000);
            }
        });
        this.setActionHandler('pause', () => {
            const playButton = document.querySelector('span.playButton');
            if (playButton && !playButton.classList.contains('disabled') && playButton.classList.contains('playerIconPause')) {
                playButton.dispatchEvent(this.mouseEventBuilder());
                this.playbackState = 'paused';
                window.clearInterval(this.updatePositionIntervalId);
            }
        });

        this.setActionHandler('nexttrack', () => {
            const nextButton = document.querySelector('#transportPlayNext');
            if (nextButton && !nextButton.classList.contains('disabled')) {
                nextButton.dispatchEvent(this.mouseEventBuilder());
            }
        });

        this.setActionHandler('previoustrack', () => {
            const previousButton = document.querySelector('#transportPlayPrevious');
            if (previousButton && !previousButton.classList.contains('disabled')) {
                previousButton.dispatchEvent(this.mouseEventBuilder());
            }
        });
    }
    // public toString(): string {
    //     let objStr = '{\n';
    //     for (const member in this) {
    //         objStr += `'${member}' : ${typeof this[member] === 'string' ? '\'' + this[member] + '\'' : this[member]},\n`;
    //     }
    //     objStr += '\n}';
    //     return objStr;
    // }
}


const session = new AmazonMusicMediaSession();
const callback: browser.runtime.onMessagePromise = (message: any, sender, _sendResponse) => {
    if ((sender as any).envType && (sender as any).envType != 'addon_child') {
        return Promise.resolve();
    }
    if (message.key) {
        if (message.key == 'MediaPlay' && session.playbackState == 'paused' && session.play) {
            session.play();
        } else if (message.key == 'MediaPlay' && session.playbackState == 'playing' && session.pause) {
            session.pause();
        } else if (message.key == 'MediaTrackNext' && session.nexttrack) {
            session.nexttrack();
        } else if (message.key == 'MediaTrackPrevious' && session.previoustrack) {
            session.previoustrack();
        }
    }
    return Promise.resolve();
};
browser.runtime.onMessage.addListener(callback);
