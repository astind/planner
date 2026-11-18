<script setup lang="ts">
import Navbar from "~/components/navbar.vue";

definePageMeta({
  middleware: ["authenticated"],
});
</script>

<template>
  <UMain>
    <Navbar />
    <UContainer>
      <NuxtPage />
    </UContainer>
  </UMain>
</template>
