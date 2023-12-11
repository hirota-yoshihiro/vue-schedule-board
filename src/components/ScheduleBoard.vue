<script setup lang="ts">
import { reactive, onMounted } from "vue";
import axios from "axios";
import moment from "moment";

import AttendanceRecord from "./AttendanceRecord.vue";
import WorkReport from "./WorkReport.vue";

type ReactiveDataForPreview = {
  attendanceRecords: any[];
  projectWorkRecords: any[];
};

const reactiveDataForPreview: ReactiveDataForPreview = reactive({
  attendanceRecords: [],
  projectWorkRecords: [],
});

onMounted(async () => {
  await fetchAttendanceRecodes();
  await fetchProjectWorkHours();
});

const fetchAttendanceRecodes = async () => {
  const date = formatDate();

  // TODO PiniaからemployeeIdを取得する。
  const employeeId = "1000";
  let response;
  try {
    response = await axios.get(
      `http://localhost:8000/api/attendance?date=2024-01-16&employeeId=${employeeId}`
    );
  } catch (err) {
    window.alert(err);
  }

  const attendanceRecords: any[] = response?.data;
  reactiveDataForPreview.attendanceRecords.push(...attendanceRecords);
};

const formatDate = () => {
  // TODO "2024-01-16のような形式に整形する"
};

const fetchProjectWorkHours = async () => {
  const projectWorkHours = await axios.get();
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
    <div class="flex flex-col items-center">
      <div class="mb-8">
        <AttendanceRecord />
      </div>
      <div>
        <WorkReport />
      </div>
    </div>
  </div>

  <div>{{ reactiveDataForPreview.attendanceRecords[0]?.id }}</div>
</template>
