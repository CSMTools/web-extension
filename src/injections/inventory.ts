import { getFadeName, getGradient } from '@csmtools/fadegradients';
import { isDoppler, getDopplerType, DopplerData } from '@csmtools/dopplerutils';
import htmlEngine from '../lib/html-engine';
import { generateId, moveToFront, observeDOM } from '../lib/utils';
import inventoryOverlay from '../templates/inventory-overlay';
import { ItemData } from '../types/api';
import { MessageType, WindowMessage } from '../types/communication';
import targetOrigins from '../data/target-origins';
import { INV_CONTEXT } from '../data/constants';
import detailIconOverlay from '../templates/detail-icon-overlay';

const inspectedItems: { [assetId: string]: ItemData | null } = {};
const loadedPages: number[] = [];
let selectedItemId: string = '';

// Start communication stuff

function fetch(...args: [RequestInfo, RequestInit?]) {
    return new Promise<string>((resolve, reject) => {
        const transactionKey = generateId();
        const listener = ({ data: m }: { data: WindowMessage }) => {
            if (m.isFromPage) {
                return;
            }

            if (m.transactionKey !== transactionKey) {
                return;
            }

            window.removeEventListener('message', listener);

            if (m.type === MessageType.ERROR) {
                reject(m.content);
            } else if (m.type === MessageType.FETCHRESPONSE) {
                resolve(m.content as string);
            }
        };

        window.addEventListener('message', listener, false);

        window.postMessage({
            isFromPage: true,
            content: args,
            transactionKey: transactionKey,
            type: MessageType.FETCHREQUEST
        } as WindowMessage, targetOrigins.INVENTORY);
    });
}

window.addEventListener('message',
    ({ data: m }: { data: WindowMessage }) => {
        if (m.isFromPage) {
            return;
        }
    }, false);

// End communication stuff

function main(items: TInventoryAsset[]) {
    function nonInspectableTransformLink(item: TInventoryAsset) {
        item.element.getElementsByTagName('a')[0]?.addEventListener('click', () => {
            history.replaceState(0, '', `#${INV_CONTEXT[0]}_${INV_CONTEXT[1]}_${item.assetid}`);
        });
    }

    const { selectedItem } = UserYou.getInventory(...INV_CONTEXT);

    if (selectedItem && items.findIndex(i => i.assetid === selectedItem.assetid) > -1) {
        moveToFront(items, items.findIndex(i => i.assetid === selectedItem.assetid));
    }

    for (const item of items) {
        // If the item has already been inspected, continue, this can happen when not all items are loaded at first and when they're loaded it tries to inspect twice.
        if (Object.prototype.hasOwnProperty.call(inspectedItems, item.assetid)) {
            continue;
        }

        inspectedItems[item.assetid] = null;

        // Item is not unique
        if (item.description.commodity) {
            nonInspectableTransformLink(item);
            continue;
        }

        // Check tags
        if (item.description.tags.find(tag => tag.internal_name === 'Type_CustomPlayer' || tag.internal_name === 'CSGO_Type_Collectible')) {
            nonInspectableTransformLink(item);
            continue;
        }

        // Item can not be inspected
        if (!item.description.actions) {
            nonInspectableTransformLink(item);
            continue;
        }

        const link = formatLink(item.description.actions[0].link, UserYou.strSteamId, item.assetid);
        fetch(`http://localhost:3000/api/inspect?link=${decodeURIComponent(link)}&additional=true`)
            .then(response => {
                const itemData = JSON.parse(response) as ItemData;

                item.element.innerHTML += htmlEngine.render(inventoryOverlay, {
                    float: itemData.paintwear.toFixed(4),
                    fadePercentage: itemData.fadePercentage === null ? '' : itemData.fadePercentage.toFixed(2),
                    fadeGradient: itemData.fadePercentage === null ? 'transparent' : getGradient(getFadeName(itemData.paintindex), itemData.fadePercentage),
                    dopplerPhase: isDoppler(itemData.paintindex) ? DopplerData[getDopplerType(itemData.paintindex)][itemData.paintindex].name : '',
                });

                inspectedItems[item.assetid] = itemData;

                item.element.getElementsByTagName('a')[0]?.addEventListener('click', (e) => {
                    e.preventDefault();

                    if (UserYou.getInventory(730, 2).selectedItem?.assetid === item.assetid) {
                        return;
                    }

                    UserYou.getInventory(730, 2).SelectItem(e, undefined, UserYou.getInventory(730, 2).m_rgAssets[item.assetid], false);

                    history.replaceState(0, '', `#${INV_CONTEXT[0]}_${INV_CONTEXT[1]}_${item.assetid}`);
                });

                if (UserYou.getInventory(...INV_CONTEXT).selectedItem.assetid === item.assetid) {
                    onDOMUpdate();
                }
            })
            .catch(console.log);
    }
}

