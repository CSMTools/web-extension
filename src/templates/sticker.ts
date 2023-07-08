export default `
<span class=\\"hint--bottom hint--rounded hint--small hint--info hint--sticker\\" aria-label=\\"" + sticker.name + "\\">
    <a href=\\"https://steamcommunity.com/market/listings/730/Sticker | " + sticker.name +"\\" target=\\"_blank\\">
        <img style=\\"filter: contrast(" + (1 - sticker.wear) * 100 + "%)\\" class=\\"sticker\\" width=\\"64\\" height=\\"48\\" src=\\"" + sticker.image + "\\">
    </a>
</span>
`.replace(/\n/g, '');
