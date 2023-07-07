/// <reference types="web-ext-types"/>

import communicationHandler from '../../lib/background/background-communication';

browser.runtime.onConnect.addListener(communicationHandler);
