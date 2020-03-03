import MediaImage from './MediaImage';

export default interface MediaMetadata {
    title?: string;
    artist?: string;
    album?: string;
    artwork?: MediaImage[];
};
