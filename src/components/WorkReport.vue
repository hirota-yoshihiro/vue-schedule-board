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
let projectIdList: Array<string> = reactive([]);
let projectNameList: Array<string> = reactive([]);
let cumulativeTotal: Array<{}> = reactive({});

type Project = {
  projectId: string;
  projectName: string;
  workDate: string;
  workHours: number;
};
const projectList: Array<Project> = reactive([]);

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

const getWindowSize = () => {
  data.inner_width = window.innerWidth;
  data.inner_height = window.innerHeight;
};

const fetchProjectList = async () => {
  const response: Array<Project> = [
    {
      projectId: "111",
      projectName: "Androidカメラアプリ開発",
      workDate: "2023-12-05T06:09:03.789Z",
      workHours: 1,
    },
    {
      projectId: "222",
      projectName: "iPhoneカメラアプリ開発",
      workDate: "2023-12-05T06:09:03.789Z",
      workHours: 3,
    },
    {
      projectId: "333",
      projectName: "PCカメラアプリ開発",
      workDate: "2023-12-05T06:09:03.789Z",
      workHours: 4,
    },
    {
      projectId: "222",
      projectName: "iPhoneカメラアプリ開発",
      workDate: "2023-12-05T06:09:03.789Z",
      workHours: 3,
    },
    {
      projectId: "333",
      projectName: "PCカメラアプリ開発",
      workDate: "2023-12-05T06:09:03.789Z",
      workHours: 4,
    },
  ];

  return response;
};

const pushProjectIdList = (projectList: Array<Project>) => {
  const unorganizedProjectIdList = projectList.map(
    (project) => project.projectId
  );
  const uniqueControlNumberList = [...new Set(unorganizedProjectIdList)];
  projectIdList = Array.from(uniqueControlNumberList);
};

const pushProjectNameList = (projectList: Array<Project>) => {
  const unorganizedProjectNameList = projectList.map(
    (project) => project.projectName
  );
  const uniqueProjectNameList = [...new Set(unorganizedProjectNameList)];
  projectNameList = Array.from(uniqueProjectNameList);
};

const calcCumulativeTotal = () => {
  // for (let i = 0; i < attendanceRecords.length; i++) {
  //   cumulativeTotal.overTime += attendanceRecords[i].overTime;
  //   cumulativeTotal.lateNightOverTime += attendanceRecords[i].lateNightOverTime;
  //   cumulativeTotal.holidayWorkTime += attendanceRecords[i].holidayWorkTime;
  //   cumulativeTotal.absenteeism += attendanceRecords[i].absenteeism;
  //   cumulativeTotal.publicHolidayTime += attendanceRecords[i].publicHolidayTime;
  // }
};

onMounted(async () => {
  const projectList = await fetchProjectList();
  pushProjectIdList(projectList);
  pushProjectNameList(projectList);
  // pushProjectNameList(projectList);
  // calcCumulativeTotal();
  // getCalendar();
  // getWindowSize();
  // window.addEventListener("resize", getWindowSize);
});
</script>

<template></template>
