import * as React from "react";

import {connect} from "react-redux";

import Header from "../components/Header";
import Alert from "../components/Alert";
import {Action, ChapterAction, NLPAction, WordVecAction} from "../model/state/Reducers";
import {blueGrey100, grey50, grey800} from "../utils/colors";
import {alertListener} from "../model/state/AlertNotifier";
import {progressListener} from "../model/state/ProgressNotifier";
import {store} from "../model/state/Store";
import {batchActions} from "redux-batched-actions";
import {http} from "../model/ajax/Http";
import {Util} from "../utils/Constants";
import {nlpListener} from "../model/state/NLPNotifier";
import {chapterListener} from "../model/state/ChapterNotifier";
import {wordVecListener} from "../model/state/WordVecNotifier";

declare let $;
declare let echarts;

class NLP extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 1
        }
    }

    isAnimate = false;

    static PATH = "/nlp";
    static NAME = "自然语言处理";

    animate = (thisSlideIndex) => {
        this.setState({
            slideIndex: thisSlideIndex,
        });

        const offsetTop = $('#section' + thisSlideIndex).position().top;

        $('body,html').stop().animate({
            scrollTop: offsetTop - 66
        }, 700, () => {
            this.isAnimate = false
        });

    };

    componentDidMount() {
        const tops = [];
        for (const i of [1, 2, 3, 4]) {
            tops.push($('#section' + i).position().top);
        }
        $(window).on('mousewheel DOMMouseScroll', (event) => {
            event.stopPropagation();
            let top = $(document).scrollTop();
            let d = true;
            for (const i of [3, 2, 1, 0]) {
                if (top >= tops[i] - 400) {
                    this.setState({
                        slideIndex: (i + 1)
                    });
                    d = false;
                    break;
                }
            }
            if (d) {
                this.setState({
                    slideIndex: 1
                });
            }
        });
    }

    componentWillMount() {
        this.clearAllAlertAndProgress();
        $(window).scrollTop(0);
    }

    componentWillUnmount() {
        this.clearAllAlertAndProgress();
        $(window).off('mousewheel DOMMouseScroll');
    }

    ids = [1];
    clearAllAlertAndProgress = () => {
        const actions = [];
        for (const i of this.ids) {
            actions.push(alertListener.notify(i, false, "", false, false));
            actions.push(progressListener.notify(i, false, false));
        }
        store.dispatch(batchActions(actions));
    };

    clearAlertAndProgress = (id) => {
        const actions = [];
        actions.push(alertListener.notify(id, false, "", false, false));
        actions.push(progressListener.notify(id, false, false));
        store.dispatch(batchActions(actions));
    };

    render() {
        //const scroll = Action.PROPS(this.props, ScrollAction).currentScroll;
        return (
            <div id="content" className="relative">
                <AsideLink slideIndex={this.state.slideIndex} animate={this.animate}/>
                <div id="super-container">
                    <Header path={NLP.PATH} fixScroll listIndex={1}/>
                    <div id="section1" className="easing flex-column relative">
                        <NLPWithState idx={this.ids[0]}/>
                    </div>
                </div>
            </div>

        )
    }
}

class NLPApi extends React.Component<any, any> {

    static MAX_WORD_LEN = 8;
    styles = {
        tip: {
            padding: "8px 0px",
            textAlign: 'right',
            cursor: 'pointer',
            color: blueGrey100,
        },
        natureContainer: {
            padding: '8px 12px',
            backgroundColor: '#e0e0e0',
            whiteSpace: 'pre-wrap',
            height: 100,
        },
    };

    version = Util.unixTime();

    samples = [];
    lastIndex = -1;

    setRandomIndex = (change = true) => {
        let index;
        while (true) {
            index = Math.floor(Math.random() * this.samples.length);
            if (index != this.lastIndex) {
                this.lastIndex = index;
                break;
            }
        }
        if (change) {
            const nlpAction = nlpListener.setNewValue(this.samples[index], false);
            const chapterAction = chapterListener.setNewValue(this.samples[index], false);
            const vecAction = wordVecListener.setNewValue([], false);
            this.needUpdateKey = true;
            store.dispatch(batchActions([nlpAction, chapterAction, vecAction]));
        }

        return this.samples[index];
    };

    needFocusInput = false;
    needUpdateKey = false;
    needUpdateVec = false;

