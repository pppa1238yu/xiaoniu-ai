import {store} from "./Store";
import {Action, ScrollAction} from "./Reducers";

class ScrollListener {

    currentScroll = -1;
    broadcastScroll = -1;
    delay = null;

    listen() {
        window.addEventListener('scroll', this.scrollHandler);
    }

    private broadcast() {
        if (this.broadcastScroll == this.currentScroll) {
            return;
        }

        this.broadcastScroll = this.currentScroll;

        store.dispatch(Action.ACTION(new ScrollAction(this.currentScroll), ScrollAction));
    }

    private static DELAY_TIME = 100;

    private delayBroadcast() {
        if (this.delay != null) {
            return;
        }
        this.delay = setTimeout(() => {
            this.broadcast();
            this.delay = null;
        }, ScrollListener.DELAY_TIME);
    }

    private scrollHandler: () => void = () => {
        const scroll = window.scrollY;
        if (scroll != this.currentScroll) {
            this.currentScroll = scroll;
            this.delayBroadcast();
        }
    };
}

export let scrollListener = new ScrollListener();
