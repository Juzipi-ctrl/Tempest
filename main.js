async function getHitokoto() {
    try {
        const response = await fetch("https://v1.hitokoto.cn/");
        const data = await response.json();
        // 直接访问"data"对象中的"hitokoto"和"from"字段
        return `"${data.hitokoto}" —— ${data.from}`;
    } catch (error) {
        if (error instanceof TypeError) {
            console.error("获取一言失败，缺少字段: " + error.message + "，请稍后再试。");
        } else {
            console.error("获取一言失败: " + error.message + "，请稍后再试。");
        }
        return "保持活力，努力工作！"; // 如果API请求失败，显示默认寄语
    }
}

function updateCountdown() {
    const now = new Date();

    // 今年剩余时间
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const yearTotal = yearEnd - new Date(now.getFullYear(), 0, 1);
    const yearRemaining = yearEnd - now;
    const yearProgress = ((yearTotal - yearRemaining) / yearTotal) * 100;

    $('#year-progress').css('width', `${yearProgress}%`);
    $('#year-time').text(`${Math.floor(yearRemaining / (1000 * 60 * 60 * 24))}天`);
    $('#year-percentage').text(`${yearProgress.toFixed(2)}%`); // 移到进度条外面

    // 本月剩余时间
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const monthTotal = monthEnd - new Date(now.getFullYear(), now.getMonth(), 1);
    const monthRemaining = monthEnd - now;
    const monthProgress = ((monthTotal - monthRemaining) / monthTotal) * 100;

    $('#month-progress').css('width', `${monthProgress}%`);
    $('#month-time').text(`${Math.floor(monthRemaining / (1000 * 60 * 60 * 24))}天`);
    $('#month-percentage').text(`${monthProgress.toFixed(2)}%`); // 移到进度条外面

    // 今天剩余时间
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const dayTotal = 24 * 60 * 60 * 1000;
    const dayRemaining = dayEnd - now;
    const dayProgress = ((dayTotal - dayRemaining) / dayTotal) * 100;

    $('#day-progress').css('width', `${dayProgress}%`);
    const hoursRemaining = Math.floor(dayRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((dayRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const secondsRemaining = Math.floor((dayRemaining % (1000 * 60)) / 1000);

    $('#day-time').text(`${hoursRemaining}小时${minutesRemaining}分钟${secondsRemaining}秒`);
    $('#day-percentage').text(`${dayProgress.toFixed(2)}%`); // 移到进度条外面

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

    // 更新日期进度条
    $('#date-progress-bar').css('width', `${yearProgress}%`);
    $('#date-percentage').text(`${yearProgress.toFixed(2)}%`); // 移到进度条外面

    // 显示当前时间
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedTime = now.toLocaleTimeString('zh-CN', timeOptions);
    $('#current-time').text(`当前时间: ${formattedTime}`);
}

function updateHolidayNotification(now) {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    $.getJSON(`https://api.jiejiariapi.com/v1/holidays/${year}`, function (holidays) {
        const holiday = holidays[today];

        if (holiday) {
            $('#holiday-notification').text(`今天是：${holiday.name}`).show();
        } else {
            $('#holiday-notification').text(`今天不是节假日`).show();
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(`无法获取节假日数据: ${textStatus}, ${errorThrown}`);
        $('#holiday-notification').text(`今天不是节假日`).show();
    });

    // 请求API获取每日寄语
    getHitokoto().then(poemContent => {
        $('#daily-message').text(poemContent).show();
    });
}

// 初始化并每秒更新一次
$(document).ready(function () {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    // 每天更新一次节假日通知和寄语
    updateHolidayNotification(new Date());
    setInterval(updateHolidayNotification, 24 * 60 * 60 * 1000);
});