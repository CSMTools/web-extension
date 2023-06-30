document.getElementById('account_pulldown').innerHTML = 'Barfoo';

console.log(document.body);

console.log(getInventory());

console.log('In content script');

function getInventory(): typeof CInventory.m_rgAssets {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inventoryInjection.js');
    script.id = 'tmpScript';
    (document.body || document.head || document.documentElement).appendChild(script);

    const result = JSON.parse(document.body.getAttribute('tmp_items'));

    document.body.removeAttribute('tmp_items');
    document.getElementById(script.id).remove();

    //chrome.scripting.executeScript()

    return result;
}
