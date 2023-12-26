<script setup lang="ts">
import { reactive, onMounted } from "vue";
import axios from "axios";
import moment from "moment";

import AttendanceRecord from "./AttendanceRecord.vue";
import WorkReport from "./WorkReport.vue";
import { calcDuringMonth, formatCurrentDate } from "../libs/date";
import EmployeeInfomation from "./EmployeeInfomation.vue";

onMounted(async () => {
  await init();
});

const init = async () => {
  const currentDate = formatCurrentDate();
  pushCurrentMonthly(currentDate);

  // TODO PiniaからemployeeUserIdを取得する。
  const employeeUserId = "1234";

  const employee = await fetchEmployee(employeeUserId);
  pushReactiveEmployee(employee);

  const employeeId = getEmployeeId(employee);
  const attendanceRecords: any[] = await fetchAttendanceRecodes(
    currentDate,
    employeeId
  );
  pushReactiveAttendanceRecords(attendanceRecords);

  const projectWorkHourRecords: any[] = await fetchProjectWorkHourRecords(
    currentDate,
    employeeId
  );
  pushReactiveProjectWorkHourRecords(projectWorkHourRecords);
};

type Employee = {
  id: string;
  branch: string;
  department: string;
  firstName: string;
  lastName: string;
  section: string;
};

type ReactiveData = {
  employee: Employee;
  currentMonthly: { year: number | null; month: number | null };
  attendanceRecords: any[];
  projectWorkRecords: any[];
};

const reactiveData: ReactiveData = reactive({
  employee: {
    id: "",
    branch: "",
    department: "",
    firstName: "",
    lastName: "",
    section: "",
  },
  currentMonthly: { year: null, month: null },
  attendanceRecords: [],
  projectWorkRecords: [],
});

const pushCurrentMonthly = (date: string) => {
  const { startDate } = calcDuringMonth(date);
  const year = moment(startDate).year() as number;
  const month = (moment(startDate).month() + 1) as number;
  reactiveData.currentMonthly.year = year;
  reactiveData.currentMonthly.month = month;
};

const fetchEmployee = async (employeeUserId: string) => {
  let response;

  try {
    response = await axios.get(
      `http://localhost:8000/api/auth/employee/exist?employeeUserId=${employeeUserId}`
    );
  } catch (err) {
    window.alert(err);
  }

  const employee: Employee = response?.data;
  return employee;
};

const pushReactiveEmployee = (employee: any) => {
  reactiveData.employee.id = employee.id;
  reactiveData.employee.branch = employee.branch;
  reactiveData.employee.department = employee.department;
  reactiveData.employee.firstName = employee.firstName;
  reactiveData.employee.lastName = employee.lastName;
  reactiveData.employee.section = employee.section;
};

const getEmployeeId = (employee: Employee) => {
  return employee.id;
};

const fetchAttendanceRecodes = async (
  currentDate: string,
  employeeId: string
) => {
  let response;

  try {
    response = await axios.get(
      `http://localhost:8000/api/attendance?date=${currentDate}&employeeId=${employeeId}`
    );
  } catch (err) {
    window.alert(err);
  }

  return response?.data;
};

const pushReactiveAttendanceRecords = (attendanceRecords: any[]) => {
  reactiveData.attendanceRecords.push(...attendanceRecords);
};

const fetchProjectWorkHourRecords = async (
  currentDate: string,
  employeeId: string
) => {
  let response;

  try {
    response = await axios.get(
      `http://localhost:8000/api/project_work_hours?date=${currentDate}&employeeId=${employeeId}`
    );
  } catch (err) {
    window.alert(err);
  }

  return response?.data;
};

const pushReactiveProjectWorkHourRecords = (projectWorkHours: any[]) => {
  reactiveData.projectWorkRecords.push(...projectWorkHours);
};
</script>

<template>
  <div class="flex flex-col">
    <EmployeeInfomation />

    <h1 class="mb-8 font-bold text-2xl underline text-center">
      出勤簿 兼 作業報告書
    </h1>
    <div class="flex justify-around">
      <span class="mb-8 text-center text-xl"
        >{{ reactiveData.currentMonthly.year }}年
        {{ reactiveData.currentMonthly.month }}月度</span
      >
      <span class="mb-8 text-center text-2xl underline"
        >氏名 {{ reactiveData.employee.firstName }}
        {{ reactiveData.employee.lastName }}</span
      >
    </div>
    <div class="flex flex-col items-center">
      <div class="mb-8">
        <AttendanceRecord
          :attendance-records="reactiveData.attendanceRecords"
        />
      </div>
      <div>
        <WorkReport
          :project-work-hour-records="reactiveData.projectWorkRecords"
        />
      </div>
    </div>
  </div>
</template>