async function dressSelectedItem(item: TInventoryAsset) {
    if (!item.description.actions || !item.description.actions[0]?.link) {
        return;
    }

    const html = htmlEngine.render(detailIconOverlay, {
        name: item.description.name,
        stickers: inspectedItems[item.assetid].stickers
    });

    document.getElementsByClassName('item_desc_icon')[0].innerHTML += html;
    document.getElementsByClassName('item_desc_icon')[1].innerHTML += html;

    document.querySelector('div.descriptor > div#sticker_info')?.parentElement?.remove();

    if (item.description.fraudwarnings && item.description.fraudwarnings[0]) {
        const customName = item.description.fraudwarnings[0].match(/^Name\sTag:\s''(.*)''$/)?.[1];

        if (customName) {
            [...document.getElementsByClassName('fraud_warning_box')].forEach((el: HTMLElement) => {
                el.innerHTML = customName;
                el.style.paddingLeft = '5px';
            });
        }
    }
}

function onDOMUpdate() {
    const item = UserYou.getInventory(...INV_CONTEXT).selectedItem;

    if (item && item.assetid === selectedItemId) {
        return;
    }

    // Clean last selected item
    document.querySelectorAll('div.sticker-holder').forEach(el => el.remove());

    if (!inspectedItems[item.assetid] || !inspectedItems[item.assetid].additional) {
        return;
    }

    selectedItemId = item.assetid;

    setTimeout(() => {
        dressSelectedItem(item);
    });
}

observeDOM(document.getElementsByClassName('inventory_page_right')[0], onDOMUpdate);

function onPageSwitched() {
    const currentPage = getCurrentPage();

    if (isNaN(currentPage)) {
        return;
    }

    if (loadedPages.includes(currentPage)) {
        return;
    }

    loadedPages.push(currentPage);

    main(getItemsOnCurrentPage(currentPage));
}

let delay = 0;

// Check that inventory is not private and that user has a cs inventory
if (document.getElementById('inventory_link_730')) {
    loopableDelay();
}

// eslint-disable-next-line no-inner-declarations
function loopableDelay() {
    delay += 100;
    if (Object.keys(UserYou.getInventory(...INV_CONTEXT).m_rgAssets).filter(k => !isNaN(parseInt(k))).length > 0) {
        main(getItemsOnCurrentPage(getCurrentPage()));

        observeDOM(document.getElementById('pagecontrol_cur'), onPageSwitched);
    } else {
        setTimeout(loopableDelay, delay);
    }
}

function formatLink(link: string, owner: string, asset: string) {
    return link.replace('%owner_steamid%', owner).replace('%assetid%', asset);
}

function getCurrentPage(): number {
    return parseInt(document.getElementById('pagecontrol_cur').innerHTML);
}

function getItemsOnCurrentPage(currentPage: number): TInventoryAsset[] {
    const allItems = Object.values(UserYou.getInventory(730, 2).m_rgAssets).filter(i => typeof i !== 'function');
    const totalPages = UserYou.getInventory(...INV_CONTEXT).m_cPages;
    const totalItems = UserYou.getInventory(...INV_CONTEXT).m_cItems;

    const isLastPageFull = (totalItems / totalPages) === 25;

    const startIndex = 25 * (currentPage - 1);

    let endIndex = (25 * currentPage) - 1;
    if (!isLastPageFull && currentPage === totalPages) {
        endIndex -= ((25 * totalPages) - totalItems);
    }

    // Webpack casting
    return (allItems as unknown[] as TInventoryAsset[]).slice(startIndex, endIndex + 1);
}
