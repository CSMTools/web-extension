const items = UserYou.getInventory(730, 2).m_rgAssets;
if (typeof items !== 'undefined') {
    document.body.setAttribute('tmp_items', JSON.stringify(items));
}

console.log(items);
