import * as React from "react";
import {connect} from "react-redux";
import Header from "../components/Header";
import {Action, ScrollAction} from "../model/state/Reducers";

declare let $;

class Identification extends React.Component<any, any> {
    video;
    play;

    styles = {
        videoBox: {
            position: 'relative',
            width: 647,
            height: 493,
            margin: '0 auto 50px auto',
            borderRadius: 5,
            border: '16px solid #e6e6e7'
        },
        special: {
            color: '#ffb000',
        },
        centerWords: {
            textAlign: 'center'
        },
        menban: {
            position:'absolute',
            top:0,
            width:'100%',
            height:'100%',
            backgroundColor:'rgba(17,18,16,.2)',
            zIndex: 5,
        },
        description: {
            color: '#646464',
            padding: '10px 0 20px 0',
            width:800,
            margin:'auto'
        }
    };

    playVideo = () => {
        this.video.play();
        $('#playBottom').hide();
    };

    componentDidMount() {
        const playBotton = $('#playBottom');
        playBotton.hide();

        let index = 0;

        this.video.addEventListener("play", () => {
            playBotton.hide();
        });
        this.video.addEventListener("pause", () => {
            playBotton.show();
        });
        this.video.addEventListener("canplay", () => {
            if(!index){
                playBotton.show();
                index++;
            }
        });

        $('#videoBox').on("click", () => {
            if(this.video.played){
                this.video.pause();
            }
        })
    }
    render() {
        return (
            <div className="full-screen identifyBox">
                <div id="identification-content">

                    <div className="title-container">
                        <span className="title">场景检测与物体识别</span>
                        <p style={this.styles.description as any}>
                            场景检测与物体识别旨在检测图片或视频中的场景与物体，返回检测出的场景与物体名称，以及相应的置信度。公司采用最先进的Faster-Rcnn 模型，可在不同光照条件、拍摄视角或物体被部分遮挡的情况下，准确、迅速地找出图片或视频中的多个目标。
                        </p>
                    </div>
                    <div style={this.styles.videoBox as  any} id="videoBox">
                        <video width={614} ref={(video) => {
                            this.video = video
                        }}>
                            <source src="/images/identify_video~1.mp4" type="video/mp4"/>
                        </video>
                        <div id="playBottom"
                              style={this.styles.menban as any}
                              onClick={this.playVideo}
                        >
                            <span
                                className="controlButtom"
                            >
                                <img src="/images/playBottom.png" alt=""/>
                            </span>
                        </div>
                    </div>
                    {/*<div id="complexNetwork">*/}
                        {/*<p style={this.styles.centerWords}>*/}
                            {/*场景检测与物体识别旨在检测图片或视频中的场景与物体，返回检测出的场景与物体名称，以及相应的置信度。公司采用最先进的*/}
                            {/*<br/>*/}
                            {/*Faster-Rcnn 模型，可在不同光照条件、拍摄视角或物体被部分遮挡的情况下，准确、迅速地找出图片或视频中的多个目标。*/}
                        {/*</p>*/}
                    {/*</div>*/}
                </div>
            </div>
        )
    }
}



export default Identification;