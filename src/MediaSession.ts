import MediaMetadata from "./MediaMetadata";
import MediaSessionPlaybackState from "./MediaSessionPlaybackState";
import MediaSessionAction from "./MediaSessionAction";
import MediaPositionState from "./MediaPositionState";
import MediaSessionActionHandler from "./MediaSessionActionHandler";
export default abstract class MediaSession {
    public playbackState: MediaSessionPlaybackState = "none";
    public metadata?: MediaMetadata;

    public play?: MediaSessionActionHandler;
    public pause?: MediaSessionActionHandler;
    public seekbackward?: MediaSessionActionHandler;
    public seekforward?: MediaSessionActionHandler;
    public previoustrack?: MediaSessionActionHandler;
    public nexttrack?: MediaSessionActionHandler;
    public skipad?: MediaSessionActionHandler;
    public stop?: MediaSessionActionHandler;
    public seekto?: MediaSessionActionHandler;
    public setActionHandler(action: MediaSessionAction, func: MediaSessionActionHandler): void {
        this[action] = func;
    }
    public setPositionState(position: MediaPositionState): void {};
}
