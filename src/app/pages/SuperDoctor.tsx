import * as React from "react";
import {connect} from "react-redux";
import Header from "../components/Header";
import {Dialog} from "../components/Dialog";
import {http} from "../model/ajax/Http";
declare let $;
export default class SuperDoctor extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 1,
            companyErr: "",
            nameErr: "",
            phoneErr: "",
            emailErr: ""
        }
    }

    static PATH = "/superDoctor";
    static NAME = "超级医生";

    name = '';
    email = '';
    phone = '';
    company = '';
    styles = {
        mainContent: {},
        content: {
            position: 'relative'
        },
        headContent: {
            background: 'url("/images/super.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '450px',
            overflow: 'hidden',
            color: '#fff',
            position:"relative"
        },

        title: {
            fontSize: 18,
            textAlign: 'center',
            color: '#474859',
            lineHeight: '24px'
        },
        marginBox: {
            position: 'relative',
            width: '1180px',
            margin: '58px auto 0 auto'
        },
        moreMargin: {
            marginTop: 96
        },
        cardsBox: {
            position: 'absolute',
            bottom: 0
        },
        lineFir: {
            position: 'relative',
            height: 335,
            marginTop: 35
        },
        imgBox: {
            width: 90,
            margin: '65px auto 35px auto'
        },
        imgTitle: {
            textAlign: 'center',
            fontWeight: '600',
            color: '#474859'
        },
        descript: {
            fontSize: '14px',
            color: '#474859',
            lineHeight: '20px',
            marginTop: '15px'
        },
        advantage: {
            display: 'flex',
            justifyContent: 'space-around',
            width: '1180px',
            margin: '50px auto 30px auto',
            textAlign: 'center'
        },
        mailTitle: {
            fontSize: '18px',
            fontWeight: '600',
            lineHeight: '24px',
            marginBottom: '20px'
        },
        descriptWord: {
            fontSize: '14px',
            maxWidth: 600,
            textAlign: 'left'
        },
        selfStyle: {
            verticalAlign: 'bottom',
            marginLeft: '10px'
        },
        descriptText: {
            marginTop: 10,
            lineHeight: '20px',
            fontSize: '14px',
            maxWidth: '220px'
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
        },
        formInp: {
            width: '100%',
            height: '45px',
            border: 'none',
            outline: 'none',
            paddingLeft: '10px',
            fontSize: '14px',
            backgroundColor: '#e1e1e1',
            marginBottom: 30
        },
        boxPadding: {
            padding: '20px'
        },
        errText: {
            position: 'absolute',
            bottom: 10,
            fontSize: 12,
            color: 'red'
        }
    };

    componentDidMount() {
        $('.card').on('mouseenter', function () {
            $(this).children('.company').css({
                height: '35px'
            })
        });
        $('.card').on('mouseleave', function () {
            $(this).children('.company').css({
                height: '0px'
            })
        })
    }

    render() {
        const dialog = (
            <Dialog idx="company" title="合作咨询" content={
                <form>
                    <div className="form-group" style={this.styles.boxPadding}>
                        <div className="relativeBox">
                            <input type="text" placeholder="请输入您的公司/单位名称(必填)" style={this.styles.formInp}
                                   onChange={(v) => {
                                       const value = v.target.value;
                                       if (value.length) {
                                           this.company = value;
                                           this.setState({
                                               companyErr: ''
                                           })
                                       } else {
                                           this.setState({
                                               companyErr: '请输入公司名称!'
                                           })
                                       }
                                   }}/>
                            <p style={this.styles.errText as  any}>{this.state.companyErr}</p>
                        </div>
                        <div className="relativeBox">
                            <input type="text" placeholder="请输入您的姓名/称呼(必填)" style={this.styles.formInp}
                                   onChange={(v) => {
                                       const value = v.target.value;
                                       if (value.length) {
                                           this.name = value;
                                           this.setState({
                                               nameErr: ''
                                           })
                                       } else {
                                           this.setState({
                                               nameErr: '请输入姓名!'
                                           })
                                       }
                                   }}/>
                            <p style={this.styles.errText as  any}>{this.state.nameErr}</p>
                        </div>
                        <div className="relativeBox">
                            <input type="text" placeholder="请输入您的邮箱(必填)" style={this.styles.formInp}
                                   onChange={(v) => {
                                       let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                                       const value = v.target.value;
                                       if (reg.test(value)) {
                                           this.email = value;
                                           this.setState({
                                               emailErr: ''
                                           })
                                       } else {
                                           this.setState({
                                               emailErr: '请输入正确的邮箱!'
                                           })
                                       }
                                   }}/>
                            <p style={this.styles.errText as  any}>{this.state.emailErr}</p>
                        </div>
                        <div className="relativeBox">
                            <input type="text" placeholder="请输入您的联系电话公司:手机/固定电话(必填)" style={this.styles.formInp}
                                   onChange={(v) => {
                                       const value = v.target.value;
                                       let reg = /^\d/g;
                                       if (value.length) {
                                           if (reg.test(value)) {
                                               this.phone = value;
                                               this.setState({
                                                   phoneErr: ''
                                               })
                                           } else {
                                               this.setState({
                                                   phoneErr: '请输入正确手机号!'
                                               })
                                           }

                                       } else {
                                           this.setState({
                                               phoneErr: '请输入手机号!'
                                           })
                                       }
                                   }}/>
                            <p style={this.styles.errText as  any}>{this.state.phoneErr}</p>
                        </div>

                    </div>
                </form>
            } needConfirm onConfirm={
                () => {
                    let err = false;
                    if (!this.company.length || this.state.companyErr.length) {
                        err = true;
                        this.setState({
                            companyErr: '请输入公司名称!'
                        })
                    }
                    if (!this.name.length || this.state.nameErr.length) {
                        err = true;
                        this.setState({
                            nameErr: '请输入姓名!'
                        })
                    }
                    if (!this.email.length || this.state.emailErr.length) {
                        err = true;
                        this.setState({
                            emailErr: '请输入邮箱!'
                        })
                    }
                    if (!this.phone.length || this.state.phoneErr.length) {
                        err = true;
                        this.setState({
                            phoneErr: '请输入手机!'
                        })
                    }
                    if (!err) {
                        http.post(
                            "/cooperation", {
                                company: this.company,
                                name: this.name,
                                email: this.email,
                                phone: this.phone
                            }
                        ).then((response) => {
                                if (response.success) {
                                    $('#alert').modal('show');
                                    $('#company').modal('hide');
                                }
                            }
                        ).catch((err) => {
                            alert(err);
                        });
                    }
                }
            }
            />
        );

        let alertDialog = (
            <Dialog  idx="alert" title="提示"  content={
                <div>
                    <p className="centerText">资料已上传,我们会第一时间联系到您，谢谢!</p>
                </div>
            } needConfirm onConfirm={ () => {
                $('#alert').modal('hide');
            }}/>
        );
        return (
            <div className="relative" style={this.styles.mainContent} id="superDoctor">
                <Header path={SuperDoctor.PATH}/>
                {dialog}
                {alertDialog}
                {/*内容部分 */}
                <div style={this.styles.content as any} className="full-screen easing flex-column relative">
                    <div style={this.styles.headContent as any}>
                        
                    </div>

                    {/*产品功能模块*/}
                    <div style={this.styles.marginBox as any}>
                        <div style={this.styles.title as any}>
                            <p className="bold">产品功能</p>
                            <p>Product Function</p>
                        </div>

                        <div style={this.styles.lineFir as any}>
                            <div style={this.styles.cardsBox as any}>
                                <div className="card">
                                    <div className="cardContent">
                                        <div style={this.styles.imgBox}>
                                            <img src="/images/superDoctor/3.png"/>
                                        </div>
                                        <p style={this.styles.imgTitle as any}>心电图分析</p>
                                        <p style={this.styles.descript}>专注于心电图影像的检测、识别、筛查和分析技术</p>
                                    </div>
                                    <div className="company"
                                         data-toggle="modal"
                                         data-target="#company"
                                    >
                                        申请合作
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="cardContent">
                                        <div style={this.styles.imgBox}>
                                            <img src="/images/superDoctor/2.png"/>
                                        </div>
                                        <p style={this.styles.imgTitle as any}>胸部X片分析</p>
                                        <p style={this.styles.descript}>胸部X光的气胸、肺结核、肿块的自动诊断</p>
                                    </div>
                                    <div className="company"
                                         data-toggle="modal"
                                         data-target="#company"
                                    >
                                        申请合作
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="cardContent">
                                        <div style={this.styles.imgBox}>
                                            <img src="/images/superDoctor/1.png"/>
                                        </div>
                                        <p style={this.styles.imgTitle as any}>肺结节识别</p>
                                        <p style={this.styles.descript}>胸部X光的气胸、肺结核、肿块的自动诊断</p>
                                    </div>
                                    <div className="company"
                                         data-toggle="modal"
                                         data-target="#company"
                                    >
                                        申请合作
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="cardContent">
                                        <div style={this.styles.imgBox}>
                                            <img src="/images/superDoctor/4.png"/>
                                        </div>
                                        <p style={this.styles.imgTitle as any}>脑核磁肿瘤识别</p>
                                        <p style={this.styles.descript}>专注于脑核磁肿瘤的自动识别、筛查和分析技术</p>
                                    </div>
                                    <div className="company"
                                         data-toggle="modal"
                                         data-target="#company"
                                    >
                                        申请合作
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={this.styles.lineFir as any}>
                            <div style={this.styles.cardsBox as any}>
                                <div className="card">
                                    <div className="cardContent">
                                        <div style={this.styles.imgBox}>
                                            <img src="/images/superDoctor/5.png"/>
                                        </div>
                                        <p style={this.styles.imgTitle as any}>乳腺肿块识别</p>
                                        <p style={this.styles.descript}>专注于心电图影像的检测、识别、筛查和分析技术</p>
                                    </div>
                                    <div className="company"
                                         data-toggle="modal"
                                         data-target="#company"
                                    >
                                        申请合作
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*产品优势模块*/}
                    <div style={this.styles.moreMargin}>
                        <div style={this.styles.title as any}>
                            <p className="bold">产品优势</p>
                            <p>Product advantage</p>
                        </div>
                        <div style={this.styles.advantage as  any}>
                            <div>
                                <img src="./images/superDoctor/s1.png"/>
                                <p style={this.styles.descriptText}>通过训练，准确度已达87%，预期达到90%以上。</p>
                            </div>
                            <div>
                                <img src="./images/superDoctor/s2.png"/>
                                <p style={this.styles.descriptText}>无需通过波群检测，从而避免由于 P 波检测不准等引入的中间误差。</p>
                            </div>
                            <div>
                                <img src="./images/superDoctor/s3.png"/>
                                <p style={this.styles.descriptText}>可同时识别全部监测设备输出信号，识别过程仅需几秒。</p>
                            </div>
                            <div>
                                <img src="./images/superDoctor/s4.png"/>
                                <p style={this.styles.descriptText}>基于人工智能云识别平台，可远程辅助诊断，推动分级诊疗。</p>
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