import type { ItemData } from '@csmtools/types';
import targetOrigins from '../data/target-origins';
import { generateId } from '../lib/utils';
import { MessageType, WindowMessage } from '../types/communication';
import { INV_CONTEXT } from '../data/constants';
import type { Asset } from '../types/steam.d.ts';
import config from '../config';

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

    window.postMessage(
      {
        isFromPage: true,
        content: args,
        transactionKey: transactionKey,
        type: MessageType.FETCHREQUEST,
      } as WindowMessage,
      targetOrigins.INVENTORY
    );
  });
}

window.addEventListener(
  'message',
  ({ data: m }: { data: WindowMessage }) => {
    if (m.isFromPage) {
      return;
    }
  },
  false
);

// End communication stuff

const loadedItems: { [key: `${number}`]: ItemData | null } = {};

function loadItemsOnPage() {
  const inspectLinks: { [listingId: `${number}`]: string } = {};
  if (g_rgListingInfo) {
    for (const listing of Object.values(g_rgListingInfo)) {
      if (typeof listing === 'function') {
        continue;
      }

      const { listingid: listingId } = listing;
      const assetId = listing.asset.id;

      loadedItems[assetId] = null;

      inspectLinks[listingId] = listing.asset.market_actions?.[0].link
        .replace('%listingid%', listingId)
        .replace('%assetid%', assetId);
    }
    // Fallback as apparantly g_rgListingInfo can be undefined?
  } else if (g_rgAssets && g_rgAssets[INV_CONTEXT[0]] && g_rgAssets[INV_CONTEXT[0]][INV_CONTEXT[1]]) {
    for (const asset of Object.values(g_rgAssets[INV_CONTEXT[0]][INV_CONTEXT[1]]) as Asset[]) {
      if (typeof asset === 'function') {
        continue;
      }

      const assetId = asset.id;

      loadedItems[assetId] = null;

      inspectLinks[asset.market_actions?.[0].link.match(/M(\d+)/)[1]] = asset.market_actions?.[0].link.replace('%assetid%', assetId);
    }
  }

  for (const listingId in inspectLinks) {
    const link = inspectLinks[listingId];

    if (typeof link === 'function') {
        continue;
    }

    fetch(`${config.api.base_url}/inspect?link=${decodeURIComponent(link)}&additional=true`)
            .then(response => {
                if (JSON.parse(response)?.errorCode === 500) {
                    return;
                }

                const itemData = JSON.parse(response) as ItemData;

                loadedItems[itemData.a] = itemData;

                const float = `<br>\n<p>${itemData.paintwear}</p>`;

                document.getElementById(`listing_${listingId}`)
                    .getElementsByClassName('market_listing_item_name_block')[0]
                    .innerHTML += float;

                console.log(itemData);
            })
            .catch(console.log);
  }
}

loadItemsOnPage();
