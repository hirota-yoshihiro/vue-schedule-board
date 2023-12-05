<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
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

onMounted(() => {
  getCalendar();
  getWindowSize();
  window.addEventListener("resize", getWindowSize);
});
</script>

<template>
  <div class="flex w-full">
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
        <div id="gantt-day" class="relative h-12">
          <div id="gantt-calendar">
            <div id="gantt-day" class="relative h-12">
              <div v-for="(calendar, index) in data.calendars" :key="index">
                <div v-for="(day, index) in calendar.days" :key="index">
                  <div
                    class="border-r h-12 absolute flex items-center justify-center flex-col font-bold text-xs"
                    :style="`width:${data.block_size}px;left:${
                      day.block_number * data.block_size
                    }px`"
                  >
                    <span
                      v-bind:class="
                        day.dayOfWeek === '土' || day.dayOfWeek === '日'
                          ? 'text-red-800 '
                          : ''
                      "
                      >{{ day.day }}</span
                    >
                    <span
                      v-bind:class="
                        day.dayOfWeek === '土' || day.dayOfWeek === '日'
                          ? 'text-red-800 '
                          : ''
                      "
                      >{{ day.dayOfWeek }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
