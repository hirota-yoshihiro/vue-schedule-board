<script setup lang="ts">
import { reactive, onMounted } from "vue";

onMounted(async () => {
  await init();
});

const init = async () => {
  fetchReactiveData();
};
// Piniaに保存してある従業員情報のデータを取得し、reactiveDataに反映させる。
const fetchReactiveData = () => {};

type ReactiveData = {
  employee: {
    branch: string;
    department: string;
    section: string;
    id: string;
  };
};

const reactiveData: ReactiveData = reactive({
  employee: {
    branch: "",
    department: "",
    section: "",
    id: "",
  },
});
</script>

<template>
  <!-- 従業員情報 -->
  <div class="flex justify-end w-full">
    <div class="w-80 border-4 border-blue-200">
      <div class="flex">
        <p class="w-36 text-center border-r-2 border-b-2 border-blue-200">
          所属事業所
        </p>
        <p class="w-full border-l-2 border-b-2 border-blue-200">
          {{ reactiveData.employee.branch }}
        </p>
      </div>
      <div class="flex">
        <p class="w-36 text-center border-r-2 border-b-2 border-blue-200">
          所属部署
        </p>
        <p class="w-full border-l-2 border-b-2 border-blue-200">
          {{ reactiveData.employee.department }}
        </p>
      </div>
      <div class="flex">
        <p class="w-36 text-center border-r-2 border-b-2 border-blue-200">
          所属室/課
        </p>
        <p class="w-full border-l-2 border-b-2 border-blue-200">
          {{ reactiveData.employee.section }}
        </p>
      </div>
      <div class="flex">
        <p class="w-36 text-center border-r-2 border-b-2 border-blue-200">
          社員番号
        </p>
        <p class="w-full border-l-2 border-b-2 border-blue-200">
          {{ reactiveData.employee.id }}
        </p>
      </div>
    </div>
  </div>
  <!-- 従業員情報ここまで -->
</template>
