import {store} from "./Store";
import {Action, ProgressAction} from "./Reducers";

class ProgressListener {
    dismisses = {};
    static AUTO_DISMISS_STEP = 20;
    static AUTO_DISMISS_PAUSE = 300;
    static STEP = 1;
    static OVER = 400;
    shows = {};

    currentPercent = 0;

    notify(id, show, dispatch = true) {
        this.shows[id] = show;
        if (show) {
            if (this.dismisses[id]) {
                clearTimeout(this.dismisses[id]);
            }
            this.currentPercent = 0;
            this.dismisses[id] = setTimeout(() => {
                this.step(id);
            }, ProgressListener.AUTO_DISMISS_STEP);
        } else if (this.dismisses[id]) {
            clearTimeout(this.dismisses[id]);
            this.dismisses[id] = null;
        }
        if (dispatch) {
            store.dispatch(Action.ACTION(new ProgressAction(show, this.currentPercent, id), ProgressAction));
        } else {

            return Action.ACTION(new ProgressAction(show, this.currentPercent, id), ProgressAction);
        }
    }

    complete(id) {
        this.shows[id] = true;
        if (this.dismisses[id]) {
            clearTimeout(this.dismisses[id]);
        }
        this.dismisses[id] = setTimeout(() => {
            this.notify(id, false);
        }, ProgressListener.OVER);
        store.dispatch(Action.ACTION(new ProgressAction(true, 100, id), ProgressAction));
    }

    step = (id) => {
        if (!this.shows[id]) {
            return;
        }
        if (this.currentPercent + ProgressListener.STEP < 100) {
            this.currentPercent += ProgressListener.STEP;
            store.dispatch(Action.ACTION(new ProgressAction(true, this.currentPercent, id), ProgressAction));

            let time = 0;
            if (this.currentPercent == 20 || this.currentPercent == 70) {
                time = ProgressListener.AUTO_DISMISS_PAUSE;
            } else {
                time = ProgressListener.AUTO_DISMISS_STEP
            }
            this.dismisses[id] = setTimeout(() => {
                this.step(id);
            }, time);
        }
    }
}

export let progressListener = new ProgressListener();
