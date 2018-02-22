import * as React from "react";

import {connect} from "react-redux";

import Header from "../components/Header";
import Alert from "../components/Alert";
import {blueGrey100, grey50, grey700} from "../utils/colors";
import {default as Constants, Util} from "../utils/Constants";
import {Dialog} from "../components/Dialog";
import {alertListener} from "../model/state/AlertNotifier";
import {http} from "../model/ajax/Http";
import {progressListener} from "../model/state/ProgressNotifier";
import {batchActions} from "redux-batched-actions";
import {store} from "../model/state/Store";
import Identification  from "./Identification";
import Cardiogram from "./Cardiogram";
declare let $;

class ImageProcessing extends React.Component<any, any> {
    static PATH = "/image-processing";
    static NAME = "图像处理";

    styles = {
        page: {},
        container: {
            backgroundColor: '#f5f8e7',
            padding: '24px 24px 32px',
        },
        resultTip: {
            lineHeight: "1",
        },
        resultText: {
            fontSize: '3rem',
            fontWeight: 600,
            letterSpacing: '3px',
            color: '#333042',
        },
        content: {
            width: 240,
            height: 76,
            borderRadius: 4,
            backgroundColor: '#fff',
            border: '1px solid #9f9f9f',
        },
        contentResult: {
            width: 240,
            height: 76,
            borderRadius: 4,
            backgroundColor: '#b6b5b5'
        },
        contentImg: {
            marginLeft: 16,
            width: '100%',
            height: '100%',
            display: 'block',
            margin: '8px auto'
        },
        selfContent: {
            width: 400,
            margin: 'auto',
            display: 'flex',
            marginTop: 33,
            justifyContent: 'space-between'
        },
        selectText: {
            padding: '9.5px 40px',
            fontSize: 14,
            color: '#fff',
            backgroundColor: '#b6b5b5',
            cursor: 'pointer',
            width: 160,
        },
        selectDropDownMenu: {
            width: 160,
            color: '#fff',
            backgroundColor: '#b6b5b5',
            fontSize: 14
        },
        selectIcon: {
            width: 60,
            height: 60,
        },
        checkBox: {
            width: 540,
            height: 76,
            margin: 'auto',
            display: 'flex',
            justifyContent: 'space-between'
        },
        dropDown: {
            width: 230,
            backgroundColor: '#ff9700',
            padding: '9.5px 80px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14
        },
        dropDownMenu: {
            width: 230,
            color: '#fff',
            backgroundColor: '#b6b5b5',
            fontSize: 14
        },
        rightArrow: {
            width: 40,
            verticalAlign: '-30px'
        },
        minPadding: {
            paddingBottom:45
        },
        description: {
            color: '#646464',
            padding: '10px 0 20px 0',
            width:800,
            margin:'auto'
        }
    };

    samples = {};
    mount = true;
    last_url = "";

    static idx = 1;
    clearAlertAndProgress = () => {
        const alertAction = alertListener.notify(ImageProcessing.idx, false, "", false, false);
        const progressAction = progressListener.notify(ImageProcessing.idx, false, false);
        store.dispatch(batchActions([alertAction, progressAction]));
    };

    setProgress = () =>{
        const alertAction = alertListener.notify(ImageProcessing.idx, false, "", false, false);
        const progressAction = progressListener.notify(ImageProcessing.idx, true, false);
        store.dispatch(batchActions([alertAction, progressAction]));
    };
    complateProgress = () => {
        progressListener.complete(ImageProcessing.idx);
    };

    setError = () => {
        const alertAction = alertListener.notify(ImageProcessing.idx, true, "出错啦！", false, false);
        const progressAction = progressListener.notify(ImageProcessing.idx, false, false);
        store.dispatch(batchActions([alertAction, progressAction]));
    };

