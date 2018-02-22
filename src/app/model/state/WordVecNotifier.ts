import {store} from "./Store";
import {Action, WordVecAction} from "./Reducers";

class WordVecListener {

    MAX_INPUT = 8;

    setNewValue(texts, dispatch = true) {
        if (texts.length > this.MAX_INPUT) {
            texts = texts.slice(-this.MAX_INPUT);
        }
        return this.notify(texts, texts.length - 1, null, false, dispatch);
    }

    notify(texts, selectIndex, results, showInput, dispatch = true) {
        if (texts.length > this.MAX_INPUT) {
            if (selectIndex >= this.MAX_INPUT) {
                selectIndex = this.MAX_INPUT - 1;
            }
            texts = texts.slice(-this.MAX_INPUT);
        }
        if (dispatch) {
            store.dispatch(Action.ACTION(new WordVecAction(texts, selectIndex, results, showInput), WordVecAction));
        } else {
            return Action.ACTION(new WordVecAction(texts, selectIndex, results, showInput), WordVecAction);
        }
    }
}

export let wordVecListener = new WordVecListener();
