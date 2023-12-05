<script setup lang="ts">
import moment from "moment";

import AttendanceRecord from "./AttendanceRecord.vue";
import WorkReport from "./WorkReport.vue";

const calcMonthly = () => {
  const startMonthly = 16;
  const endMonthly = 15;

  console.log(moment());
};
</script>
<template>
  <div class="flex flex-col">
    <h1 class="mb-8 font-bold text-2xl underline text-center">
      出勤簿 兼 作業報告書
    </h1>
    <div class="flex justify-around">
      <span class="mb-8 text-center text-xl">2024年 2月度</span>
      <span class="mb-8 text-center text-2xl underline">氏名 広田 祥大</span>
    </div>
    <div class="mb-8">
      <AttendanceRecord />
    </div>
    <div>
      <WorkReport />
    </div>
  </div>
</template>
