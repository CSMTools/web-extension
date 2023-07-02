/// <reference types="web-ext-types"/>

import communicationHandler from '../../lib/background-communication';

browser.runtime.onConnect.addListener(communicationHandler);