    state = {
        value: "",
    };

    request = (text) => {

        const currentVersion = ++this.version;

        http.post("/nlp", {text})
            .then((response) => {
                if (this.version != currentVersion) {
                    return;
                }

                progressListener.complete(this.props.idx);

                const nlpAction = nlpListener.notify(response.seg.origin, response.seg.result, response.seg.nature, -1, false);

                let keyResult = response.key.results;
                if (keyResult == null) {
                    keyResult = ['目标文章过短']
                }

                const chapterAction = chapterListener.notify(response.key.origin, keyResult, false);
                let similarResult = response.similar.results;
                if (response.key.shorts.length != 0 && (similarResult == null || similarResult.length == 0)) {
                    similarResult = ['没有找到相似词啦'];
                }
                const vecAction = wordVecListener.notify(response.key.shorts, 0, similarResult, false, false);

                this.needUpdateKey = true;
                this.needUpdateVec = true;
                store.dispatch(batchActions([nlpAction, chapterAction, vecAction]));
            }).catch(() => {
            if (this.version != currentVersion) {
                return;
            }
            const alertAction = alertListener.notify(this.props.idx, true, "分析文本失败", false, false);
            const progressAction = progressListener.notify(this.props.idx, false, false);
            store.dispatch(batchActions([alertAction, progressAction]));

        });

        const alertAction = alertListener.notify(this.props.idx, false, "", false, false);
        const progressAction = progressListener.notify(this.props.idx, true, false);
        store.dispatch(batchActions([alertAction, progressAction]));
    };

    requestVec = (text, texts, index, show) => {

        const currentVersion = ++this.version;

        http.post("/wordvec", {text})
            .then((response) => {
                if (this.version != currentVersion) {
                    return;
                }

                progressListener.complete(this.props.idx);

                this.needUpdateVec = true;

                let similarResult = response.results;
                if (similarResult == null || similarResult.length == 0) {
                    similarResult = ['没有找到相似词啦'];
                }
                wordVecListener.notify(texts, index, similarResult, show);

            }).catch(() => {
            if (this.version != currentVersion) {
                return;
            }
            const alertAction = alertListener.notify(this.props.idx, true, "获取相似失败", false, false);
            const progressAction = progressListener.notify(this.props.idx, false, false);
            store.dispatch(batchActions([alertAction, progressAction]));
        });

        const alertAction = alertListener.notify(this.props.idx, false, "", false, false);
        const progressAction = progressListener.notify(this.props.idx, true, false);
        store.dispatch(batchActions([alertAction, progressAction]));
    };

    componentDidUpdate() {
        if (this.needUpdateKey) {
            this.needUpdateKey = false;
            const chapter = Action.PROPS(this.props, ChapterAction);
            if (chapter.results != null) {
                let weight = 10;
                const word_array = [];
                for (const value of chapter.results) {
                    word_array.push({
                        text: value,
                        weight: weight,
                    });
                    weight = weight - 2;
                }

                const ele = $(".keyword  > div:last-child ");
                ele.html('');
                ele.jQCloud(word_array);
            } else {
                const ele = $(".keyword  > div:last-child ");
                ele.html('');
            }
        }
        if (this.needUpdateVec) {
            this.needUpdateVec = false;
            const vec = Action.PROPS(this.props, WordVecAction);
            if (vec.results != null) {
                const word_array = [];
                let weight = 12;
                for (const value of vec.results) {
                    word_array.push(
                        {
                            text: value,
                            weight: weight,
                        });
                    weight = weight - 1;
                }

                const ele = $(".wordvec > div:last-child ");
                ele.html('');
                ele.jQCloud(word_array);
            } else {
                const ele = $(".wordvec > div:last-child ");
                ele.html('');
            }

        }
        if (this.needFocusInput) {
            this.needFocusInput = false;
            $("input.input").focus();
        }
    }

    componentDidMount() {
        const currentVersion = ++this.version;

        http.get("/fetchsegment", {})
            .then((response) => {
                if (this.version != currentVersion) {
                    return;
                }
                this.samples = response;
                const text = this.setRandomIndex();

                this.request(text);
            }).catch(() => {
            if (this.version != currentVersion) {
                return;
            }

            const actions = [];
            actions.push(alertListener.notify(this.props.idx, true, "获取示例失败", false, false));
            actions.push(progressListener.notify(this.props.idx, false, false));
            store.dispatch(batchActions(actions));
        });
    }

