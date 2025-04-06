let manualHolidays = {}; // 手动添加的节假日数据对象

// 手动添加节假日数据的函数
function addManualHoliday(date, name) {
    manualHolidays[date] = { name: name };
}

// 异步获取一言的函数
async function getHitokoto() {
    try {
        const response = await fetch("https://v1.hitokoto.cn/");
        const data = await response.json();
        return `"${data.hitokoto}" —— ${data.from}`;
    } catch (error) {
        if (error instanceof TypeError) {
            console.error("获取一言失败，缺少字段: " + error.message + "，请稍后再试。");
        } else {
            console.error("获取一言失败: " + error.message + "，请稍后再试。");
        }
        return "保持活力，努力工作！";
    }
}

// 异步获取指定年份节假日信息的函数
async function getHolidays(year) {
    try {
        const response = await fetch(`https://unpkg.com/holiday-calendar@1.1.6/data/CN/${year}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // 将日期数组转换为对象，键为日期字符串，值为日期信息对象
        const holidays = {};
        data.dates.forEach(dateInfo => {
            holidays[dateInfo.date] = dateInfo;
        });
        return holidays;
    } catch (error) {
        console.error("获取节假日信息时出错:", error);
        return {};
    }
}

// 更新倒计时的函数
function updateCountdown() {
    const now = new Date();

    // 今年剩余时间
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const yearTotal = yearEnd - new Date(now.getFullYear(), 0, 1);
    const yearRemaining = yearEnd - now;
    const yearProgress = ((yearTotal - yearRemaining) / yearTotal) * 100;

    $('#year-progress').css('width', `${yearProgress}%`);
    $('#year-time').text(`${Math.floor(yearRemaining / (1000 * 60 * 60 * 24))}天`);
    $('#year-percentage').text(`${yearProgress.toFixed(2)}%`);

    // 本月剩余时间
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const monthTotal = monthEnd - new Date(now.getFullYear(), now.getMonth(), 1);
    const monthRemaining = monthEnd - now;
    const monthProgress = ((monthTotal - monthRemaining) / monthTotal) * 100;

    $('#month-progress').css('width', `${monthProgress}%`);
    $('#month-time').text(`${Math.floor(monthRemaining / (1000 * 60 * 60 * 24))}天`);
    $('#month-percentage').text(`${monthProgress.toFixed(2)}%`);

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
    $('#day-percentage').text(`${dayProgress.toFixed(2)}%`);

    // 显示当前日期
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('zh-CN', options);
    $('#date-time').text(`今天是: ${formattedDate}`);

    // 显示星期几
    const daysOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    $('#day-of-week').text(`${daysOfWeek[now.getDay()]}`);

    // 显示周数
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const firstMonday = new Date(now.getFullYear(), 0, 1 + (dayOfWeek === 0 ? 1 : 8 - dayOfWeek));
    const pastDaysOfYear = (now - firstMonday) / (24 * 60 * 60 * 1000);
    const weekNumber = Math.ceil(pastDaysOfYear / 7) + 1;

    $('#week-number').text(`第${weekNumber}周`);

    // 更新本周进度条（修正版）
    const now2 = new Date();

    /*-- 修正1：确保周起始时间精确到周一0点 --*/
    // 创建本周一的0点时间对象（原逻辑保留但增加时间归零）
    const firstDayOfWeek = new Date(now2);
    firstDayOfWeek.setDate(now2.getDate() - (now2.getDay() || 7) + 1);
    firstDayOfWeek.setHours(0, 0, 0, 0); // 新增：强制归零时间

    /*-- 修正2：周结束时间改为周日23:59:59 --*/
    const weekEnd = new Date(firstDayOfWeek);
    weekEnd.setDate(firstDayOfWeek.getDate() + 6); // 原daysInWeek变量可保留但实际改为+6天
    weekEnd.setHours(23, 59, 59, 999); // 新增：精确到本周日23:59:59

    /*-- 修正3：精确计算时间差 --*/
    const weekTotal = weekEnd - firstDayOfWeek; // 总时长固定为604800000ms(7天)
    const weekPassed = now - firstDayOfWeek;
    const weekProgress = Math.min(
        (weekPassed / weekTotal) * 100,
        100 // 防止超过100%
    ).toFixed(2); // 保留两位小数

    /*-- 修正4：自然日剩余天数计算 --*/
    const remainingMilliseconds = weekEnd - now2;
    let remainingDays = Math.ceil(remainingMilliseconds / (1000 * 3600 * 24));
    // 边界处理（原条件判断改为数学计算）
    if (remainingDays < 0) remainingDays = 0;

    /*-- 更新DOM --*/
    $('#week-progress').css('width', `${weekProgress}%`);
    $('#week-time').text(`${remainingDays}天`);
    $('#week-percentage').text(`${weekProgress}%`);

    // 显示当前时间
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedTime = now.toLocaleTimeString('zh-CN', timeOptions);
    $('#current-time').text(`当前时间: ${formattedTime}`);
}

// 更新节假日通知的函数
function updateHolidayNotification(now) {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    getHolidays(year).then(apiHolidays => {
        const holidays = { ...apiHolidays, ...manualHolidays };

        if (holidays[today]) {
            $('#holiday-notification').text(`今天是：${holidays[today].name} -- 好好休息！`).show();
        } else {
            $('#holiday-notification').text(`今天不是节假日`).show();
        }
    }).catch(error => {
        console.log(`无法获取节假日数据: ${error}`);
        $('#holiday-notification').text(`今天不是节假日`).show();
    });

    getHitokoto().then(poemContent => {
        $('#daily-message').text(poemContent).show();
    });
}

$(document).ready(function () {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    updateHolidayNotification(new Date());
    setInterval(updateHolidayNotification, 24 * 60 * 60 * 1000);

    addManualHoliday('2026-01-01', '新年快乐，元旦快乐！');
});