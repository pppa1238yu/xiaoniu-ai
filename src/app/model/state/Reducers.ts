import {combineReducers} from "redux";
import {Util} from "../../utils/Constants";

export enum WidthChangeState {
    TO_PORTRAIT,
    TO_LANDSCAPE,
    TO_DESKTOP,
    TO_MOBILE,
    NONE,
}

const DEFAULT_ID = 0;
export class Action {

    static REDUCER = (state = null, action, cls) => {
        if (action.type == cls.NAME) {
            return cls.REDUCER(state, action);
        } else {
            return state || cls.DEFAULT();
        }
    };

    static REDUCERS = (cls, reducers) => {
        reducers[cls.NAME] = (state = null, action) => Action.REDUCER(state, action, cls);
    };

    static ACTION = (data, cls) => {
        return {
            type: cls.NAME,
            data
        }
    };

    static CONNECT_PROPS = (props = null, state, cls, id = null) => {
        if (!props) {
            props = {};
        }
        if (id == null) {
            props[cls.NAME] = state[cls.NAME];
        } else {
            const s = state[cls.NAME];
            if (s[id]) {
                props[cls.NAME] = s[id];
            } else {
                props[cls.NAME] = s[DEFAULT_ID];
            }
        }

        return props;
    };

    static PROPS = (props, cls) => {

        return props[cls.NAME];
    };
}

export class WidthAction {
    currentWidth;
    device;
    change;

    static NAME = 'WidthAction';

    static DEFAULT() {
        return new WidthAction(window.innerWidth, WidthChangeState.NONE);
    }

    static REDUCER(state, action) {
        return action.data;
    }

    constructor(width, change) {
        this.change = change;
        this.currentWidth = width;
        this.device = Util.device(this.currentWidth);
    }
}

export class ScrollAction {
    currentScroll;

    static NAME = 'ScrollAction';

    static DEFAULT() {
        return new ScrollAction(window.scrollY);
    }

    static REDUCER(state, action) {
        return action.data;
    }

    constructor(scroll) {
        this.currentScroll = scroll;
    }
}

export class AlertAction {
    id;
    show;
    message;
    success;

    static NAME = 'AlertAction';

    static DEFAULT() {
        const defaults = {};
        defaults[DEFAULT_ID] = new AlertAction(false, "", false);
        return defaults;
    }

    static REDUCER(state, action) {
        const data = (Object as any).assign({}, state);
        data[action.data.id] = action.data;
        return data;
    }

    constructor(show, message, success, id = DEFAULT_ID) {
        this.show = show;
        this.message = message;
        this.success = success;
        this.id = id;
    }
}

export class ProgressAction {
    id;
    show;
    percent;

    static NAME = 'ProgressAction';

    static DEFAULT() {
        const defaults = {};
        defaults[DEFAULT_ID] = new ProgressAction(false, 0);
        return defaults;
    }

    static REDUCER(state, action) {
        const data = (Object as any).assign({}, state);
        data[action.data.id] = action.data;
        return data;
    }

    constructor(show, percent, id = DEFAULT_ID) {
        this.show = show;
        this.percent = percent;
        this.id = id;
    }
}

export class NLPAction {
    originText;
    results;
    natures;
    nature_select;

    static NAME = 'NLPAction';

    static DEFAULT() {
        return new NLPAction("", null, null);
    }

    static REDUCER(state, action) {
        return action.data;
    }

    constructor(originText, results, natures, nature_select = -1) {
        this.originText = originText;
        this.results = results;
        this.natures = natures;
        this.nature_select = nature_select;
    }
}

export class ChapterAction {
    originText;
    results;

    static NAME = 'ChapterAction';

    static DEFAULT() {
        return new ChapterAction("", null);
    }

    static REDUCER(state, action) {
        return action.data;
    }

    constructor(originText, results) {
        this.originText = originText;
        this.results = results;
    }
}

export class WordVecAction {
    texts;
    selectIndex;
    results;
    showInput;

    static NAME = 'WordVecAction';

    static DEFAULT() {
        return new WordVecAction([], -1, null, false);
    }

    static REDUCER(state, action) {
        return action.data;
    }

    constructor(texts, selectIndex, results, showInput) {
        this.texts = texts;
        this.selectIndex = selectIndex;
        this.results = results;
        this.showInput = showInput;
    }
}

const reducers = {};
Action.REDUCERS(WidthAction, reducers);
Action.REDUCERS(ScrollAction, reducers);
Action.REDUCERS(AlertAction, reducers);
Action.REDUCERS(ProgressAction, reducers);
Action.REDUCERS(NLPAction, reducers);
Action.REDUCERS(ChapterAction, reducers);
Action.REDUCERS(WordVecAction, reducers);
//reducers[WidthAction.NAME] = (state = null, action) => Action.REDUCER(state, action, WidthAction);
//reducers[ScrollAction.NAME] = (state = null, action) => Action.REDUCER(state, action, ScrollAction);
//reducers[AlertAction.NAME] = (state = null, action) => Action.REDUCER(state, action, AlertAction);

const rootReducer = combineReducers(
    reducers
);
export default reducers;