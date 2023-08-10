import * as elements from 'typed-html';

import Sticker from './sticker';

import type { Sticker as StickerType } from '@csmtools/types';

interface StickerColumnProps {
    stickers: StickerType[]
}

export default function StickerColumn({ stickers }: StickerColumnProps) {
    let column = '';

    for (const sticker of stickers) {
        column += Sticker({
            sticker
        });
    }

    return column;
}
