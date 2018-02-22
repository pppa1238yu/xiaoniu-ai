import * as React from "react";
declare let echarts;
declare let $;
export default class DiogramAnalyst extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 1,
            textArea1Dis: true,
            textArea2Dis: true,
            msg: '',
            result: '',
            data: {},
            nowTime: '-',
            first: false,
            startChange: false,
            loading: false,
            loadingState: '未上传',
            showAlert4Select: false,
            stopEcharts: false
        }
    }

    static PATH = "/diogramAnalyst";
    static NAME = "心电图分析";
    static tip_none = '请选择将要上传的雪球验证码';
    static tip_exist = '读取文件出错，请检查文件是否存在';
    static tip_max = '文件大小超出限制，请重新选择或裁剪';
    static changeTip = '换个示例';
    static MAX_UPLOAD_SIZE = 120000;
    static idx = 1;
    mount = true;
    version = Util.unixTime();

    styles = {
        content: {
            position: 'relative'
        },
        headContent: {
            background: 'url("/images/diogram.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '450px',
            overflow: 'hidden',
            color: '#fff'
        },
        analystBox: {
            width: 880,
            margin: '20px auto  0  auto'
        },
        title: {
            lineHeight: '80px',
            fontWeight: '600',
            fontSize: 16
        },
        smallPaddingTitle: {
            lineHeight: '72px',
            fontWeight: '600',
            fontSize: 16
        },
        description: {
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
        },
        downLoad: {
            cursor: 'pointer',
            color: '#22557d'
        },
        tipsWords: {
            position: 'absolute',
            right: '0',
            top: '-23px',
            fontSize: '12px'
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-around'
        },
        commonButton: {
            textAlign: 'center',
            lineHeight: '48px',
            fontSize: '12px',
            cursor: 'pointer'
        },
        report: {
            position: 'relative',
            boxSizing: 'border-box',
            padding: '0 40px 40px 40px',
            minHeight: '450px',
            backgroundColor: '#e5e5e5'
        },
        reportTableBox: {
            boxSizing: 'border-box',
            padding: '0  12px',
            border: '1px solid #acacac'
        },
        resultBorderBox: {
            boxSizing: 'border-box',
            padding: '30px',
            border: '1px solid #acacac',
            textAlign: 'center',
            fontSize: '14px',
            color: '#474747',
            width: '100%',
            backgroundColor: 'transparent',
            lineHeight: '20px'
        },
        modalRateBox: {
            position: 'relative',
            width: '100%',
            height: 200,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
        },
        modalRateChart: {
            width: 102,
            height: 102
        },
        rateChartMengban: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 102,
            height: 102,
            borderRadios: 51,
            textAlign: 'center'
        },
        rateChartFir: {
            marginTop: 30,
            marginBottom: 0
        },
        marginBottom: {
            marginBottom: '8px',
        },
        marginTop30: {
            marginTop: 30
        },
        echartsBox: {
            width: '100%',
            height: 300,
            background: '#e5e5e5',
            margin: '15px 0',
            padding: '15px 20px 20px 20px'
        },
        postButton: {
            position: 'absolute',
            right: 8,
            top: 8,
            display: 'flex',
            justifyContent: 'space-between',
            width: '143px'
        },
        mainContent: {},
        mailTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '10px'
        },
        normalBox: {
            width: 425,
            height: 50,
            marginBottom: 25,
            lineHeight: '50px',
            textAlign: 'center',
            backgroundColor: '#e5e5e5',
            fontSize: 14
        },
        menban: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,.1)'
        },
        loadingState: {
            position: 'absolute',
            bottom: -20,
            width: '100%',
            textAlign: 'center'
        },
        footer: {
            width: '100%',
            height: 200,
            overflow: 'hidden',
            marginTop: 100,
            backgroundColor: '#0e121b'
        },
        links: {
            color: "#d8d8d8"
        },
        records: {
            width: '274px',
            margin: 'auto',
            fontSize: 14,
            color: "#b5b5b5",
            marginTop: "25px"
        },
        linksBox: {
            width: '274px',
            fontSize: 14,
            margin: 'auto',
            display: "flex",
            marginTop: 80,
            justifyContent: "space-between"
        }
    };

    handleOpenText1 = () => {
        let state = this.state.textArea1Dis;
        if (state === true) {
            this.setState({
                textArea1Dis: false
            });
            $('.textArea1').css({
                backgroundColor: '#fff'
            });
            $('#editButton1').html('确认');
        } else {
            this.setState({
                textArea1Dis: true
            });
            $('.textArea1').css({
                backgroundColor: 'transparent'
            });
            $('#editButton1').html('编辑');
        }
    };

    handleOpenText2 = () => {
        let state = this.state.textArea2Dis;
        if (state === true) {
            this.setState({
                textArea2Dis: false
            });
            $('.textArea2').css({
                backgroundColor: '#fff'
            });
            $('#editButton2').html('确认');
        } else {
            this.setState({
                textArea2Dis: true
            });
            $('.textArea2').css({
                backgroundColor: 'transparent'
            });
            $('#editButton2').html('编辑');
        }
    };

    handleDialogOpen = () => {
        this.setState({
            showAlert4Select: false,
        })
    };

    componentWillMount() {
        $(window).scrollTop(0);
    }

    componentWillUnmount() {
        this.mount = false;
        $(window).off('mousewheel DOMMouseScroll');
    }

    setFirst = () => {
        this.setState({
            first: false
        })
    };

    init = () => {
        $('.reportTableBox').css({opacity: 0});
        $('.echartsRate').css({height: 0});
        $('.textArea1').val("");
        $('.textArea2').val("");
        $('.noDisp').css({height: 0});
        this.setState({stopEcharts: false});
    };

    setError = (err) => {
        const alertAction = alertListener.notify(DiogramAnalyst.idx, true, err, false, false);
        const progressAction = progressListener.notify(DiogramAnalyst.idx, false, false);
        store.dispatch(batchActions([alertAction, progressAction]));
    };

    upload = () => {
        this.init();
        this.setState({loadingState: '上传中...', stopEcharts: true});
        setTimeout(() => {
            if (this.state.result.length > 0) {
                http.post(
                    "/ecg/upload", {
                        data: this.state.result
                    }
                ).then((response) => {
                    let date = new Date();
                    let nowDate = date.toLocaleDateString() + " " + date.getHours() + ":" + date.getMinutes();
                    let result = '',
                        suggestion = '';
                    let idxs = 1,
                        sugIdx = 1,
                        showResult = [],
                        showSuggestion = [];
                    if (response.info.label) {
                        switch (response.info.label) {
                            case '正常':
                                suggestion = "希望您继续保持良好的生活习惯";
                                result = "正常 \n (此心电图信号表现正常，每分钟心跳在 60～100 次之间。)";
                                break;
                            case '房颤':
                                suggestion = "建议除正常治疗外，清淡饮食，慎用补品，远离烟酒，适量活动、控制体重，定期检查血压和血胆固醇。";
                                result = "房颤 \n (此心电图表现为心房颤动，是心脏不正常节律/心律不整的一种，特色是心脏快速而不规则的跳动。)";
                                break;
                            case '非房颤心率失常':
                                suggestion = "建议去相关医疗机构进一步复查，确定具体的心律失常类型。";
                                result = "非房颤心率失常 \n (此心电图表现异常，属于心房颤动以外的心率失常，如过早搏动、心动过速、心搏过缓等。)";
                                break;
                            case '噪声':
                                suggestion = "在确保诊疗仪器设备正常后，建议重新检查。";
                                result = "噪声 \n (此心电图采集时信噪比过低，无法识别。)";
                                break;
                            default:
                                break;
                        }
                    }
                    if (response.info.data.length) {
                        $(window).scrollTop(900);
                        this.setState({
                            data: response.info,
                            nowTime: nowDate,
                            loading: true,
                            stopEcharts: false,
                            first: true,
                            loadingState: '分析中...'
                        });
                        setTimeout(() => {
                            this.setState({
                                loading: false,
                                loadingState: '分析完成'
                            });
                            $('.noDisp').css({height: 'auto'});
                            $('.reportTableBox').animate({
                                opacity: 1
                            }, 1000, () => {
                                this.setState({
                                    startChange: true
                                });
                                $('.echartsRate').animate({
                                    height: 200
                                }, 1000, () => {
                                    let timer = setInterval(() => {
                                        showResult.push(result.slice(idxs - 1, idxs));
                                        $('.textArea1').val(showResult.join(''));
                                        idxs++;
                                        if (result.length <= idxs - 1) {
                                            showSuggestion.push(suggestion.slice(sugIdx - 1, sugIdx));
                                            $('.textArea2').val(showSuggestion.join(''));
                                            sugIdx++;
                                            if (suggestion.length == sugIdx - 1) {
                                                clearInterval(timer);
                                            }
                                        }
                                    }, 90);
                                })
                            });
                        }, 5000);

                    }
                }).catch((err) => {
                    this.setError(err);
                });
            } else {
                this.setError('请先选择文件！');
            }
        }, 2000);
    };

    changeOver = () => {
        this.setState({startChange: false});
    };

    render() {
        const dialog = (
            <Dialog idx="upload" title="文件上传" content={
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
                    </div>
                </form>
            } needConfirm onConfirm={
                () => {
                    const idx = '#upload';
                    const input = $(idx + " input")[0];
                    const files = input.files;
                    if (files.length == 0) {
                        const warning = $(idx + " .alert-danger");
                        if (warning.length == 0) {
                            this.setState({
                                showAlert4Select: true,
                                msg: DiogramAnalyst.tip_none
                            })
                        }
                        return;
                    }
                    const file = files[0];
                    if (file.size > DiogramAnalyst.MAX_UPLOAD_SIZE) {
                        this.setState({
                            showAlert4Select: true,
                            msg: DiogramAnalyst.tip_max
                        });
                        return;
                    }
                    const fr = new FileReader();
                    fr.readAsDataURL(file);
                    fr.onload = (event: any) => {
                        if (event.target.error) {
                            this.setState({
                                showAlert4Select: true,
                                msg: DiogramAnalyst.tip_exist
                            })
                        } else {
                            $('#upload').modal('hide');
                            $('.button1').html(file.name);
                            this.setState({
                                result: fr.result
                            })
                        }
                    };
                }
            }
            />
        );
        const info = this.state.data;
        let information = info.information || '';
        let showInfArr = [];
        information.split(" ").map(item => {
            if (item !== "") {
                showInfArr.push(item);
            }
        });
        let tableContent = (
            <tr>
                <td>{info.id || '-'}</td>
                <td>{info.gender || '-'}</td>
                <td>{info.age || '-'}</td>
                <td>{this.state.nowTime}</td>
                <td>{info.time || '-'}</td>
                <td>{this.state.loadingState}</td>
            </tr>
        );
        if (this.state.stopEcharts) {
            tableContent = (<tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>{this.state.loadingState}</td>
            </tr>)
        }

        let table = (
            <table className="table">
                <thead>
                <tr>
                    <th>患者ID</th>
                    <th>性别</th>
                    <th>年龄</th>
                    <th>上传时间</th>
                    <th>采样时间</th>
                    <th>状态</th>
                </tr>
                </thead>
                <tbody>
                {tableContent}
                </tbody>
            </table>
        );

        const loading = this.state.loading ? <div style={this.styles.menban as any}>
            <div className="base">
                <div className="cube"/>
                <div className="cube"/>
                <div className="cube"/>
                <div className="cube"/>
                <div className="cube"/>
                <div className="cube"/>
                <div className="cube"/>
                <div className="cube"/>
                <div className="cube"/>
            </div>
        </div> : null;
        return (
            <div className="relative" style={this.styles.mainContent}>
                {dialog}
                <div id="diogramAlanyst">
                    {/*头部导航栏 */}
                    <Header path={DiogramAnalyst.PATH}/>
                    <Alert idx={DiogramAnalyst.idx}/>
                    {/*内容部分 */}
                    <div style={this.styles.content as any} className="full-screen easing flex-column relative">
                        <div style={this.styles.headContent as any}>
                            <div style={{marginTop: 180}}>
                                <p className="centerWords" style={this.styles.mailTitle as any}>心电图分析</p>
                                <p className="centerWords">蓝景AI通过构建大规模深度学习对单通道心电图进行心率失常诊断,达到专家医生的诊断水平,可辅助医生降低误诊、漏诊率。</p>
                            </div>
                        </div>
                        <div style={this.styles.analystBox as any} className="relative">
                            <p style={this.styles.title as any} className="centerWords">工作原理</p>
                            <div style={this.styles.description as any}>
                                <div style={this.styles.normalBox}>基于深度学习构建大规模神经网络疾病判别模型</div>
                                <div style={this.styles.normalBox}>基于全球心脏疾病专家标注数据集有效训练模型</div>
                                <div style={this.styles.normalBox}>直接输入心电数字信号分析，无需针对波群图像分析</div>
                                <div style={this.styles.normalBox}>模型快速识别信号正常与否及诊断具体疾病种类</div>
                                <div style={this.styles.normalBox}>采用自然语言处理技术自动生成诊断报告、诊断及健康建议</div>
                            </div>
                            <p style={this.styles.title as any} className="centerWords">功能演示</p>
                            <div className="relative">
                                <p style={this.styles.tipsWords as any}>请上传心电图影像数据<a
                                    href={Constants.remoteHTTP + Constants.remoteHost + "/ecg/download"}
                                    style={this.styles.downLoad}>【下载示例】</a></p>
                                <div style={this.styles.buttons as any}>
                                    <div style={this.styles.commonButton} className="button1"
                                         data-toggle="modal"
                                         data-target="#upload"
                                         onClick={this.handleDialogOpen}>+点击选择文件
                                    </div>
                                    <div style={this.styles.commonButton} className="button2" onClick={this.upload}>
                                        开始上传
                                    </div>
                                    <div style={this.styles.commonButton} className="button3"
                                         onClick={ () => this.setError("实时采集样本需合作医院提供硬件支撑")}>实时采集
                                    </div>
                                </div>
                                {/*患者信息栏*/}
                                <div className="specialColor">
                                    {table}
                                </div>
                                {/*echarts图表*/}
                                <div style={this.styles.echartsBox} className="echartsBox">
                                    <EchartsBox first={this.state.first} data={info.data || []}
                                                stopEcharts = {this.state.stopEcharts}
                                                setFirst={this.setFirst}/>
                                </div>

                                {/*诊断报告*/}
                                <div style={this.styles.report as any}>
                                    {loading}
                                    <div className="noDisp">
                                        <div style={this.styles.postButton as any}>
                                            <span className="editButton">发送</span>
                                            <span className="editButton">打印</span>
                                        </div>
                                        <p style={this.styles.smallPaddingTitle as any} className="centerWords">诊断报告</p>

                                        <div style={this.styles.reportTableBox as any} className="reportTableBox">
                                            {table}
                                        </div>

                                        <div className="echartsRate">
                                            <EchartRates label={info.label || ''} startChange={this.state.startChange}
                                                         changeOver={this.changeOver}/>
                                        </div>
                                        {/*诊断结论*/}
                                        <div>
                                            <p style={this.styles.marginBottom}>诊断结论&nbsp;&nbsp;&nbsp;<span
                                                className="editButton" id="editButton1"
                                                onClick={this.handleOpenText1}>编辑</span>
                                            </p>
                                            <textarea className="textArea1" style={this.styles.resultBorderBox}
                                                      disabled={this.state.textArea1Dis}>
                                        </textarea>
                                        </div>

                                        {/*诊断建议*/}
                                        <div style={this.styles.marginTop30}>
                                            <p style={this.styles.marginBottom}>诊断建议&nbsp;&nbsp;&nbsp;<span
                                                className="editButton" id="editButton2"
                                                onClick={this.handleOpenText2}>编辑</span>
                                            </p>
                                            <textarea className="textArea2" style={this.styles.resultBorderBox}
                                                      disabled={this.state.textArea2Dis}>
                                        </textarea>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/*footer*/}
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
        )
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

