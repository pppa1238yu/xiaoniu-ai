import {store} from "./Store";
import {Action, ChapterAction} from "./Reducers";

class ChapterListener {

    MAX_INPUT = 2000;


    setNewValue(origin, dispatch = true) {
        if (origin.length > this.MAX_INPUT) {
            origin = origin.substring(0, this.MAX_INPUT);
        }
        return this.notify(origin, null, dispatch);
    }

    notify(origin, results, dispatch = true) {
        if (dispatch) {
            store.dispatch(Action.ACTION(new ChapterAction(origin, results), ChapterAction));
        } else {
            return Action.ACTION(new ChapterAction(origin, results), ChapterAction);
        }
    }
}

export let chapterListener = new ChapterListener();
