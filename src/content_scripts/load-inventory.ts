import { Message, MessageType, WindowMessage } from '../types/communication';

if (typeof browser === 'undefined') {
    // @ts-ignore
    // eslint-disable-next-line no-var
    var browser = chrome;
}

// Inject script into page
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inventory-inject.js');
(document.head || document.documentElement).appendChild(s);

// Establish communication with background and 
const backend = browser.runtime.connect({ name: 'inventory' });
backend.postMessage({
    type: MessageType.HANDSHAKE,
    content: 'Requesting handshake'
});

// Listen for messages from backend
backend.onMessage.addListener((m: Message) => {
  if (m.type === MessageType.HANDSHAKE) {
    console.log(m.content);
  }
  if (m.type === MessageType.DATA) {
    window.postMessage({
        isFromPage: false,
        content: m.content,
        type: m.type
    } as WindowMessage, 'https://steamcommunity.com/*');
  }
  if (m.type === MessageType.FETCHRESPONSE) {
    window.postMessage({
        isFromPage: false,
        content: m.content,
        transactionKey: m.transactionKey,
        type: m.type
    } as WindowMessage, 'https://steamcommunity.com/*');
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
