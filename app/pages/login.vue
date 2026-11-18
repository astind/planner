<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession();
if (loggedIn.value) {
  await navigateTo("/");
}
const credentials = reactive({
  username: "",
  password: "",
});
async function login(register: boolean) {
  let url = "/api";
  if (register) {
    url += "/register";
  } else {
    url += "/login";
  }
  try {
    await $fetch(url, {
      method: "POST",
      body: credentials,
    });
    // Refresh the session on client-side and redirect to the home page
    await refreshSession();
    await navigateTo("/");
  } catch {
    alert("Bad credentials");
  }
}
</script>

<template>
  <UMain>
    <UContainer class="mt-28">
      <UCard
        title="Planner Login"
        description="Please login to start using the planner"
      >
        <fieldset class="space-y-4">
          <UInput
            v-model="credentials.username"
            type="username"
            placeholder="Username"
          />
          <UInput
            v-model="credentials.password"
            type="password"
            placeholder="Password"
          />
        </fieldset>

        <template #footer>
          <div class="flex flex-col space-y-2">
            <UButton class="justify-center" @click="login(false)"
              >Login</UButton
            >
            <UButton
              class="justify-center"
              color="secondary"
              @click="login(true)"
              >Register</UButton
            >
          </div>
        </template>
      </UCard>
    </UContainer>
  </UMain>
</template>