    fetchResult = (name, result, type, upload) => {
        const currentVersion = ++this.version;
        http.post(
            "/captcha/" + type, {
                name: name,
                upload: upload,
                data: result,
            }
        ).then((response) => {
            if (this.version != currentVersion) {
                return;
            }
            progressListener.complete(ImageProcessing.idx);

            if (this.mount) {
                this.setState({
                    result: response["info"]
                });
            }
        }).catch(() => {
            if (this.version != currentVersion) {
                return;
            }

            const alertAction = alertListener.notify(ImageProcessing.idx, true, "出错啦！", false, false);
            const progressAction = progressListener.notify(ImageProcessing.idx, false, false);
            store.dispatch(batchActions([alertAction, progressAction]));
        });
        const alertAction = alertListener.notify(ImageProcessing.idx, false, "", false, false);
        const progressAction = progressListener.notify(ImageProcessing.idx, true, false);
        store.dispatch(batchActions([alertAction, progressAction]));

    };

    setRandomIndex = (type = null) => {
        let index;
        if (type != null) {
            while (true) {
                index = Math.floor(Math.random() * this.samples[type].length);
                if (this.last_url != this.samples[type][index]) {
                    this.last_url = this.samples[type][index];
                    break;
                }
            }
        } else {
            while (true) {
                type = Util.pickRandomKey(this.samples);
                index = Math.floor(Math.random() * this.samples[type].length);
                if (this.last_url != this.samples[type][index]) {
                    this.last_url = this.samples[type][index];
                    break;
                }
            }
        }
        this.setState({
            imgSrc: Constants.remoteHTTP + Constants.remoteHost + this.samples[type][index],
            type: type
        });
        this.fetchResult(this.last_url, this.last_url, type, false);
    };

    fetchExampleImage = () => {
        const currentVersion = ++this.version;

        http.get("/fetchcaptcha", {})
            .then((response) => {
                if (this.version != currentVersion) {
                    return;
                }
                this.samples = response;
                if (this.mount) {
                    this.setRandomIndex();
                }
            }).catch(() => {
            if (this.version != currentVersion) {
                return;
            }
            const alertAction = alertListener.notify(ImageProcessing.idx, true, "获取示例失败", false, false);
            const progressAction = progressListener.notify(ImageProcessing.idx, false, false);
            store.dispatch(batchActions([alertAction, progressAction]));
        });

    };

    componentWillMount() {
        this.clearAlertAndProgress();
        this.fetchExampleImage();

        $(window).scrollTop(0);

    }

    componentWillUnmount() {
        this.clearAlertAndProgress();
        this.mount = false;

        $(window).off('mousewheel DOMMouseScroll');
    }

    componentDidMount() {
        const identifyTop = $('#identify').offset().top;
        const contentTop = $('#content').offset().top;
        $(window).on('mousewheel DOMMouseScroll', (event) => {
            event.stopPropagation();
            let top = $(document).scrollTop();
            if (top >= contentTop - 200 && top < identifyTop - 300) {
                this.setState({
                    slideIndex: 2
                })
            } else if(top >= identifyTop - 300){
                this.setState({
                    slideIndex: 3
                })
            }else {
                this.setState({
                    slideIndex: 1
                })
            }
        });
    }

    state = {
        showAlert4Select: false,
        msg: "",

        imgSrc: "",
        result: "",
        type: "",
        slideIndex: 1
    };

    version = Util.unixTime();

    static tip_none = '请选择将要上传的雪球验证码';
    static tip_exist = '读取文件出错，请检查文件是否存在';
    static tip_max = '文件大小超出限制，请重新选择或裁剪';
    static changeTip = '换个示例';


    handleDialogOpen = () => {
        this.setState({
            showAlert4Select: false,
        })
    };

    static MAX_UPLOAD_SIZE = 40960;

    dialogs = {
        xueqiu: {
            type: "xueqiu",
            idx: "xueqiu-captcha",
            title: "提交雪球验证码",
            linkText: "获取到雪球验证码",
            link: "https://xueqiu.com/service/captcha",
        },
        sogou: {
            type: 'sogou',
            idx: "sogou-captcha",
            title: "提交搜狗验证码",
            linkText: "获取到搜狗验证码",
            link: "http://weixin.sogou.com/antispider/",
        }
    };
    isAnimate: boolean = false;

