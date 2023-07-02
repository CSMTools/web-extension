export enum MessageType {
    HANDSHAKE,
    FETCHREQUEST,
    FETCHRESPONSE,
    DATA,
    ERROR
}

// Message between background and content script
export type Message = {
    type: MessageType;
    transactionKey?: string;
    content: unknown;
}

export type WindowMessage = {
    type: MessageType;
    isFromPage: boolean;
    transactionKey?: string;
    content: unknown;
}
