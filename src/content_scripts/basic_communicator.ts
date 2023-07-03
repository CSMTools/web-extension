import targetOrigins from '../data/target-origins';
import { Message, MessageType, WindowMessage } from '../types/communication';

if (typeof browser === 'undefined') {
    // @ts-ignore
    // eslint-disable-next-line no-var
    var browser = chrome;
}

// Inject scripts and css into page
injectResources();

// Establish communication with background and 
const backend = browser.runtime.connect({ name: 'inventory' });
backend.postMessage({
    type: MessageType.HANDSHAKE,
    content: 'Requesting handshake'
});

// Listen for messages from backend
backend.onMessage.addListener((m: Message) => {
  if (m.type === MessageType.HANDSHAKE) {
    console.log('Handshake completed, backend is connected.');
  }
  if (m.type === MessageType.DATA) {
    window.postMessage({
        isFromPage: false,
        content: m.content,
        type: m.type
    } as WindowMessage, targetOrigins.INVENTORY);
  }
  if (m.type === MessageType.FETCHRESPONSE) {
    window.postMessage({
        isFromPage: false,
        content: m.content,
        transactionKey: m.transactionKey,
        type: m.type
    } as WindowMessage, targetOrigins.INVENTORY);
  }
  if (m.type === MessageType.ERROR) {
    window.postMessage({
        isFromPage: false,
        content: m.content,
        transactionKey: m.transactionKey,
        type: m.type
    } as WindowMessage, targetOrigins.INVENTORY);
  }
});

// Listen for messages from page
window.addEventListener(
    'message',
    ({ data: m }: {data: WindowMessage}) => {
        if (!m.isFromPage) {
            return;
        }

        if (m.type === MessageType.FETCHREQUEST) {
            backend.postMessage({
                type: MessageType.FETCHREQUEST,
                transactionKey: m.transactionKey ?? undefined,
                content: m.content
            } as Message);
        }
    },
    false
);

function injectResources() {
    const s = document.createElement('script');
    const c = document.createElement('link');

    c.rel = 'stylesheet';

    if (window.location.href.match(/^.+:\/\/steamcommunity\.com\/.+\/.+\/inventory.*$/)) {
        s.src = chrome.runtime.getURL('inventory-inject.js');
        c.href = chrome.runtime.getURL('css/inventory.css');

        injectHintCSS();
    }

    (document.head || document.documentElement).appendChild(s);
    (document.head || document.documentElement).appendChild(c);
}


function injectHintCSS() {
    const c = document.createElement('link');

    c.rel = 'stylesheet';
    c.href = chrome.runtime.getURL('css/hint.min.css');

    (document.head || document.documentElement).appendChild(c);
}
