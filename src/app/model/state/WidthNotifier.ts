import {DeviceType, Util} from "../../utils/Constants";
import {store} from "./Store";
import {Action, WidthAction, WidthChangeState} from "./Reducers";

class WidthListener {

    currentWidth = -1;
    broadcastWidth = -1;
    delay = null;

    listen() {
        window.addEventListener('resize', this.resizeHandler);
    }

    private broadcast() {
        if (this.broadcastWidth == this.currentWidth) {
            return;
        }
        const device = Util.device(this.currentWidth);
        let change = WidthChangeState.NONE;

        if (this.broadcastWidth >= 0) {
            const lastDevice = Util.device(this.broadcastWidth);
            if (lastDevice != device) {
                switch (device) {
                    case DeviceType.MOBILE:
                        change = WidthChangeState.TO_MOBILE;
                        break;
                    case DeviceType.DESKTOP:
                        change = WidthChangeState.TO_DESKTOP;
                        break;
                    case DeviceType.TABLET_PORTRAIT:
                        change = WidthChangeState.TO_PORTRAIT;
                        break;
                    case DeviceType.TABLET_LANDSCAPE:
                        change = WidthChangeState.TO_LANDSCAPE;
                        break;
                }
            }
        }

        this.broadcastWidth = this.currentWidth;

        store.dispatch(Action.ACTION(new WidthAction(this.currentWidth, change), WidthAction));
    }

    private static DELAY_TIME = 40;

    private delayBroadcast() {
        if (this.delay != null) {
            return;
        }
        this.delay = setTimeout(() => {
            this.broadcast();
            this.delay = null;
        }, WidthListener.DELAY_TIME);
    }

    private resizeHandler: () => void = () => {
        const width = window.innerWidth;
        if (width != this.currentWidth) {
            this.currentWidth = width;
            this.delayBroadcast();
        }
    };
}

export let widthListener = new WidthListener();
