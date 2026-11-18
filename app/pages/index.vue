<script setup lang="ts">
const { loggedIn } = useUserSession();
if (loggedIn.value) {
  await navigateTo("/plan/calendar");
} else {
  await navigateTo("/login");
}
</script>

<template></template>
