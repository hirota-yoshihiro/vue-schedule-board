<script setup lang="ts">
import { reactive, onMounted, watch } from "vue";
import moment from "moment";

import { getCalendar } from "../libs/calendar.ts";
import { caluCurrentMonthly, getDayInUTC } from "../libs/date.ts";
import { getWindowSize } from "../libs/functions";

const { projectWorkHourRecords } = defineProps(["projectWorkHourRecords"]);

onMounted(async () => {
  init();
});

const init = () => {
  getCalendar(reactiveData);

  getWindowSize(reactiveData);
  window.addEventListener("resize", getWindowSize);
};

watch(projectWorkHourRecords, () => {
  const projectWithTotalHours = pushReactiveProjectUniqueList(
    projectWorkHourRecords
  );
  pushDailyTotal(projectWithTotalHours);

  // pushReactiveProjectList(projectWorkHourRecords);
});

type ProjectWorkHours = {
  employeeId: string;
  id: number;
  project: {
    id: string;
    name: string;
    type: string;
  };
  projectId: string;
  workDate: Date;
  workHours: number;
};

type ReactiveData = {
  start_month: string;
  end_month: string;
  calendars: {};
  inner_width: number;
  inner_height: number;
  projectList: Project[];
  projectUniqueList: {
    projectId: string;
    projectName: string;
    totalHours?: number;
    grandTotalHours?: number;
  }[];
};

const reactiveData: ReactiveData = reactive({
  start_month: caluCurrentMonthly(),
  end_month: caluCurrentMonthly(),
  calendars: {},
  inner_width: 0,
  inner_height: 0,
  projectList: [],
  projectUniqueList: [],
});

const pushReactiveProjectUniqueList = (
  projectWorkHourRecords: Array<ProjectWorkHours>
) => {
  const projectWithTotalHours: Array<{
    projectId: string;
    projectName: string;
    totalHours: number;
  }> = projectWorkHourRecords.reduce((acc, projectList) => {
    const existingProject: {
      projectId: string;
      totalHours: number;
      projectName: string;
    } = acc.find((ele) => ele.projectId === projectList.projectId);
    if (existingProject) {
      existingProject.totalHours += projectList.workHours;
    } else {
      acc.push({
        projectId: projectList.projectId,
        projectName: projectList.project.name,
        totalHours: projectList.workHours,
      });
    }
    return acc;
  }, []);

  reactiveData.projectUniqueList.push(...projectWithTotalHours);

  return projectWithTotalHours;
};

const pushDailyTotal = (
  projectUniqueList: Array<{
    projectId: string;
    projectName: string;
    totalHours?: number;
    grandTotalHours?: number;
  }>
) => {
  let grandTotalHours = 0;
  for (let i = 0; i < projectUniqueList.length; i++) {
    grandTotalHours += projectUniqueList[i].totalHours!;
  }

  reactiveData.projectUniqueList.push({
    projectId: "",
    projectName: "日毎合計",
    grandTotalHours,
  });
};

// const pushReactiveProjectUniqueList = (
//   projectWorkHourRecords: Array<ProjectWorkHours>
// ) => {
//   const copyProjectWorkHourRecords = [...projectWorkHourRecords];

//   const projectWithTotalHours: Array<{
//     projectId: string;
//     projectName: string;
//     totalHours: number;
//   }> = projectWorkHourRecords.reduce((acc, projectList) => {
//     const existingProject: {
//       projectId: string;
//       totalHours: number;
//       projectName: string;
//     } = acc.find((ele) => ele.projectId === projectList.projectId);
//     if (existingProject) {
//       existingProject.totalHours += Number(projectList.workHours);
//     } else {
//       acc.push({
//         projectId: projectList.projectId,
//         projectName: projectList.project.name,
//         totalHours: projectList.workHours,
//       });
//     }
//     return acc;
//   }, []);

//   reactiveData.projectUniqueList.push(...projectWithTotalHours);

//   console.log(reactiveData);
//   return projectWithTotalHours;
// };

// type Project = {
//   projectId: string;
//   projectName: string;
//   workDate: string;
//   workHours?: number;
//   totalHours?: number;
//   year?: number;
//   month?: number;
//   day?: number;
// };

