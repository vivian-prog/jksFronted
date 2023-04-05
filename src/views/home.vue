<template>
    <v-scale-screen width="1920" height="1080">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class = "host-body" style="height:100%;">
            <div class="header">
                <div class="zuojuxing"></div>
                <div class="youjuxing"></div>
                <span class="header-time">{{dateFormat(newDate)}}</span>
                
                <div class="headtitle">
                        <span class="title-text">全息路口认知与分析系统</span>
                </div>
                <div class="header-position">广州市海珠区</div>
                
            </div>
            
            <div class="selectRange">
                <Menu mode="horizontal" @on-select="(name) =>$router.push(name)" :active-name="$route.name">
                    <MenuItem name="page1" >
                        基础数据
                    </MenuItem>
                    <MenuItem name="page2">
                        事件分析
                    </MenuItem>
                    <MenuItem name="page3">
                        仿真推演
                    </MenuItem>
                </Menu>
            </div>
            <!-- <Modal
                v-model="modal"
                title="选择时间"
                :mask-closable="false"
                @on-ok="getMonthBetween(startTime,endTime)"
            >
                <DatePicker @on-change="pickStartDate" :options="optionStart" type="date" placeholder="选择开始日期"
                            style="width: 200px"></DatePicker>
                <span style="padding:0 20px;color:#75deef">至</span>
                <DatePicker @on-change="pickEndDate" :options="optionEnd" type="date" placeholder="选择结束日期"
                            style="width: 200px"></DatePicker>
            </Modal> -->
            
            <div class="page">
                <router-view v-if="flag" :selectRangeDate='selectRangeDate'></router-view>
            </div>
        </div>
    </v-scale-screen>
</template>

<script>
import VScaleScreen from 'v-scale-screen'
export default {
    components: {VScaleScreen},
    name: '',
    data() {
        return {
            activeName: 'month',// 默认显示近一月
            loading: true,
            modal: false,
            flag: false,
            selectRangeDate: [],
            startTime: '',
            endTime: '',
            optionStart: {
                disabledDate(date) { // 禁止选择今天之后的日期
                    return date && date.valueOf() > Date.now() - 86400000;
                }
            },
            optionEnd: {},
            resizeFn: null,
            newDate: new Date()
        }
    },
    mounted() {
        window.addEventListener('resize', this.resizeFn);
        this.handleSelect(this.activeName); // 默认显示近一个月
        let that = this;
        this.timer = setInterval(function () {
        that.newDate = new Date().toLocaleString()
        })
        this.cancelLoading();
    },
    methods: {
        cancelLoading() {
            let timer = setTimeout(() => {
            this.loading = false;
            clearTimeout(timer);
            }, 500);
        },
        pickStartDate(date) { // 选择开始时间的回调
            this.startTime = date;
            this.optionEnd = {
                disabledDate(d) { // 禁止选择开始时间之前的日期
                    return d && d.valueOf() < new Date(date).valueOf() - 86400000;
                }
            }
        },
        pickEndDate(date) { // 选择结束时间的回调
            this.endTime = date;
        },
        getMonthBetween(start, end) {  // 获取开始时间和结束时间之内的所有月份
            this.selectRangeDate = [];
            let s = start.split("-");  // 字符串装换数组
            let e = end.split("-");
            let date = new Date();
            let min = date.setFullYear(s[0], s[1] - 1); // 设置最小时间
            let max = date.setFullYear(e[0], e[1] - 1); // 设置最大时间
            let curr = min;
            while (curr <= max) {  // 循环添加月份
                var month = curr.getMonth();
                var arr = [curr.getFullYear(), month + 1];
                this.selectRangeDate.push(arr);
                curr.setMonth(month + 1);
            }
        },
        getDays(day) {// 获取天数
            let arr = [];
            for (let i = -day; i < 0; i++) { // 循环添加天数
                let today = new Date();// 获取今天
                let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * i;
                today.setTime(targetday_milliseconds); //设置i天前的时间
                let tYear = today.getFullYear();
                let tMonth = today.getMonth();
                let tDate = today.getDate();
                let date = [tYear, tMonth + 1, tDate];
                arr.push(date);
            }
            return arr
        },
        handleSelect(name) {
            switch (name) {
                case 'day':

                    break;
                case 'week':

                    this.selectRangeDate = this.getDays(7);// 获取近一周的天数
                    this.flag = true;

                    break;
                case 'month':
                    this.selectRangeDate = this.getDays(30);// 获取近一个月的天数
                    this.flag = true;
                    break;
                case 'filter':
                    this.modal = true;
                    break;
                default:
                    break;
            }

        },
        dateFormat () {
            var date = new Date()
            var year = date.getFullYear()
            var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
            var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            let week = date.getDay() // 星期
            let weekArr = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ]
            // 拼接 时间格式处理
            return year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes + ':' + seconds + ' ' + weekArr[week]
        },

    },
    beforeDestroy: function () {
        if (this.timer) {
        clearInterval(this.timer)
        }
    },
}
</script>