// 正确率、召回率、F1值
class EchartRates extends React.Component<any, any> {

    private chartDiv1: HTMLDivElement;
    private chartDiv2: HTMLDivElement;
    private chartDiv3: HTMLDivElement;
    chart1;
    chart2;
    chart3;

    showEcharts = [];

    styles = {
        modalRateBox: {
            position: 'relative',
            width: '100%',
            height: 200,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
        },
        modalRateChart: {
            width: 102,
            height: 102
        },
        rateChartMengban: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 102,
            height: 102,
            borderRadios: 51,
            textAlign: 'center'
        },
        rateChartFir: {
            marginTop: 30,
            marginBottom: 0
        },
    };

    drawChartRate = (chart, color, value) => {
        let option = {
            series: [
                {
                    name: '个股评级',
                    type: 'pie',
                    radius: ['93%', '100%'],
                    hoverAnimation: false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            formatter: '{c}\n{b}'
                        }
                    },
                    color: [color, "#ccc"],
                    data: [
                        {
                            value: value,
                            textStyle: {
                                color: '#000'
                            },
                        },
                        {
                            value: 100 - value,
                            name: ""
                        }
                    ]
                }
            ]
        };
        chart.setOption(option);
    };

    init = () => {
        this.disposeChart();
        $('.rateChartTextFir').eq(0).html("");
        $('.rateChartTextFir').eq(1).html("");
        $('.rateChartTextFir').eq(2).html("");
        $('.valueBox').eq(0).css({opacity: 0});
        $('.valueBox').eq(1).css({opacity: 0});
        $('.valueBox').eq(2).css({opacity: 0});
    };

    componentDidUpdate() {
        let label = this.props.label;
        if (label !== '') {
            let rate1 = 0;
            let rate2 = 0;
            let rate3 = 0;
            switch (label) {
                case '正常':
                    rate1 = 88.8;
                    rate2 = 85.8;
                    rate3 = 87.3;
                    break;
                case '房颤':
                    rate1 = 87.8;
                    rate2 = 86.7;
                    rate3 = 87.2;
                    break;
                case '非房颤心率失常':
                    rate1 = 84.1;
                    rate2 = 87.3;
                    rate3 = 85.7;
                    break;
                case '噪声':
                    rate1 = 86.1;
                    rate2 = 86.9;
                    rate3 = 86.5;
                    break;
                default:
                    break;
            }
            if (this.props.startChange) {
                this.init();
                this.chart1 = echarts.init(this.chartDiv1);
                this.chart2 = echarts.init(this.chartDiv2);
                this.chart3 = echarts.init(this.chartDiv3);
                $('.rateChartTextFir').eq(0).html(rate1 + '%');
                $('.rateChartTextFir').eq(1).html(rate2 + '%');
                $('.rateChartTextFir').eq(2).html(rate3 + '%');
                $('.valueBox').eq(0).stop().animate({
                    opacity: 1
                }, 500);
                this.drawChartRate(this.chart1, '#e14474', rate1);
                setTimeout(() => {
                    $('.valueBox').eq(1).stop().animate({
                        opacity: 1
                    }, 500);
                    this.drawChartRate(this.chart2, '#5584df', rate2);
                    setTimeout(() => {
                        $('.valueBox').eq(2).stop().animate({
                            opacity: 1
                        }, 500, () => {
                            this.props.changeOver();
                        });
                        this.drawChartRate(this.chart3, '#ec7a44', rate3);
                    }, 1000)
                }, 1000);
            }
        }
    }

    disposeChart = () => {
        if (this.chart1) {
            this.chart1.dispose();
        }
        if (this.chart2) {
            this.chart2.dispose();
        }
        if (this.chart3) {
            this.chart3.dispose();
        }
    };

    componentWillUnmount() {
        this.disposeChart();
    }

    render() {
        return (
            <div id="diogramRate">
                {/*三个率*/}
                <div style={this.styles.modalRateBox as any}>
                    <div className="relativeBox" id="diogramRate1">
                        <div ref={(e) => {
                            this.chartDiv1 = e
                        }} style={this.styles.modalRateChart as any}/>
                        <div style={this.styles.rateChartMengban as any} className="valueBox">
                            <p style={this.styles.rateChartFir as any}
                               className="rateChartTextFirText">正确率</p>
                            <p className="rateChartTextFir">0%</p>
                        </div>
                    </div>
                    <div className="relativeBox" id="diogramRate2">
                        <div ref={(e) => {
                            this.chartDiv2 = e
                        }} style={this.styles.modalRateChart as any}/>
                        <div style={this.styles.rateChartMengban as any} className="valueBox">
                            <p style={this.styles.rateChartFir as any}
                               className="rateChartTextSec">召回率</p>
                            <p className="rateChartTextFir">0%</p>
                        </div>
                    </div>
                    <div className="relativeBox" id="diogramRate3">
                        <div ref={(e) => {
                            this.chartDiv3 = e
                        }} style={this.styles.modalRateChart as any}/>
                        <div style={this.styles.rateChartMengban as any} className="valueBox">
                            <p style={this.styles.rateChartFir as any}
                               className="rateChartTextThi">F1率</p>
                            <p className="rateChartTextFir">0%</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}