// const pushReactiveProjectList = (projectList: Array<Project>) => {
//   const projectListWithOptionalProperties: Array<Project> = projectList.map(
//     (project) => ({
//       projectId: project.projectId,
//       projectName: project.projectName,
//       workDate: project.workDate,
//       workHours: project.workHours,
//       year: moment(project.workDate).year(),
//       month: moment(project.workDate).month() + 1,
//       day: moment(project.workDate).date(),
//     })
//   );
//   reactiveData.projectList.push(...projectListWithOptionalProperties);
//   pushDailyTotalHoursList(projectListWithOptionalProperties);
// };

// const pushDailyTotalHoursList = (projectList: Array<Project>) => {
//   const groupedByDate: Array<Project> = projectList.reduce((acc, project) => {
//     const existingDateEntry = acc.find((entry) => {
//       return (
//         `${entry.year}:${entry.month}:${entry.day}` ===
//         `${project.year}:${project.month}:${project.day}`
//       );
//     });

//     if (existingDateEntry) {
//       existingDateEntry.totalHours += project.workHours;
//     } else {
//       acc.push({
//         projectId: "",
//         projectName: "日付合計",
//         workDate: project.workDate,
//         totalHours: project.workHours,
//         year: project.year,
//         month: project.month,
//         day: project.day,
//       });
//     }

//     return acc;
//   }, []);

//   reactiveData.projectList.push(...groupedByDate);
// };
</script>

<template>
  <table class="flex border-r border-l">
    <!-- プロジェクト管理No. -->
    <div class="border-r">
      <thead>
        <tr>
          <th class="h-8 w-12 bg-green-600 font-bold text-sm text-white">
            No.
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="{ projectId } in reactiveData.projectUniqueList"
          v-bind:key="projectId"
          class="flex flex-col"
        >
          <td
            class="flex justify-center items-center w-full font-bold text-sm h-8 border-b"
          >
            {{ projectId }}
          </td>
        </tr>
      </tbody>
    </div>

    <!-- プロジェクト管理No. ここまで -->

    <!-- プロジェクト名 -->
    <div class="border-r border-l">
      <thead>
        <tr>
          <th class="h-8 w-48 bg-green-600 font-bold text-sm text-white">
            プロジェクト名
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="{ projectId, projectName } in reactiveData.projectUniqueList"
          v-bind:key="projectId"
          class="flex flex-col"
        >
          <td
            class="flex justify-center items-center w-full font-bold text-sm h-8 border-b"
          >
            {{ projectName }}
          </td>
        </tr>
      </tbody>
    </div>
    <!-- プロジェクト名 ここまで -->

    <!-- 出勤カレンダー -->
    <div class="overflow-x-scroll border-r border-l border-t">
      <thead>
        <tr>
          <th
            v-for="(dayObj, index) in reactiveData.calendars.days"
            v-bind:key="index"
            class="h-8 w-8 font-bold border-r border-b"
            v-bind:class="
              dayObj.dayOfWeek === '土' || dayObj.dayOfWeek === '日'
                ? 'text-red-800'
                : ''
            "
          >
            {{ dayObj.day }}
          </th>
        </tr>
      </thead>

      <!-- APIから取得したデータを表示 -->
      <tbody>
        <tr
          v-for="{ projectId } in reactiveData.projectUniqueList"
          v-bind:key="projectId"
          class="h-8"
        >
          <td
            v-for="(dayObj, index) in reactiveData.calendars.days"
            v-bind:key="index"
            class="text-center border"
          >
            <template
              v-for="projectList in reactiveData.projectList"
              v-bind:key="projectId"
            >
              <template
                v-if="
                  projectList.projectId === projectId &&
                  `${dayObj.year}:${dayObj.month}:${dayObj.day}` ===
                    `${projectList.year}:${projectList.month}:${projectList.day}`
                "
              >
                {{
                  projectList.workHours
                    ? projectList.workHours?.toFixed(1)
                    : projectList.totalHours?.toFixed(1)
                }}
              </template>
            </template>
          </td>
        </tr>
      </tbody>
    </div>

    <!-- 出勤カレンダーここまで -->

    <!-- 累計 -->
    <div class="border-r border-l">
      <thead>
        <tr>
          <th class="h-8 w-24 bg-green-600 font-bold text-sm text-white">
            累計
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="{
            projectId,
            totalHours,
            grandTotalHours,
          } in reactiveData.projectUniqueList"
          class="flex justify-center items-center h-8 border-b"
          v-bind:key="projectId"
        >
          <td>
            {{
              totalHours ? totalHours.toFixed(1) : grandTotalHours?.toFixed(1)
            }}&nbsp;時間
          </td>
        </tr>
      </tbody>
    </div>
    <!-- 累計ここまで -->
  </table>
</template>
