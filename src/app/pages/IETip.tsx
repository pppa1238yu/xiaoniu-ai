import * as React from "react";
import {connect} from "react-redux";

import {Util} from "../utils/Constants";
import {grey600, grey800} from "../utils/colors";
import {Action, WidthAction} from "../model/state/Reducers";

export class IETip extends React.Component<any, null> {

    styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: 'white',

            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
        },
        before: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        after: {
            minHeight: 30,
            flexGrow: 1,
            content: '',
            display: 'block',
        },
        content: {
            minHeight: 300,
            margin: "0 auto",
            textAlign: 'center',
        },
        text: {
            color: grey800,
            fontSize: 24,
            display: 'block',
        },
        title: {
            paddingTop: 6,
            color: grey600,
            fontSize: 20,
            lineHeight: '20px',
            display: 'block',
        },
        linksSmall: {
            padding: '32px 8px 0',
            maxWidth: 800
        },
        links: {
            padding: '32px 8px 0',
            maxWidth: 1300
        },
        link: {
            padding: '8px 12px 8px',
        }
    };

    render() {
        const type = Action.PROPS(this.props, WidthAction).device;
        const portrait = Util.middleDown(type);

        let text = null;
        let after = null;
        let className = "flex-start-wrap-center";
        if (portrait) {
            text = <div>
                <span style={this.styles.text}>为了您更流畅的体验</span>
                <span style={this.styles.text}>我们支持所有的主流浏览器</span>
            </div>;
            after = <div style={this.styles.after}/>
        } else {
            text = <span style={this.styles.text}>为了您更流畅的体验 我们支持所有的主流浏览器</span>
            after = <div style={this.styles.after}/>
        }
        return (
            <div style={this.styles.container as any}>
                <div style={this.styles.before}/>
                <div style={this.styles.content}>
                    {text}
                    <div className={className} style={portrait ? this.styles.linksSmall : this.styles.links}>
                        <div style={this.styles.link}>
                            <a href="https://www.google.cn/chrome/browser/desktop/index.html" title="Chrome">
                                <img src="/images/browser/chrome.png"/>
                                <span style={this.styles.title}>谷歌</span>
                            </a>
                        </div>
                        <div style={this.styles.link}>
                            <a href="http://www.firefox.com.cn/" title="Firefox">
                                <img src="/images/browser/firefox.png"/>
                                <span style={this.styles.title}>火狐</span>
                            </a>
                        </div>
                        <div style={this.styles.link}>
                            <a href="https://www.microsoft.com/zh-cn/windows/microsoft-edge" title="Edge">
                                <img src="/images/browser/edge.png"/>
                                <span style={this.styles.title}>Edge</span>
                            </a>
                        </div>
                        <div style={this.styles.link}>
                            <a href="https://www.apple.com/cn/safari/" title="Safari">
                                <img src="/images/browser/safari.png"/>
                                <span style={this.styles.title}>Safari</span>
                            </a>
                        </div>
                        <div style={this.styles.link}>
                            <a href="http://www.opera.com/zh-cn" title="Opera">
                                <img src="/images/browser/opera.png"/>
                                <span style={this.styles.title}>Opera</span>
                            </a>
                        </div>
                        <div style={this.styles.link}>
                            <a href="https://liulanqi.baidu.com/" title="Baidu">
                                <img src="/images/browser/baidu.png"/>
                                <span style={this.styles.title}>百度</span>
                            </a>
                        </div>
                        <div style={this.styles.link}>
                            <a href="http://se.360.cn/" title="360">
                                <img src="/images/browser/360jishu.png"/>
                                <span style={this.styles.title}>360</span>
                            </a>
                        </div>
                        <div style={this.styles.link}>
                            <a href="http://browser.qq.com/" title="QQ">
                                <img src="/images/browser/QQ.png"/>
                                <span style={this.styles.title}>QQ</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div style={this.styles.after}/>
                {after}
            </div>
        );
    }
}

const IETipWithState = connect((state) => {
    return Action.CONNECT_PROPS(null, state, WidthAction);
})(IETip);

export default IETipWithState;
