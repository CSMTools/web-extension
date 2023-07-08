import sticker from './sticker';

export default `
@{v.stickers.map((sticker) => "${sticker}").join('');}
`;
