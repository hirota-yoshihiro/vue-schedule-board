<script setup lang="ts">
import { reactive, onMounted } from "vue";
import moment from "moment";

const data = reactive({
  start_month: "2024-2",
  end_month: "2024-2",
  calendars: {},
  inner_width: 0,
  inner_height: 0,
});

const attendanceTypes = reactive([
  {
    overTime: "残業",
    lateNightOverTime: "深夜",
    holidayWorkTime: "休出",
    annualVacation: "年休",
    absenteeism: "欠勤",
    publicHolidayTime: "公休",
  },
]);

const cumulativeTotal = reactive({
  overTime: 0.0,
  lateNightOverTime: 0.0,
  holidayWorkTime: 0.0,
  annualVacation: 0.0,
  absenteeism: 0.0,
  publicHolidayTime: 0.0,
});

//  APIから取得した仮の勤怠入力データを想定。
const attendanceRecords = reactive([
  {
    workDate: "2024-2-16",
    overTime: 1.0,
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
  {
    workDate: "2024-2-17",
    overTime: 1.0,
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
  {
    workDate: "2024-2-18",
    overTime: 1.0,
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
  {
    workDate: "2024-2-19",
    overTime: 1.0,
    lateNightOverTime: 0,
    holidayWorkTime: 0,
    anuualVacation: 0,
    absenteeism: 0,
    publicHolidayTime: 0,
  },
  {
    workDate: "2024-2-20",
    overTime: 1.0,
    lateNightOverTime: 2.0,
    holidayWorkTime: 2.0,
    anuualVacation: 0.0,
    absenteeism: 0.0,
    publicHolidayTime: 3.0,
  },
]);

// APIから取得した勤怠入力仮のデータここまで

const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
const getDays = (year: number, month: string, block_number: number) => {
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

    data.calendars = {
      days,
      date: start_month.format("YYYY年MM月"),
    };

    start_month.add(1, "months");
    block_number = days[days.length - 1].block_number;
    block_number++;
  }

  return block_number;
};

const calcCumulativeTotal = () => {
  for (let i = 0; i < attendanceRecords.length; i++) {
    cumulativeTotal.overTime += attendanceRecords[i].overTime;
    cumulativeTotal.lateNightOverTime += attendanceRecords[i].lateNightOverTime;
    cumulativeTotal.holidayWorkTime += attendanceRecords[i].holidayWorkTime;
    cumulativeTotal.absenteeism += attendanceRecords[i].absenteeism;
    cumulativeTotal.publicHolidayTime += attendanceRecords[i].publicHolidayTime;
  }
};

const getWindowSize = () => {
  data.inner_width = window.innerWidth;
  data.inner_height = window.innerHeight;
};

const fetchAttendanceRecodes = async () => {};

onMounted(() => {
  getCalendar();
  getWindowSize();
  fetchAttendanceRecodes();
  calcCumulativeTotal();
  window.addEventListener("resize", getWindowSize);
});
</script>

<template>
  <div class="flex h-56">
    <div class="flex items-center h-20">
      <div class="flex items-center h-full">
        <!-- 出勤メモ -->
        <div class="flex flex-col h-full border-r">
          <div
            class="flex flex-col justify-center items-center h-full w-48 bg-green-600 font-bold text-sm text-white"
          >
            出勤時間に関するメモ
          </div>
        </div>
        <!-- 出勤メモここまで -->
      </div>
    </div>

    <!-- 種別 -->
    <table class="flex border-r border-l">
      <div
        v-for="(type, index) in attendanceTypes"
        v-bind:key="index"
        class="flex flex-col items-center"
      >
        <thead>
          <tr>
            <th
              class="flex flex-col justify-center h-20 w-12 bg-green-600 font-bold text-sm text-white"
            >
              <span>種別</span>
            </th>
          </tr>
        </thead>
        <tbody class="w-full h-full">
          <tr class="flex flex-col items-center h-36 w-full">
            <td
              class="flex justify-center items-center w-full font-bold text-sm h-6 border-b"
            >
              {{ type.overTime }}
            </td>
            <td
              class="flex justify-center items-center w-full font-bold text-sm h-6 border-b"
            >
              {{ type.lateNightOverTime }}
            </td>
            <td
              class="flex justify-center items-center w-full font-bold text-sm h-6 border-b"
            >
              {{ type.holidayWorkTime }}
            </td>
            <td
              class="flex justify-center items-center w-full font-bold text-sm h-6 border-b"
            >
              {{ type.annualVacation }}
            </td>
            <td
              class="flex justify-center items-center w-full font-bold text-sm h-6 border-b"
            >
              {{ type.absenteeism }}
            </td>
            <td
              class="flex justify-center items-center w-full font-bold text-sm h-6 border-b"
            >
              {{ type.publicHolidayTime }}
            </td>
          </tr>
        </tbody>
      </div>
    </table>
    <!-- 種別ここまで -->

    <!-- 出勤カレンダー -->
    <div class="overflow-x-scroll border-t border-b border-r">
      <div class="h-20">
        <table class="flex">
          <div
            v-for="(dayObj, index) in data.calendars.days"
            v-bind:key="index"
          >
            <thead class="border-r border-b">
              <tr>
                <th class="flex flex-col justify-center h-20 w-8">
                  <span
                    class="font-bold"
                    v-bind:class="
                      dayObj.dayOfWeek === '土' || dayObj.dayOfWeek === '日'
                        ? 'text-red-800'
                        : ''
                    "
                    >{{ dayObj.day }}</span
                  >
                  <span
                    class="font-bold"
                    v-bind:class="
                      dayObj.dayOfWeek === '土' || dayObj.dayOfWeek === '日'
                        ? 'text-red-800'
                        : ''
                    "
                    >{{ dayObj.dayOfWeek }}</span
                  >
                </th>
              </tr>
            </thead>
            <div
              v-for="(record, index) in attendanceRecords"
              v-bind:key="index"
              class="flex flex-col items-center border-r"
            >
              <tbody
                v-if="dayObj.day == moment(record.workDate).date()"
                class="w-full"
              >
                <tr class="flex flex-col items-center h-36 w-full">
                  <td
                    class="flex justify-center items-center w-full text-base h-6 border-b"
                  >
                    {{
                      record.overTime > 0.0 ? record.overTime.toFixed(1) : "0.0"
                    }}
                  </td>
                  <td
                    class="flex justify-center items-center w-full text-base h-6 border-b"
                  >
                    {{
                      record.lateNightOverTime > 0.0
                        ? record.lateNightOverTime.toFixed(1)
                        : ""
                    }}
                  </td>
                  <td
                    class="flex justify-center items-center w-full text-base h-6 border-b"
                  >
                    {{
                      record.holidayWorkTime > 0.0
                        ? record.holidayWorkTime.toFixed(1)
                        : ""
                    }}
                  </td>
                  <td
                    class="flex justify-center items-center w-full text-base h-6 border-b"
                  >
                    {{
                      record.anuualVacation > 0.0
                        ? record.anuualVacation.toFixed(1)
                        : ""
                    }}
                  </td>
                  <td
                    class="flex justify-center items-center w-full text-base h-6 border-b"
                  >
                    {{
                      record.absenteeism > 0.0
                        ? record.absenteeism.toFixed(1)
                        : ""
                    }}
                  </td>
                  <td
                    class="flex justify-center items-center w-full text-base h-6"
                  >
                    {{
                      record.publicHolidayTime > 0.0
                        ? record.publicHolidayTime.toFixed(1)
                        : ""
                    }}
                  </td>
                </tr>
              </tbody>
            </div>
          </div>
        </table>
      </div>
    </div>

    <!-- 出勤カレンダーここまで -->

    <!-- 累計 -->
    <table class="flex border-r border-l">
      <div>
        <thead>
          <tr>
            <th
              class="flex flex-col justify-center h-20 w-24 bg-green-600 font-bold text-sm text-white"
            >
              <span>累計</span>
            </th>
          </tr>
        </thead>
        <tbody class="w-full h-full">
          <tr class="flex flex-col items-center h-36 w-full">
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{ cumulativeTotal.overTime.toFixed(1) }}&nbsp;時間
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{ cumulativeTotal.lateNightOverTime.toFixed(1) }}&nbsp;時間
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{ cumulativeTotal.holidayWorkTime.toFixed(1) }}&nbsp;時間
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{ cumulativeTotal.annualVacation.toFixed(1) }}&nbsp;日
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{ cumulativeTotal.absenteeism.toFixed(1) }}&nbsp;日
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{ cumulativeTotal.publicHolidayTime.toFixed(1) }}&nbsp;日
            </td>
          </tr>
        </tbody>
      </div>
    </table>

    <!-- 累計ここまで -->
  </div>
</template>
