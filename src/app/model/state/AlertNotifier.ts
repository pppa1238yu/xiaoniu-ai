import {store} from "./Store";
import {Action, AlertAction} from "./Reducers";

class AlertListener {
    dismisses = {};
    static AUTO_DISMISS_TIME = 600000;

    notify(id, show, message = "", success = false, dispath = true) {
        if (show) {
            if (this.dismisses[id]) {
                clearTimeout(this.dismisses[id]);
            }
            this.dismisses[id] = setTimeout(() => {
                this.notify(id, false);
            }, AlertListener.AUTO_DISMISS_TIME);
        } else if (this.dismisses[id]) {
            clearTimeout(this.dismisses[id]);
            this.dismisses[id] = null;
        }
        if (dispath) {
            store.dispatch(Action.ACTION(new AlertAction(show, message, success, id), AlertAction));
        } else {
            return Action.ACTION(new AlertAction(show, message, success, id), AlertAction);
        }
    }
}

export let alertListener = new AlertListener();
