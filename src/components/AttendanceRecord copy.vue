<script setup lang="ts">
import { reactive, onMounted } from "vue";
import moment from "moment";

const data = reactive({
  start_month: "2024-2",
  end_month: "2024-2",
  block_size: 30,
  block_number: 0,
  calendars: [],
  inner_width: 0,
  inner_height: 0,
});

const getDays = (year: number, month: string, block_number: number) => {
  const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
  let days = [];
  let date = moment(`${year}-${month}-016`);
  let num = date.daysInMonth();
  for (let i = 0; i < num; i++) {
    days.push({
      day: date.date(),
      dayOfWeek: dayOfWeek[date.day()],
      block_number,
    });
    date.add(1, "day");
    block_number++;
  }
  return days;
};

const getCalendar = () => {
  let block_number = 0;
  let days;
  let start_month = moment(data.start_month);
  let end_month = moment(data.end_month);
  let between_month = end_month.diff(start_month, "months");
  for (let i = 0; i <= between_month; i++) {
    days = getDays(start_month.year(), start_month.format("MM"), block_number);

    data.calendars.push({
      date: start_month.format("YYYY年MM月"),
      year: start_month.year(),
      month: start_month.month(), //month(), 0,1..11と表示
      start_block_number: block_number,
      calendar: days.length,
      days: days,
    });

    start_month.add(1, "months");
    block_number = days[days.length - 1].block_number;
    block_number++;
  }
  return block_number;
};

const getWindowSize = () => {
  data.inner_width = window.innerWidth;
  data.inner_height = window.innerHeight;
};

const attendanceRecords = reactive([
  {
    workDate: "2023-11-16",
    overTime: "1.0",
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
  {
    workDate: "2023-11-17",
    overTime: "1.0",
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
  {
    workDate: "2023-11-18",
    overTime: "1.0",
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
  {
    workDate: "2023-11-19",
    overTime: "1.0",
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
  {
    workDate: "2023-11-20",
    overTime: "1.0",
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
]);

const fetchAttendanceRecodes = async () => {
  setTimeout(() => {
    console.log("0.3秒経ちました。");

    console.log(attendanceRecords);
  }, 0.3);
};

onMounted(() => {
  getCalendar();
  getWindowSize();
  fetchAttendanceRecodes();
  window.addEventListener("resize", getWindowSize);
});
</script>

<template>
  <div class="flex w-full h-96">
    <div id="gantt-content" class="flex">
      <div
        id="gantt-task"
        class="flex items-center bg-green-600 text-white h-20"
        ref="task"
      >
        <div
          id="gantt-task-title"
          class="flex items-center bg-green-600 text-white h-20"
        >
          <div
            class="border-t border-r border-b flex items-center justify-center font-bold text-xs w-48 h-full"
          >
            メモ
          </div>
          <div
            class="border-t border-r border-b flex items-center justify-center font-bold text-xs w-12 h-full"
          >
            種別
          </div>
        </div>
      </div>
    </div>
    <div id="gantt-calendar" class="overflow-x-scroll w-full">
      <div id="gantt-date" class="h-20">
        <div id="gantt-year-month" class="relative h-8">
          <div v-for="(calendar, index) in data.calendars" :key="index">
            <div
              class="bg-indigo-700 text-white border-b border-r border-t h-8 absolute font-bold text-sm flex items-center justify-center"
              :style="`width:${calendar.calendar * data.block_size}px;left:${
                calendar.start_block_number * data.block_size
              }px`"
            >
              {{ calendar.date }}度
            </div>
          </div>
        </div>

        <!-- 出勤簿テスト -->
        <table class="flex justify-center">
          <div v-for="(record, index) in attendanceRecords" v-bind:key="index">
            <thead>
              <tr>
                <th class="font-bold text-xs">{{ record.workDate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="flex flex-col items-center text-sm">
                <td>
                  {{ Number(record.overTime) > 0.0 ? record.overTime : "0.0" }}
                </td>
                <td>
                  {{
                    record.lateNightOverTime > 0.0
                      ? record.lateNightOverTime
                      : "0.0"
                  }}
                </td>
                <td>
                  {{
                    record.holidayWorkTime > 0.0
                      ? record.holidayWorkTime
                      : "0.0"
                  }}
                </td>
                <td>
                  {{
                    record.anuualVacation > 0.0 ? record.anuualVacation : "0.0"
                  }}
                </td>
                <td>
                  {{ record.absenteeism > 0.0 ? record.absenteeism : "0.0" }}
                </td>
                <td>
                  {{
                    record.publicHolidayTime > 0.0
                      ? record.publicHolidayTime
                      : "0.0"
                  }}
                </td>
              </tr>
            </tbody>
          </div>
        </table>
        <!-- 出勤簿テストここまで -->

        <!-- 出勤簿  -->
        <div id="gantt-day" class="relative h-12">
          <div id="gantt-calendar">
            <div id="gantt-day" class="relative h-12"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
