import {MediaSessionActionDetails} from './MediaSessionActionDetails';

export default interface MediaSessionSeekToActionDetails extends MediaSessionActionDetails {
    seekTime: number;
    fastSeek?: boolean;
};
