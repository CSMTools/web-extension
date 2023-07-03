import { Message, MessageType } from '../types/communication';

export default function communicationHandler(port: chrome.runtime.Port | browser.runtime.Port) {
  const listener = (m: Message) => {
    if (m.type === MessageType.HANDSHAKE) {
      port.postMessage({
        type: MessageType.HANDSHAKE,
        content: 'Handshakes exchanged'
      });
    }

    if (m.type === MessageType.FETCHREQUEST) {
      if (!Array.isArray(m.content)) {
        return;
      }

      if (typeof m.content[0] === 'string') {
        m.content[0] = encodeURI(m.content[0])
          .replace('+', '%2b');
      }

      fetch(...(m.content as [RequestInfo, RequestInit?]))
        .then(response => response.text())
        .then(response => {
          console.log(response);
          if (!m.transactionKey) {
            return;
          }

          port.postMessage({
            type: MessageType.FETCHRESPONSE,
            transactionKey: m.transactionKey,
            content: response
          });
        })
        .catch(err => {
          console.log(err);

          port.postMessage({
            type: MessageType.ERROR,
            transactionKey: m.transactionKey,
            content: 'Request Failed in backend, check log'
          });
        });
    }
  };

  port.onMessage.addListener(listener);
}
