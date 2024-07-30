<template>
    <div id="he-plugin-simple"></div>
</template>

<script>

export default ({
    name: 'myWeather',
    components: {},
    props: {},
    data() {
    },
    mounted() {
        window.WIDGET = {
            "CONFIG": {
                "modules": "024",
                "background": "5",
                "tmpColor": "FFFFFF",
                "tmpSize": "16",
                "cityColor": "FFFFFF",
                "citySize": "16",
                "aqiColor": "FFFFFF",
                "aqiSize": "16",
                "weatherIconSize": "24",
                "alertIconSize": "18",
                "padding": "10px 10px 10px 10px",
                "shadow": "0",
                "language": "auto",
                "fixed": "true",
                "vertical": "top",
                "horizontal": "left",
                "right": "0",
                "top": "15",
                "key": "2a89e258a4a04a508d127cee567468ec"
            }
        };
        (function (d) {
            var c = d.createElement('link')
            c.rel = 'stylesheet'
            c.href = 'https://widget.qweather.net/simple/static/css/he-simple.css?v=1.4.0'
            var s = d.createElement('script')
            s.src = 'https://widget.qweather.net/simple/static/js/he-simple.js?v=1.4.0'
            var sn = d.getElementsByTagName('script')[0]
            sn.parentNode.insertBefore(c, sn)
            sn.parentNode.insertBefore(s, sn)
        })(document)
    },
})
</script>
<style>
div[data-v-db6ccf64]{
    display: none !important;
    /* background-color: #0b325d;
    background: url("@/assets/speed/NanJingCIM/背景框.png") no-repeat center center;
	background-size: 100% 100%; */
    /* z-index: 1000 !important; */
}
</style>