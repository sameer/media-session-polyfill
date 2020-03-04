import MediaSession from './api/MediaSession';

export default function mediaSessionCallback(session: MediaSession): browser.runtime.onMessagePromise {
    return (message: any, sender, _sendResponse) => {
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
}