    render() {
        const nlp = Action.PROPS(this.props, NLPAction);
        const vec = Action.PROPS(this.props, WordVecAction);
        return (
            <div className="nlp root-container">
                <Alert idx={this.props.idx}/>
                <div className="title-container">
                    <span className="title">文本分析</span>
                </div>
                <div className="relative">
                    <div id="nlp-input" className="relative div-radio">
                        <textarea className="div-radio"
                                  placeholder="请输入需要分析的文本"
                                  value={nlp.originText}
                                  onChange={(v) => {
                                      const value = v.target.value;
                                      if (value.length > nlpListener.MAX_INPUT) {
                                          //ignore
                                      } else {
                                          nlpListener.setNewValue(value);
                                      }
                                  }}

                        />
                        <div className="float-text">
                            <small>还可以输入{" " + (nlpListener.MAX_INPUT - nlp.originText.length) + " "}字</small>
                        </div>
                    </div>
                    <div className="relative button-group">
                        <button type="button" className="btn btn-secondary"
                                onClick={() => {
                                    const text = nlp.originText.trim();
                                    if (text) {
                                        this.request(text);
                                    }
                                }
                                }>提交文本
                        </button>
                        <button type="button" className="btn btn-secondary"
                                onClick={
                                    () => {
                                        const text = this.setRandomIndex();
                                        this.request(text);
                                    }
                                }
                        >换一个示例
                        </button>
                    </div>
                </div>
                <div className="result-margin"/>
                <div id="section2" className="segment div-radio flex-center">
                    <div className="relative">
                        <div className="float-title">
                            <span>分词和词性标注</span>
                        </div>
                        {
                            nlp.results != null ?
                                <div>
                                    {
                                        nlp.results.map((ele, index) => {
                                            if (ele.nature == null) {
                                                return <br key={index}/>
                                            }
                                            let clx = "btn-info";
                                            if (nlp.nature_select >= 0 && nlp.natures[nlp.nature_select] == ele.nature) {
                                                clx = "btn-primary";
                                            }
                                            return <button key={index} type="button" className={"btn " + clx}
                                                           onClick={() => {
                                                               let des = -1;
                                                               let i = 0;
                                                               for (const nature of nlp.natures) {
                                                                   if (nature == ele.nature) {
                                                                       des = i;
                                                                       break;
                                                                   }
                                                                   i++;
                                                               }
                                                               if (des >= 0) {
                                                                   nlpListener.notify(nlp.originText, nlp.results, nlp.natures, des);
                                                               }

                                                           }}>
                                                {ele.word}
                                            </button>
                                        })
                                    }
                                </div>
                                : null
                        }
                    </div>
                    <div/>
                    <div>
                        <div>
                            <span className="float-title">词性类别</span>
                        </div>
                        <div>

                            {
                                nlp.natures == null ? null :
                                    nlp.natures.map((ele, index) => {
                                        const clx = index == nlp.nature_select ? "btn-primary" : "btn-secondary";
                                        return (
                                            <button key={index} type="button" className={"btn " + clx}
                                                    onClick={() => {
                                                        nlpListener.notify(nlp.originText, nlp.results, nlp.natures, index);
                                                    }}>{ele}</button>
                                        );
                                    })
                            }
                        </div>
                    </div>
                </div>
                <div className="result-margin"/>
                <div id="section3" className="keyword div-radio">
                    <div>
                        <span className="float-title">文章关键词抽取</span>
                    </div>
                    <div>

                    </div>
                </div>
                <div className="result-margin"/>
                <div id="section4" className="wordvec div-radio">
                    <div>
                        <span className="float-title">语义联想</span>
                    </div>
                    <div className="flex-center">
                        {
                            vec.texts == null ? null :
                                vec.texts.map((ele, index) => {
                                    const clx = index == vec.selectIndex ? "btn-primary" : "btn-secondary";
                                    return (
                                        <button key={index} type="button" className={"btn " + clx}
                                                onClick={() => {
                                                    if (index != vec.selectIndex) {
                                                        wordVecListener.notify(vec.texts, index, null, vec.showInput);
                                                        this.requestVec(ele, vec.texts, index, vec.showInput);
                                                    }
                                                }}>{ele}</button>
                                    );
                                })
                        }
                        {
                            vec.showInput ?
                                <input type="text" className="input"
                                       onKeyDown={(event) => {
                                           if (event.keyCode == 13 && this.state.value != "") {
                                               this.setState({
                                                   value: ""
                                               });
                                               vec.texts.push(this.state.value);
                                               wordVecListener.setNewValue(vec.texts);
                                               this.requestVec(this.state.value, vec.texts, vec.texts.length - 1, false);
                                           }
                                       }}
                                       value={this.state.value}
                                       onChange={(v) => {
                                           const value = v.target.value;
                                           if (value.length <= NLPApi.MAX_WORD_LEN) {
                                               this.setState({
                                                   value: value
                                               })
                                           }
                                       }}
                                />
                                :
                                <button type="button" className="btn btn-secondary input"
                                        onClick={() => {
                                            wordVecListener.notify(vec.texts, vec.selectIndex, vec.results, true);
                                            this.needFocusInput = true;
                                        }}>＋自定义添加</button>
                        }
                    </div>
                    <div>

                    </div>
                </div>
                <div className="bottom-margin"/>
            </div>
        )
    }
}

