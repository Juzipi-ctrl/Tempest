// script.js
$(document).ready(function () {
    function updateCountdown() {
        const now = new Date();

        // 今年剩余时间
        const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        const yearTotal = yearEnd - new Date(now.getFullYear(), 0, 1);
        const yearRemaining = yearEnd - now;
        const yearProgress = ((yearTotal - yearRemaining) / yearTotal) * 100;

        $('#year-progress').css('width', `${yearProgress}%`);
        $('#year-time').text(`${Math.floor(yearRemaining / (1000 * 60 * 60 * 24))}天`);

        // 本月剩余时间
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const monthTotal = monthEnd - new Date(now.getFullYear(), now.getMonth(), 1);
        const monthRemaining = monthEnd - now;
        const monthProgress = ((monthTotal - monthRemaining) / monthTotal) * 100;

        $('#month-progress').css('width', `${monthProgress}%`);
        $('#month-time').text(`${Math.floor(monthRemaining / (1000 * 60 * 60 * 24))}天`);

        // 今天剩余时间
        const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const dayTotal = 24 * 60 * 60 * 1000; // 一天的总毫秒数
        const dayRemaining = dayEnd - now;
        const dayProgress = ((dayTotal - dayRemaining) / dayTotal) * 100;

        $('#day-progress').css('width', `${dayProgress}%`);
        const hoursRemaining = Math.floor(dayRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((dayRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const secondsRemaining = Math.floor((dayRemaining % (1000 * 60)) / 1000);

        $('#day-time').text(`${hoursRemaining}小时${minutesRemaining}分钟${secondsRemaining}秒`);

        // 显示当前日期
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('zh-CN', options);
        $('#date-time').text(`今天是: ${formattedDate}`);

        // 显示星期几
        const daysOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        $('#day-of-week').text(`${daysOfWeek[now.getDay()]}`);

        // 显示周数
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now - firstDayOfYear) / (24 * 60 * 60 * 1000);
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        $('#week-number').text(`第${weekNumber}周`);
    }

    // 初始化并每秒更新一次
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
