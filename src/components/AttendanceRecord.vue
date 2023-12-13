<script setup lang="ts">
import { reactive, onMounted, watch } from "vue";

import { getCalendar } from "../libs/calendar.ts";
import { caluCurrentMonthly, getDayInUTC } from "../libs/date.ts";
import { getWindowSize } from "../libs/functions";

const { attendanceRecords } = defineProps(["attendanceRecords"]);

onMounted(() => {
  init();
});

const init = () => {
  getCalendar(reactiveData);

  getWindowSize(reactiveData);
  window.addEventListener("resize", getWindowSize);
};

watch(attendanceRecords, () => {
  calcCumulativeTotal();
});

const reactiveData = reactive({
  attendanceTypes: [
    {
      overTime: "残業",
      lateNightOverTime: "深夜",
      holidayWorkTime: "休出",
      annualVacation: "年休",
      absenteeism: "欠勤",
      publicHolidayTime: "公休",
    },
  ],
  calendars: {},
  cumulativeTotal: {
    overTime: 0.0,
    lateNightOverTime: 0.0,
    holidayWorkTime: 0.0,
    annualVacation: 0.0,
    absenteeism: 0.0,
    publicHolidayTime: 0.0,
  },
  start_month: caluCurrentMonthly(),
  end_month: caluCurrentMonthly(),
  inner_width: 0,
  inner_height: 0,
});

const calcCumulativeTotal = () => {
  for (let i = 0; i < attendanceRecords.length; i++) {
    reactiveData.cumulativeTotal.overTime += attendanceRecords[i].overTime;

    reactiveData.cumulativeTotal.lateNightOverTime +=
      attendanceRecords[i].lateNightOverTime;

    reactiveData.cumulativeTotal.holidayWorkTime +=
      attendanceRecords[i].holidayWorkTime;

    reactiveData.cumulativeTotal.absenteeism +=
      attendanceRecords[i].absenteeism;

    reactiveData.cumulativeTotal.publicHolidayTime +=
      attendanceRecords[i].publicHolidayTime;
  }
};
</script>

<template>
  <div class="flex h-56">
    <!-- 出勤メモ -->
    <div class="">
      <div class="flex items-center h-20">
        <div
          class="flex flex-col justify-center items-center border-r h-full w-48 bg-green-600 font-bold text-sm text-white"
        >
          出勤時間に関するメモ
        </div>
      </div>
      <div class="h-full">
        <input type="text" class="w-full h-full" />
      </div>
    </div>
    <!-- 出勤メモここまで -->

    <!-- 種別 -->
    <table class="flex border-r border-l">
      <div
        v-for="(type, index) in reactiveData.attendanceTypes"
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
            v-for="(dayObj, index) in reactiveData.calendars.days"
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
                v-if="dayObj.day === getDayInUTC(record.workDate)"
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
              {{ reactiveData.cumulativeTotal.overTime.toFixed(1) }}&nbsp;時間
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{
                reactiveData.cumulativeTotal.lateNightOverTime.toFixed(1)
              }}&nbsp;時間
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{
                reactiveData.cumulativeTotal.holidayWorkTime.toFixed(1)
              }}&nbsp;時間
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{
                reactiveData.cumulativeTotal.annualVacation.toFixed(1)
              }}&nbsp;日
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{ reactiveData.cumulativeTotal.absenteeism.toFixed(1) }}&nbsp;日
            </td>
            <td
              class="flex justify-center items-center w-full text-base h-6 border-b"
            >
              {{
                reactiveData.cumulativeTotal.publicHolidayTime.toFixed(1)
              }}&nbsp;日
            </td>
          </tr>
        </tbody>
      </div>
    </table>

    <!-- 累計ここまで -->
  </div>
</template>
