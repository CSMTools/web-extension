export type ItemData = {
    delay?: number,
    itemid: string,
    defindex: number,
    paintindex: number,
    rarity: number,
    quality: number,
    killeaterscoretype: number | null,
    killeatervalue: number,
    customname: string | null,
    paintseed: number  | null,
    paintwear: number,
    origin: number,
    fadePercentage: number | null,
    s: string,
    a: string,
    d: string,
    m: string,
    stickers: StickerInItem[],
    // Additional data, never stored, only added in requests:
    additional?: {
        imageurl: string;
        floatData: {
            min: number,
            max: number
        };
        weapon_type: string;
        item_name: string;
        rarity_name: string;
        quality_name: string;
        origin_name: string;
        wear_name: string;
        full_item_name: string;
    }
}

export type StickerInItem = Sticker & {
    tint_id: number | null;
    codename?: string;
    material?: string;
    name?: string;
    image?: string;
    rarityname?: string;
}

interface Sticker {
    sticker_id: number;
    /**
     * The sticker slot number, 0-5
     */
    slot: number;
    /**
     * The sticker's wear (how scratched it is), as a float.
     * `null` if not scratched at all.
     */
    wear: number | null;
    /**
     * Float, `null` if not applicable
     */
    scale: number | null;
    /**
     * Float, `null` if not applicable
     */
    rotation: number | null;
}
