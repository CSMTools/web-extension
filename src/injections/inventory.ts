import { getFadeName, getGradient } from '@csmtools/fadegradients';
import htmlEngine from '../lib/html-engine';
import { generateId } from '../lib/utils';
import inventoryOverlay from '../templates/inventory-overlay';
import { ItemData } from '../types/api';
import { MessageType, WindowMessage } from '../types/communication';

const inspectedItems: string[] = [];

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
        } as WindowMessage, 'https://steamcommunity.com/*');
    });
}

window.addEventListener('message',
    ({ data: m }: { data: WindowMessage }) => {
        if (m.isFromPage) {
            return;
        }

        console.log(m.content);
    }, false);

function main() {
    const items = UserYou.getInventory(730, 2).m_rgAssets;
    for (const itemId in items) {
        if (Object.prototype.hasOwnProperty.call(items, itemId)) {
            const item = items[itemId];

            // Item is not unique
            if (item.description.commodity) {
                continue;
            }

            // Check tags
            if (item.description.tags.find(tag => tag.internal_name === 'Type_CustomPlayer' || tag.internal_name === 'CSGO_Type_Collectible')) {
                continue;
            }

            // Item can not be inspected
            if (!item.description.actions) {
                continue;
            }

            // If the item has already been inspected, continue, this can happen when not all items are loaded at first and when they're loaded it tries to inspect twice.
            if (inspectedItems.includes(item.assetid)) {
                continue;
            }

            const link = formatLink(item.description.actions[0].link, UserYou.strSteamId, item.assetid);
            fetch(`http://localhost:3000/api/inspect?link=${decodeURIComponent(link)}`)
                .then(response => {
                    const itemData = JSON.parse(response) as ItemData;
                    
                    item.element.innerHTML += htmlEngine.render(inventoryOverlay, {
                        float: itemData.paintwear.toFixed(4),
                        fadePercentage: itemData.fadePercentage === null ? '' : itemData.fadePercentage.toFixed(2),
                        fadeGradient: itemData.fadePercentage === null ? 'transparent' : getGradient(getFadeName(itemData.paintindex), itemData.fadePercentage)
                    });

                    inspectedItems.push(item.assetid);
                })
                .catch(console.log);
        }
    }
}

// Hopefully temporary
let isFirstLoadDone = false;
let delay = 0;
function loopableDelay() {
    delay += 100;
    console.log(Object.keys(UserYou.getInventory(730, 2).m_rgAssets).filter(k => !!k.match(/^\d+$/g)).length, UserYou.getInventory(730, 2).m_bFullyLoaded);
    console.log(delay);
    if (Object.keys(UserYou.getInventory(730, 2).m_rgAssets).filter(k => !!k.match(/^\d+$/g)).length > 0) {
        if (!isFirstLoadDone) {
            main();
            isFirstLoadDone = true;
        }

        if (!UserYou.getInventory(730, 2).m_bFullyLoaded) {
            setTimeout(loopableDelay, delay);
        } else {
            main();
        }
    } else {
        setTimeout(loopableDelay, delay);
    }
}
loopableDelay();


function formatLink(link: string, owner: string, asset: string) {
    return link.replace('%owner_steamid%', owner).replace('%assetid%', asset);
}
