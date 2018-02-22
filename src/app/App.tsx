import "babel-polyfill";
import "whatwg-fetch";

import * as React from "react";
import * as ReactDOM from "react-dom";
declare let echarts;
declare let $;

class App extends React.Component<null, null> {
    public render() {
        return (
         <div>

         </div>
        );
    }
}

// ehcharts图表

class EchartsBox extends React.Component<any, any> {

    private chartDiv: HTMLDivElement;
    private windowResizeHandler: (e: Event) => void;
    chart;
    xData = [];
    timer;
    pause = false;
    start = 0;
    end = 10;
    // 画折线图图例
    drawChart = (chart, data) => {
        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'line',
                axisPointer: {
                    animation: false
                }
            },
            xAxis: {
                type: 'category',
                show: false,
                splitLine: {
                    show: false
                },
                data: this.xData
            },
            yAxis: {
                type: 'value',
                show: false,
                scale: false,
                splitLine: {
                    show: false
                }
            },
            grid: {
                top: '0%',
                left: '2%',
                right: '2%',
                bottom: '20%'
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10,
            }, {
                start: 0,
                end: 10,
                showDetail: false,
                bottom: '0%',
                left: 40,
                right: 120,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [{
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: data,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 1
                        }
                    }
                }
            }]
        };
        chart.setOption(option);
        this.props.setFirst();
    };

    styles = {
        background: {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: 230,
            background: 'url("/images/shange.png")',
            backgroundColor: '#d3d3d3'
        }
    };

    //拖动时执行次事件
    eConsole = (param) => {
        if (param.batch) {
            this.start = param.batch[0].start || 0.01;
            this.end = param.batch[0].end;
        } else {
            this.start = param.start || 0.01;
            this.end = param.end;
        }
    };

    setTimer = () => {
        this.pause = false;
        this.timer = setInterval(() => {
            this.start += 0.02;
            this.end += 0.02;
            if (this.end >= 100) {
                this.start = 0.01;
                this.end = 10;
            }
            this.chart.setOption({
                dataZoom: [{
                    start: this.start,
                    end: this.end,
                }]
            });
        }, 16);
    };

    clearTimer = () => {
        this.pause = true;
        clearInterval(this.timer);
    };

    changePlay = () => {
        if (this.props.data.length) {
            if (this.pause) {
                this.setTimer();
                $('.playButton').eq(0).removeClass('played').addClass('paused');
            } else {
                this.clearTimer();
                $('.playButton').eq(0).removeClass('paused').addClass('played');
            }
        }
    };

    handleBig = () => {
        if (this.props.data.length) {
            this.start -= 0.2;
            this.end += 0.2;
            if (this.end >= 100) this.end = 100;
            if (this.start <= 0) this.start = 0.01;

            this.chart.setOption({
                dataZoom: [{
                    start: this.start,
                    end: this.end,
                }]
            });
        }
    };

    handleSmall = () => {
        if (this.props.data.length) {
            this.start += 0.2;
            this.end -= 0.2;
            if (this.start >= this.end) {
                this.start = this.end;
            }
            this.chart.setOption({
                dataZoom: [{
                    start: this.start,
                    end: this.end,
                }]
            });
        }
    };

    init = () => {
        this.xData = [];
        this.start = 0;
        this.end = 10;
        this.pause = false;
        if (this.chart) {
            this.chart.dispose();
        }
        $('.playButton').eq(0).removeClass('played').addClass('paused');
        clearInterval(this.timer);
    };

    componentDidUpdate() {
        if(this.props.stopEcharts){
            if (this.chart) {
                this.chart.dispose();
            }
        }
        if (this.props.data.length) {
            if (this.props.first) {
                this.init();
                this.chart = echarts.init(this.chartDiv);
                for (let i = 0; i < this.props.data.length; i++) {
                    this.xData.push(i);
                }
                this.drawChart(this.chart, this.props.data);
                this.chart.setOption({
                    yAxis: {
                        max: Math.max.apply(Math, this.props.data),
                        min: Math.min.apply(Math, this.props.data)
                    }
                });
                this.setTimer();
                this.chart.on('datazoom', this.eConsole);
            }
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
        this.clearTimer();
    }

    render() {
        return (
            <div className="relativeBox" id="diogramAnalystEcharts">
                <div style={this.styles.background as any}/>
                <div ref={(e) => {
                    this.chartDiv = e
                }} className="echartsBox"
                     style={{width: 840, height: 270}}
                >
                </div>

                <div className="playButton played" onClick={this.changePlay}/>
                <div className="normalButton bigButton" onClick={this.handleSmall} title="放大"/>
                <div className="normalButton smallButton" onClick={this.handleBig} title="缩小"/>
                <div className="normalButton scarButton" title="标注"/>
                <div className="normalButton rateButton" title="测距"/>
            </div>
        )
    }
}