    animate = (thisSlideIndex) => {
        this.setState({
            slideIndex: thisSlideIndex,
        });

        let offsetTop;

        switch (thisSlideIndex) {
            case 1:
                offsetTop = $('#cardiogram').offset().top;
                break;
            case 2:
                offsetTop = $('#content').offset().top;
                break;
            case 3:
                offsetTop = $('#identify').offset().top;
                break;
            default:
                break;
        }
        $('body,html').stop().animate({
            scrollTop: offsetTop - 66
        }, 700, () => {
            this.isAnimate = false
        });

    };

    render() {

        let imgText = "";
        if (this.state.type == 'xueqiu') {
            imgText = '来自雪球的验证码';
        } else if (this.state.type == 'sogou') {
            imgText = '来自搜狗的验证码';
        } else {
            imgText = '自定义验证码';
        }

        const dialogs = [];
        for (const key in this.dialogs) {
            const value = this.dialogs[key];
            dialogs.push(
                (
                    <Dialog key={value.type} title={value.title} content={
                        <form>
                            <div className="form-group">
                                <input type="file" className="form-control"
                                       onChange={(value) => {
                                           if (value.target.value) {
                                               this.setState({
                                                   showAlert4Select: false
                                               })
                                           }
                                       }}/>
                                {
                                    this.state.showAlert4Select ?
                                        <small className="alert-danger">{this.state.msg}</small> : null
                                }
                                <small className="form-text text-muted">
                                    <a href={value.link} target="_blank">您可以从<span
                                        className="blue">这里</span>{value.linkText}</a>
                                </small>
                            </div>
                        </form>
                    } idx={value.idx} needConfirm
                            onConfirm={(id) => {
                                const idx = "#" + id;
                                const input = $(idx + " input")[0];
                                const files = input.files;
                                if (files.length == 0) {
                                    const warning = $(idx + " .alert-danger");
                                    if (warning.length == 0) {
                                        this.setState({
                                            showAlert4Select: true,
                                            msg: ImageProcessing.tip_none
                                        })
                                    }
                                    return;
                                }

                                const file = files[0];
                                if (file.size > ImageProcessing.MAX_UPLOAD_SIZE) {
                                    this.setState({
                                        showAlert4Select: true,
                                        msg: ImageProcessing.tip_max
                                    });
                                    return;
                                }

                                const fr = new FileReader();
                                fr.onload = (event: any) => {
                                    if (event.target.error) {
                                        this.setState({
                                            showAlert4Select: true,
                                            msg: ImageProcessing.tip_exist
                                        })
                                    } else {
                                        this.fetchResult(file.name, fr.result, value.type, true);
                                        $('#' + id).modal('hide');
                                    }
                                };

                                const url = URL.createObjectURL(file);
                                this.setState({
                                    imgSrc: url
                                });
                                fr.readAsDataURL(file);
                            }}
                    />
                )
            );
        }

        return (
            <div className="relative">
                <Header path={ImageProcessing.PATH} fixScroll/>
                <Alert idx={ImageProcessing.idx}/>
                <AsideLink
                    slideIndex={this.state.slideIndex}
                    animate={this.animate}
                />
                <div  id="cardiogram" style={{position:'relative'}}>
                    <Cardiogram
                        setProgress={this.setProgress}
                        complateProgress ={this.complateProgress}
                        setError={this.setError}
                    />
                </div>
                <div id="content" className="full-screen background-identify flex-column relative"
                     style={this.styles.page}>
                    <div className="flex-space"/>
                    <div className="root-container">
                        <div className="title-container" style={this.styles.minPadding}>
                            <span className="title">验证码识别</span>
                            <p style={this.styles.description as any}>
                                验证码识别属于典型的图像分类问题。有效避免由于字符切分不准导致的问题。通过在多种开源数据集和多个网站的验证码进行识别测试，均达到 99% 以上的准确率。
                            </p>
                        </div>
                        <div style={this.styles.container} className="div-radio">
                            <div style={this.styles.checkBox as any}>
                                <div className="flex-center" style={this.styles.content}>
                                    <img src={this.state.imgSrc} style={this.styles.contentImg} data-toggle="tooltip"
                                         data-placement="top" title={imgText}/>
                                </div>
                                <div>
                                    <img src="/images/rightArrow.png" style={this.styles.rightArrow}/>
                                </div>
                                <div style={this.styles.contentResult} className="text-center">
                                    <span style={this.styles.resultText as any}>{this.state.result}</span>
                                </div>
                            </div>

                            <div className="flex-center" style={this.styles.selfContent as any}>
                                <div className="dropdown">
                                    <a className="btn btn-secondary dropdown-toggle"
                                       id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true"
                                       aria-expanded="false"
                                       style={this.styles.dropDown}
                                    >
                                        {ImageProcessing.changeTip}
                                    </a>

                                    <div className="dropdown-menu text-center" style={this.styles.dropDownMenu}>
                                        <a className="dropdown-item"
                                           onClick={() => this.setRandomIndex("xueqiu")}>雪球</a>
                                        <a className="dropdown-item" onClick={() => this.setRandomIndex("sogou")}>搜狗</a>
                                        <a className="dropdown-item"
                                           onClick={() => this.setRandomIndex("custom")}>其他</a>
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <a className="btn btn-secondary dropdown-toggle"
                                       id="manual-upload" data-toggle="dropdown" aria-haspopup="true"
                                       aria-expanded="false"
                                       style={this.styles.selectText}
                                    >
                                        手动上传
                                    </a>

                                    <div className="dropdown-menu text-center" style={this.styles.selectDropDownMenu}>
                                        <a className="dropdown-item"
                                           data-toggle="modal" data-target="#xueqiu-captcha"
                                           onClick={this.handleDialogOpen}>雪球</a>
                                        <a className="dropdown-item"
                                           data-toggle="modal" data-target="#sogou-captcha"
                                           onClick={this.handleDialogOpen}>搜狗</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-space"/>
                </div>
                <div id="identify">
                    <Identification/>
                </div>

                {dialogs}
            </div>
        )
    }
}

