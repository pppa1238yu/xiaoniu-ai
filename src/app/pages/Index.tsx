import * as React from "react";

import {connect} from "react-redux";

import Header from "../components/Header";
import {Action, ScrollAction} from "../model/state/Reducers";
import SuperDoctor from "./SuperDoctor";
import {Link} from "react-router-dom";

declare let $;

class Index extends React.Component<any, any> {
    static PATH = "/";
    static NAME = "首页";
    divHeight = 0;//当前视图的高度
    now = 0;//滚动的距离
    startTime = 0;
    endTime = 0;
    styles = {
        messageBox: {
            width: "700px",
        },
        title: {
            textAlign: "center",
            fontSize: "40px",
            fontWeight: 600,
            color: "#6d6d6d"
        },
        subTitle: {
            color: "#0176c1"
        },
        message: {
            lineHeight: "25px",
            color: "#a1a1a1"
        },
        arrow: {
            position: "absolute",
            bottom: "20px",
            cursor: "pointer",
            width: "100%",
            textAlign: "center"
        },
        relative: {
            position: "relative",
            minWidth:"1450px"
        },

        superDocterBanner: {
            width: "388px",
            height: "78px"
        },
        fullWH: {
            width: "100%",
            height: "100%"
        },
        superMediaBanner: {
            width: "290px",
            height: "142px"
        },
        investmentAssistant: {
            width: "287px",
            height: "81px"
        },
        footer: {
            position: "absolute",
            bottom: "56px",
            width: "100%",
            textAlign: "center",
            color: "#a6a6a6"
        },
        links: {
            color: "#a6a6a6",
            marginRight:"20px"
        },
        records: {
            marginTop: "25px"
        },
        linksBox: {
            textAlign: 'center'
        }
    };

    scrollFun(event) {
        let main = $("#homePage #main");
        let content = $("#homePage .content");

        let delta = event.detail || (-event.wheelDelta);
        this.startTime = new Date().getTime();

        if ((this.endTime - this.startTime) < -1000) {
            //1秒内执行一次翻页
            if (delta > 0 && parseInt(main.css("top")) - 1 > -this.divHeight * ( content.length - 1)) { //向下翻页
                this.now += this.divHeight;
                $("#home-nav-fullPage>div").removeClass("active");
                $("#home-nav-fullPage>div:eq(" + this.now / this.divHeight + ")").addClass("active");
                this.turnPage(this.now);
            }
            if (delta < 0 && parseInt(main.css("top")) < 0) { //向上翻页
                this.now -= this.divHeight;
                $("#home-nav-fullPage>div").removeClass("active");
                $("#home-nav-fullPage>div:eq(" + this.now / this.divHeight + ")").addClass("active");
                this.turnPage(this.now);
            }
            this.endTime = new Date().getTime();
        }
        else {
            event.preventDefault();
        }
    }

    turnPage(now) {
        $("#homePage #main").animate({top: (-now + 'px')}, 1000);
    }

    componentDidMount() {
        let that = this;
        let wrap = $("#homePage #wrap");
        let content = $("#homePage .content");

        this.divHeight = window.innerHeight;
        wrap.height(this.divHeight);
        content.height(this.divHeight);

        /*Firefox注册事件*/
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', this.scrollFun.bind(this), false);
        }
        document.onmousewheel = this.scrollFun.bind(this);


        $("#home-nav-fullPage>div").click(function () {
            $("#home-nav-fullPage>div").removeClass("active");
            $(this).addClass("active");
            that.now = that.divHeight * $(this).index();
            that.turnPage(that.now);
        });


        $(".home-page-arrow").click(function () {
            $("#home-nav-fullPage>div").removeClass("active");
            $("#home-nav-fullPage>div:eq(1)").addClass("active");
            that.now = that.divHeight;
            that.turnPage(that.now);
        });
    }

    componentWillUnmount() {
        if (document.addEventListener) {
            document.removeEventListener('DOMMouseScroll', this.scrollFun, false);
        }
        document.onmousewheel = null;
    }

    render() {

        return (
            <div id="homePage" style={this.styles.relative as any}>
                <Header path={Index.PATH} fixScroll identify/>
                <div id="wrap">
                    <div id="main">
                        <div className="content num1">
                            <div style={this.styles.messageBox as any}>
                                <p style={this.styles.title as any}>
                                    Make AI Benefiting <span style={this.styles.subTitle}>Everyone</span>
                                </p>
                                <p style={this.styles.message}>
                                    人工智能的发展正在影响生活的方方面面，随之而来的将会是一场新的工业革命，这场革命不仅将替代人类的体力劳动，还会改变脑力劳动格局，很多复杂问题也将会以全新的方式被解决。成都蓝景致力于人工智能前沿技术的探索，去解决现实世界中的各种挑战，使每个人都能在这场智能革命中获益，让生活变得更简单、美好。
                                </p>
                            </div>
                            <div className="content-right">
                                <img src="/images/index/ai.gif" alt="" className="content-right-img"/>
                            </div>
                            <div style={this.styles.arrow as any} className="home-page-arrow">
                                <img src="/images/index/hoverArrow.png" alt=""/>
                            </div>
                        </div>
                        <div className="content num2">
                            <div className="content-left">
                                <img src="/images/index/superDocterLeft.png" alt="" className="content-left-img"/>
                            </div>
                            <div className="content-right">
                                <img src="/images/index/superDocterRight.gif" alt="" className="content-right-img"/>
                            </div>
                            <Link to={SuperDoctor.PATH} className="home-detail-btn">
                                <div>
                                    了解详情
                                </div>
                            </Link>
                        </div>
                        <div className="content num3">
                            <div className="content-left">
                                <img src="/images/index/superMediaLeft.png" alt="" className="content-left-img"/>
                            </div>
                            <div className="content-right">
                                <img src="/images/index/superMediaRight.gif" alt="" className="content-right-img"/>
                            </div>
                        </div>
                        <div className="content num4">
                            <div className="content-left">
                                <img src="/images/index/investmentAssistantLeft.png" alt=""
                                     className="content-left-img"/>
                            </div>
                            <div className="content-right">
                                <img src="/images/index/investmentAssistantRight.gif" alt=""
                                     className="content-right-img"/>
                            </div>
                            <div style={this.styles.footer as any}>
                                <div style={this.styles.linksBox as any}>
                                    <a href="https://fineyes.calfdata.com/" target="_blank" style={this.styles.links}>
                                        小牛大数据工作站
                                    </a>
                                    <a href="https://stocktips.calfdata.com" target="_blank" style={this.styles.links}>
                                        小牛观点平台
                                    </a>
                                </div>
                                <div style={this.styles.records}>
                                    ©2017 calfdata.com 蜀ICP备15022989号
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="home-nav-fullPage">
                    <div className="active"></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }
}

const IndexWithState = connect((state) => {
    return Action.CONNECT_PROPS(null, state, ScrollAction);
})(Index);

export default IndexWithState;
