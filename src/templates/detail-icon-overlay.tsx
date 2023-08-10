import * as elements from 'typed-html';

import StickerColumn from './stickerColumn';

import type { Sticker as StickerType } from '@csmtools/types';

interface InventoryOverlayProps {
    name: string;
    stickers: StickerType[];
}

export default function InventoryOverlay({ stickers }: InventoryOverlayProps) {
    return (
        <div class="sticker-holder">
            <StickerColumn stickers={stickers} />
        </div>
    );
}
