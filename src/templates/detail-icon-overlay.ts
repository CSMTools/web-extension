export default `
<div class="sticker-holder">
@{v.stickers.map((sticker) => "<span class=\\"hint--bottom hint--rounded hint--small hint--info hint--sticker\\" aria-label=\\"" + sticker.name + "\\"><img style=\\"filter: contrast(" + (1 - sticker.wear) * 100 + "%)\\" class=\\"sticker\\" width=\\"64\\" height=\\"48\\" src=\\"" + sticker.image + "\\"></span>").join('');}
</div>
`;
