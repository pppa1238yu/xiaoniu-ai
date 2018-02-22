import {Simulate} from "react-dom/test-utils";
import mouseUp = Simulate.mouseUp;
export enum DeviceType {
    MOBILE,
    TABLET_PORTRAIT,
    TABLET_LANDSCAPE,
    DESKTOP,
}

export default class Constants {
    static readonly devices = {
        s: {
            maxWidth: 600,
        },
        m_p: {
            maxWidth: 840,
        },
        m_l: {
            maxWidth: 1050,
        },
        l: {
            maxWidth: 1200,
        }
    };
    static readonly title = '小牛数据';

    static navHeight = 66;

    static readonly navZIndex = 1000;

    static readonly alertZIndex = 800;

    static readonly remoteHost = "127.0.0.1:5000";

    static readonly remoteHTTP = "http://";
}

declare let $;

export class Util {
    static emailRe = new RegExp('^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
    static phoneRe = new RegExp('^1[0-9]{10}$|^[569][0-9]{7}$/');

    static pickRandomKey(obj) {
        return Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)];
    }

    static unixTime() {
        return Date.now(); // same as above

    }

    static unix2date(date) {
        const d = Number(date);
        return Util.toYYYYMMDD(new Date(d));
    }

    static toYYYYMMDD(d) {
        let month = "" + (d.getMonth() + 1);
        if (month.length < 2) {
            month = "0" + month;
        }
        let day = "" + d.getDate();
        if (day.length < 2) {
            day = "0" + day;
        }

        let hours = "" + d.getHours();
        if (hours.length < 2) {
            hours = "0" + hours;
        }

        let minutes = "" + d.getMinutes();
        if (minutes.length < 2) {
            minutes = "0" + minutes;
        }

        let seconds = "" + d.getSeconds();
        if (seconds.length < 2) {
            seconds = "0" + seconds;
        }

        return [d.getFullYear(), month, day].join('-') + ' ' +
            [hours, minutes, seconds].join(':');
    }

    static date() {
        const d = new Date();
        return Util.toYYYYMMDD(d);
    }


    static validateEmail(email) {
        return Util.emailRe.test(email);
    }

    static validatePhone(phone) {
        return Util.phoneRe.test(phone);
    }

    static formatMoney2(money) {
        return money.toFixed(2);
    }

    static precisionIncrement(value) {
        value = value.toFixed(2);
        const prefixAdd = !(value < 0);
        if (prefixAdd) {
            value = "+" + value;
        }
        return value;
    }

    static precisionRate(value, number) {
        const prefixAdd = !(value < 0);
        let result: any = value * 100;
        result = result.toFixed(number) + "%";
        if (prefixAdd) {
            result = "+" + result;
        }
        return result;

    }

    static precisionRate2(value, number) {
        const prefixAdd = !(value < 0);
        let result: any = value;
        result = result.toFixed(number) + "%";
        if (prefixAdd) {
            result = "+" + result;
        }
        return result;

    }

    static device(width: number): DeviceType {
        if (width <= Constants.devices.s.maxWidth) {
            return DeviceType.MOBILE;
        } else if (width <= Constants.devices.m_p.maxWidth) {
            return DeviceType.TABLET_PORTRAIT;
        } else if (width <= Constants.devices.m_l.maxWidth) {
            return DeviceType.TABLET_LANDSCAPE;
        }
        return DeviceType.DESKTOP;
    }

    static middleDown(type) {
        return !(type == DeviceType.DESKTOP);
    }

    static small(type) {
        return type == DeviceType.MOBILE;
    }

    static portrait(type) {
        return type == DeviceType.TABLET_PORTRAIT;
    }

    static smallAndPortrait(type) {
        return type == DeviceType.TABLET_PORTRAIT
            || type == DeviceType.MOBILE;
    }

    static scrollTop() {
        $('html, body').animate({scrollTop: 0}, {duration: 400, queue: false, easing: 'easeOutCubic'});
    }

    static scrollTopInstant() {
        window.scrollTo(0, 0);
    }

    static isIE() {
        const ua = window.navigator.userAgent;
        const msie = ua.indexOf("MSIE ");

        return msie > 0;
    }

}