<style lang="less">
.ivu-modal {
    .ivu-modal-content {
        background: #071332;

        .ivu-modal-header {
            border-bottom: 1px solid #1a3c58;

            .ivu-modal-header-inner {
                color: #75deef;
            }
        }

        .ivu-modal-body {
            text-align: center;

            .ivu-icon {
                color: #75deef
            }

            .ivu-modal-confirm-body {
                padding-left: 0;
                color: #75deef
            }

            .ivu-input {
                background-color: rgba(0, 0, 0, 0);
                border: 1px solid #1a3c58;
                color: #75deef;

                &::-webkit-input-placeholder { /* WebKit, Blink, Edge */
                    color: #75deef;
                }

                &::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                    color: #75deef;
                }

                &::-moz-placeholder { /* Mozilla Firefox 19+ */
                    color: #75deef;
                }

                &::-ms-input-placeholder { /* Internet Explorer 10-11 */
                    color: #75deef;
                }
            }

            .ivu-picker-panel-body {
                background: #071332;

                .ivu-date-picker-header {
                    color: #75deef;
                    border-bottom: 1px solid #1a3c58
                }

                .ivu-date-picker-cells-cell {
                    color: #75deef;

                    &:hover em {
                        background: #1a3c58;
                    }
                }

                .ivu-date-picker-cells-cell-disabled {
                    background: rgba(0, 0, 0, 0);
                    color: #eee
                }

                .ivu-date-picker-cells-focused em {
                    box-shadow: 0 0 0 1px #1a3c58 inset;

                    &::after {
                        background: #1a3c58;
                    }
                }
            }
        }

        .ivu-modal-footer {
            border-top: 1px solid #1a3c58;

            .ivu-btn-primary {
                color: #75deef;
                background: #1a3c58;
            }

            .ivu-btn-text {
                color: #ddd;

                &:hover {
                    color: #75deef;
                    background: #1a3c58;
                }
            }
        }
    }

}


.host-body{
    width: 100%;
    height: 100%;
    padding: 16px 16px 10px 16px;
    box-sizing: border-box;
    background-image: url("../assets/pageBg.png");
    background-size: cover;
    background-position: center center;
}
// 控制标题格式
.header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .headtitle {
        position: center;
        // width: 500px;
        margin-left:-5%;
        text-align: center;
        background-size: cover;
        color: transparent;
        height: 60px;
        line-height: 46px;

        .title-text {
            font-size: 38px;
            font-weight: 900;
            letter-spacing: 6px;
            width: 100%;
            background: linear-gradient(92deg, #0072FF 0%, #00EAFF 48.8525390625%, #01AAFF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    &-time {
        color: #75deef;
        font-size: 20px;
        margin-left:5%;
        text-align: left;
    }

    &-position{
        color: #75deef;
        font-size: 20px;
        margin-right:10%;
        text-align: left;
    }

    height: 60px;
            background-image: url("../assets/top.png");
            background-size: cover;
            background-position: center center;
            position: relative;
            margin-bottom: 4px;

            .guang {
                position: absolute;
                bottom: -26px;
                background-image: url("../assets/guang.png");
                background-position: 80px center;
                width: 100%;
                height: 56px;
            }

            .zuojuxing,
            .youjuxing {
                position: absolute;
                top: -2px;
                width: 140px;
                height: 6px;
                background-image: url("../assets/headers/juxing1.png");
            }

            .zuojuxing {

                left: 11%;
            }

            .youjuxing {
                right: 11%;
                transform: rotate(180deg);
            }
}
.selectRange {
        height: 60px;

        .ivu-menu-horizontal {
            background: rgba(255, 255, 255, 0);

            &::after {
                height: 0;
            }

            .ivu-menu-item-active {
                border-bottom: 2px solid #264e5e;

            }

            .ivu-menu-item, .ivu-menu-submenu {
                color: #75deef;
                font-size:20px;
                width:628px;
                text-align: center;

                &:hover {
                    border-bottom: 2px solid #264e5e;
                }
            }

            .ivu-select-dropdown {
                background: #09102E;

                .ivu-menu-item {
                    color: #75deef;

                    &:hover {

                        border-bottom: 2px solid #264e5e;
                        background-color: rgba(255, 255, 255, 0);
                    }
                }
            }

            .ivu-menu-submenu-title {
                i {
                    margin-right: 0;
                }

                .ivu-icon-ios-arrow-down {
                    display: none;
                }
            }
        }
    }
.page {
    height: calc(~ '100% - 80px');
}

.zuojuxing,
        .youjuxing {
            position: absolute;
            top: -2px;
            width: 140px;
            height: 6px;
            background-image: url("../assets/headers/juxing1.png");
        }

        .zuojuxing {

            left: 11%;
        }

        .youjuxing {
            right: 11%;
            transform: rotate(180deg);
        }

</style>