const NLPWithState = connect((state) => {
    const props = Action.CONNECT_PROPS(null, state, ChapterAction);
    Action.CONNECT_PROPS(props, state, WordVecAction);
    return Action.CONNECT_PROPS(props, state, NLPAction);
})(NLPApi);

// 侧边栏滚动监听
class AsideLink extends React.Component<any, any> {
    styles = {
        navStyle: {
            position: 'fixed',
            left: 20,
            top: 180,
            overflow: 'hidden',
            zIndex: 12
        }
    };


    render() {
        const slideIndex = this.props.slideIndex;
        return (
            <nav style={this.styles.navStyle as any}>
                <div>
                    <ul id="asideNav">
                        <li onClick={() => this.props.animate(1)}>
                            输入原文
                            <i className={slideIndex == 1 ? "active asideLabel" : "asideLabel"}/>
                        </li>
                        <li onClick={() => this.props.animate(2)}
                            id="chinese"
                            data-toggle="popover"
                            data-trigger="focus"
                            onMouseEnter={ () => {
                                $('#chinese').popover('show')
                            }}
                            onMouseLeave={ () => {
                                $('#chinese').popover('hide')
                            }}
                            data-content="词是最小的的语言单位，分词是很多自然语言处理任务的基础。然而，汉语不像西方语言，词与词之间没有分隔符。因此，中文分词是一项既重要又有难度的问题。本分词模块采用深度学习技术，能有效识别新词、时间字符串等未登录词，在人民日报2014年语料测试集上能达到99%的准确率。"
                        >
                            分词与词性标注
                            <i className={slideIndex == 2 ? "active asideLabel" : "asideLabel"}/>
                        </li>
                        <li onClick={() => this.props.animate(3)}
                            id="mainWords"
                            data-toggle="popover"
                            data-trigger="focus"
                            onMouseEnter={ () => {
                                $('#mainWords').popover('show')
                            }}
                            onMouseLeave={ () => {
                                $('#mainWords').popover('hide')
                            }}
                            data-content="关键词提取在于自动获取描述文档主旨的词项，可用于文本挖掘、信息检索等后续自然语言处理任务。本关键词提取模块能够尽量做到对于文章涉及到的主旨的不重不漏，并给出不定长度的短语形式的结果。"
                        >
                            文章关键字抽取
                            <i className={slideIndex == 3 ? "active asideLabel" : "asideLabel"}/>
                        </li>
                        <li onClick={() => this.props.animate(4)}
                            id="concact"
                            data-toggle="popover"
                            data-trigger="focus"
                            onMouseEnter={ () => {
                                $('#concact').popover('show')
                            }}
                            onMouseLeave={ () => {
                                $('#concact').popover('hide')
                            }}
                            data-content='通过在大规模语料集上进行无监督学习，得到具有语义的词向量表示。词向量之间的相似度反映了语义之间的相似度。本语义联想模块在全量中文维基百科语料上训练，质量可靠，涵盖面广。'
                        >
                            语意联想
                            <i className={slideIndex == 4 ? "active asideLabel" : "asideLabel"}/>
                        </li>
                    </ul>
                </div>
            </nav>

        )
    }
}

export default NLP;
