import {store} from "./Store";
export default class Updater {
    action: Function = null;

    registerAction(action: Function) {
        this.action = action;
    }

    doUpdate() {
        store.dispatch(this.action());
    }
}
