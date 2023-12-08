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

onMounted(async () => {
  const projectList = await fetchProjectList();
  getCalendar();
  pushReactiveProjectIdAndNameList(projectList);
  pushReactiveProjectList(projectList);
  getWindowSize();
  window.addEventListener("resize", getWindowSize);
});

const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
const getDays = (year: number, month: string, block_number: number) => {
  let days = [];
  let date = moment(`${year}-${month}-016`);
  let num = date.daysInMonth();
  for (let i = 0; i < num; i++) {
    days.push({
      year: date.year(),
      month: date.month() + 1,
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

type Project = {
  projectId: string;
  projectName: string;
  workDate: string;
  workHours?: number;
  totalHours?: number;
  year?: number;
  month?: number;
  day?: number;
};

// APIでサーバから取得した仮のプロジェクトリスト
const fetchProjectList = async () => {
  const response: Array<Project> = [
    {
      projectId: "111",
      projectName: "Androidカメラアプリ開発",
      workDate: "2024-03-05T06:09:03.789Z",
      workHours: 1,
    },
    {
      projectId: "222",
      projectName: "iPhoneカメラアプリ開発",
      workDate: "2024-03-05T06:09:03.789Z",
      workHours: 3,
    },
    {
      projectId: "333",
      projectName: "PCカメラアプリ開発",
      workDate: "2024-03-05T06:09:03.789Z",
      workHours: 4,
    },
    {
      projectId: "222",
      projectName: "iPhoneカメラアプリ開発",
      workDate: "2024-03-06T06:09:03.789Z",
      workHours: 3,
    },
    {
      projectId: "333",
      projectName: "PCカメラアプリ開発",
      workDate: "2024-03-06T06:09:03.789Z",
      workHours: 4,
    },
    {
      projectId: "444",
      projectName: "PCゲーム開発",
      workDate: "2024-03-06T06:09:03.789Z",
      workHours: 4,
    },
    {
      projectId: "555",
      projectName: "PCアプリ開発",
      workDate: "2024-03-05T06:09:03.789Z",
      workHours: 4,
    },
    {
      projectId: "555",
      projectName: "PCアプリ開発",
      workDate: "2024-03-07T06:09:03.789Z",
      workHours: 4,
    },
    {
      projectId: "666",
      projectName: "PCアプリテスト",
      workDate: "2024-02-16T06:09:03.789Z",
      workHours: 4,
    },
    {
      projectId: "666",
      projectName: "PCアプリテスト",
      workDate: "2024-02-17T06:09:03.789Z",
      workHours: 4,
    },
  ];

  return response;
};

// APIでサーバから取得した仮データここまで
const reactiveProjectList: Array<Project> = reactive([]);
const pushReactiveProjectList = (projectList: Array<Project>) => {
  const projectListWithOptionalProperties: Array<Project> = projectList.map(
    (project) => ({
      projectId: project.projectId,
      projectName: project.projectName,
      workDate: project.workDate,
      workHours: project.workHours,
      year: moment(project.workDate).year(),
      month: moment(project.workDate).month() + 1,
      day: moment(project.workDate).date(),
    })
  );

  reactiveProjectList.push(...projectListWithOptionalProperties);
  pushDailyTotalHoursList(projectListWithOptionalProperties);
};

const pushDailyTotalHoursList = (projectList: Array<Project>) => {
  const groupedByDate: Array<Project> = projectList.reduce((acc, project) => {
    const existingDateEntry = acc.find((entry) => {
      return (
        `${entry.year}:${entry.month}:${entry.day}` ===
        `${project.year}:${project.month}:${project.day}`
      );
    });

    if (existingDateEntry) {
      existingDateEntry.totalHours += project.workHours;
    } else {
      acc.push({
        projectId: "",
        projectName: "日付合計",
        workDate: project.workDate,
        totalHours: project.workHours,
        year: project.year,
        month: project.month,
        day: project.day,
      });
    }

    return acc;
  }, []);

  reactiveProjectList.push(...groupedByDate);
};

const reactiveProjectUniqueList: Array<{
  projectId: string;
  projectName: string;
  totalHours?: number;
  grandTotalHours?: number;
}> = reactive([]);
const pushReactiveProjectIdAndNameList = (projectList: Array<Project>) => {
  const projectWithTotalHours: Array<{
    projectId: string;
    projectName: string;
    totalHours: number;
  }> = projectList.reduce((acc, project) => {
    const existingProject: { projectId: string; totalHours: number } = acc.find(
      (p) => p.projectId === project.projectId
    );

    if (existingProject) {
      existingProject.totalHours += project.workHours;
    } else {
      acc.push({
        projectId: project.projectId,
        projectName: project.projectName,
        totalHours: project.workHours,
      });
    }

    return acc;
  }, []);

  reactiveProjectUniqueList.push(...projectWithTotalHours);
  pushDailyTotal(projectWithTotalHours);
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
  reactiveProjectUniqueList.push({
    projectId: "",
    projectName: "日毎合計",
    grandTotalHours,
  });
};

const getWindowSize = () => {
  data.inner_width = window.innerWidth;
  data.inner_height = window.innerHeight;
};
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
          v-for="{ projectId } in reactiveProjectUniqueList"
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
          v-for="{ projectId, projectName } in reactiveProjectUniqueList"
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
            v-for="(dayObj, index) in data.calendars.days"
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
          v-for="{ projectId } in reactiveProjectUniqueList"
          v-bind:key="projectId"
          class="h-8"
        >
          <td
            v-for="(dayObj, index) in data.calendars.days"
            v-bind:key="index"
            class="text-center border"
          >
            <template
              v-for="projectList in reactiveProjectList"
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
          } in reactiveProjectUniqueList"
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
