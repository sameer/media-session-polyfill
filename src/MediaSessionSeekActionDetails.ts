import {MediaSessionActionDetails} from './MediaSessionActionDetails';

export default interface MediaSessionSeekActionDetails extends MediaSessionActionDetails {
    seekOffset?: number;
};
