class GradientColors {
    /**
    * 根据起始和终止颜色的rgba值以及色阶步数自动生成过渡色阶
    * @class
    * @param {String} startColor - 起始颜色
    * @param {String} endColor - 终止颜色
    * @param {Number} steps - 色阶步数
    */
    constructor(startColor, endColor, steps) {
        if (!startColor) {
            startColor = 'rgba(0,0,0,0)'
        }
        if (!endColor) {
            endColor = 'rgba(0,0,0,0)'
        }
        if (!steps) return
        const startRGBA = this.parseRGBA(startColor);
        const endRGBA = this.parseRGBA(endColor);

        const colorSteps = [];

        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const interpolatedRGBA = this.interpolateRGBA(startRGBA, endRGBA, ratio);
            colorSteps.push(interpolatedRGBA);
        }

        return colorSteps;
    }
    /**
     * @private
     */
    parseRGBA(rgbaValue) {
        const rgbaArray = rgbaValue.replace(/[rgba() ]/g, '').split(',');
        return {
            r: parseInt(rgbaArray[0], 10),
            g: parseInt(rgbaArray[1], 10),
            b: parseInt(rgbaArray[2], 10),
            a: parseFloat(rgbaArray[3])
        };
    }
    /**
     * @private
     */
    interpolateRGBA(start, end, ratio) {
        const r = Math.round(start.r + (end.r - start.r) * ratio);
        const g = Math.round(start.g + (end.g - start.g) * ratio);
        const b = Math.round(start.b + (end.b - start.b) * ratio);
        const a = (start.a + (end.a - start.a) * ratio).toFixed(2);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
}

export default GradientColors;

