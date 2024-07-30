<template>
    <div class="myTime">{{ time }}</div>
    <div class="myData">{{ data }}</div>
</template>

<script>
export default({
    name: 'myTimer',
    components: {},
    props: {},
    data() {
        return {
            data: this.nowTime(new Date()).nyr,
            time: this.nowTime(new Date()).sfm,
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            this.data = this.nowTime(new Date()).nyr;
            this.time = this.nowTime(new Date()).sfm;
        }, 1000)
    },
    methods: {
        nowTime(time) {
            let y = time.getFullYear();
            let m = time.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            let d = time.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = time.getHours();
            h = h < 10 ? ('0' + h) : h;
            let minute = time.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            let second = time.getSeconds();
            second = second < 10 ? ('0' + second) : second;
            let sfm = h + ':' + minute + ':' + second;
            let nyr = y + '-' + m + '-' + d;
            return { sfm, nyr };
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
})
</script>

<style scoped>
.myTime,
.myData {
    color: white;
    width: 8%;
    height: 10%;
    font-size: 17px;
    position: absolute;
    /* display: inline-block; */
    margin-top: 1%;
    /* font-family: '站酷庆科黄油体'; */
    text-align: center;
}

.myData {
    font-size: 10px;
    margin-top: 2%;
}
</style>