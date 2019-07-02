export class BubbleChartUtility {

    getPercentage(count: number, total: number) {
        return (count * 100) / total;
    }

    getAngle(percentage: number) {
        return (percentage / 100) * 360;
    }

    getRadians(angle: number) {
        return angle * (Math.PI / 180);
    }
}
