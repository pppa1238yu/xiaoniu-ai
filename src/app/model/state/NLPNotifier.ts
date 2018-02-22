import {store} from "./Store";
import {Action, NLPAction} from "./Reducers";

class NLPListener {

    MAX_INPUT = 2000;


    setNewValue(origin, dispatch = true) {
        if (origin.length > this.MAX_INPUT) {
            origin = origin.substring(0, this.MAX_INPUT);
        }
        return this.notify(origin, null, null, -1, dispatch);
    }

    notify(origin, results, natures, nature_select = -1, dispath = true) {
        if (nature_select == -1 && natures != null && natures.length > 0) {
            nature_select = 0;
        }
        if (dispath) {
            store.dispatch(Action.ACTION(new NLPAction(origin, results, natures, nature_select), NLPAction));
        } else {
            return Action.ACTION(new NLPAction(origin, results, natures, nature_select), NLPAction);
        }
    }
}

export let nlpListener = new NLPListener();