// 侧边栏滚动监听
class AsideLink extends React.Component<any, any> {
    styles = {
        navStyle: {
            position: 'fixed',
            left: 20,
            top: '30%',
            height: 146,
            overflow: 'hidden',
            marginTop: '-52px',
            zIndex: 12
        }
    };

    render() {
        const slideIndex = this.props.slideIndex;
        return (
            <nav style={this.styles.navStyle as any}>
                <div>
                    <ul id="asideNav">
                        <li onClick={() => this.props.animate(1)}
                            id="cardiograme"
                            data-toggle="popover"
                            data-trigger="focus"
                            onMouseEnter={ () => {
                                $('#cardiograme').popover('show')
                            }}
                            onMouseLeave={ () => {
                                $('#cardiograme').popover('hide')
                            }}
                        >
                            心电图诊断
                            <i className={slideIndex == 1 ? "active asideLabel" : "asideLabel"}/>
                        </li>
                        <li onClick={() => this.props.animate(2)}
                            id="yanzhen"
                            data-toggle="popover"
                            data-trigger="focus"
                            onMouseEnter={ () => {
                                $('#yanzhen').popover('show')
                            }}
                            onMouseLeave={ () => {
                                $('#yanzhen').popover('hide')
                            }}
                        >
                            验证码识别
                            <i className={slideIndex == 2 ? "active asideLabel" : "asideLabel"}/>
                        </li>
                        <li onClick={() => this.props.animate(3)}
                            id="car"
                            data-toggle="popover"
                            data-trigger="focus"
                            onMouseEnter={ () => {
                                $('#car').popover('show')
                            }}
                            onMouseLeave={ () => {
                                $('#car').popover('hide')
                            }}
                        >
                            场景检测与物体识别
                            <i className={slideIndex == 3 ? "active asideLabel" : "asideLabel"}/>
                        </li>

                    </ul>
                </div>
            </nav>

        )
    }
}

export default ImageProcessing;
