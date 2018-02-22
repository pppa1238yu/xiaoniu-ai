import * as React from "react";
import {connect} from "react-redux";

import {grey500} from "../utils/colors";

export class Forbidden extends React.Component<any, null> {

    styles = {
        content: {
            minHeight: 300,
            margin: "0 auto",
            textAlign: 'center',
        },
        image: {
            height: 230,
            width: 230,
        },
        textContainer: {
            paddingTop: 16,
            paddingLeft: 24,
            paddingRight: 24,
        },
        text: {
            fontSize: 18,
            color: grey500,
        },
    };

    render() {

        return (
            <div className="flex-column full-screen background-white">
                <div className="flex-space"/>
                <div style={this.styles.content}>
                    <img src="/images/forbidden.png" style={this.styles.image}/>
                    <div style={this.styles.textContainer}>
                        <span style={this.styles.text}>抱歉，手机端暂时未开放。请使用 PC 端浏览该网页</span>
                    </div>
                </div>
                <div className="flex-space"/>
                <div className="flex-space"/>
            </div>
        );
    }
}

