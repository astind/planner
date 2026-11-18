<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
const { clear: clearSession } = useUserSession();

const calendarOpen = ref(false);
async function handleDateChange(date: DateValue | undefined) {
  if (date) {
    await navigateTo({
      path: "/plan/calendar",
      query: {
        date: date.toString(),
      },
    });
    calendarOpen.value = false;
  }
}

async function logout() {
  await clearSession();
  await navigateTo("/login");
}
</script>
<template>
  <UHeader :toggle="false" title="Planner">
    <template #right>
      <UPopover v-model:open="calendarOpen">
        <UButton
          icon="i-mdi-calendar-month-outline"
          variant="ghost"
          color="neutral"
        ></UButton>
        <template #content>
          <UCalendar @update:modelValue="handleDateChange" />
        </template>
      </UPopover>
      <UPopover>
        <UButton
          icon="i-mdi-list-box-outline"
          variant="ghost"
          color="neutral"
        ></UButton>
        <template #content>
          <Placeholder class="size-48 m-4 inline-flex" />
        </template>
      </UPopover>
      <UColorModeButton />
      <UButton
        icon="i-mdi-logout"
        color="error"
        variant="ghost"
        @click="logout()"
      ></UButton>
    </template>
  </UHeader>
</template>
