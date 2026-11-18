<script setup lang="ts">
import {
  today,
  getLocalTimeZone,
  DateFormatter,
  parseDate,
} from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

const route = useRoute();
const currentDate = computed(() => {
  const dateParam = (route.query.date as string) || "";
  if (dateParam) {
    return parseDate(dateParam);
  } else {
    return today(getLocalTimeZone());
  }
});
const dateString = computed(() => currentDate.value.toString());
const { data: items } = await useFetch("/api/items", {
  query: {
    date: dateString,
  },
  transform: (response) => response.data,
  deep: true,
});

const fullFormatter = new DateFormatter("en-US", { dateStyle: "full" });
const dateDisplay = computed(() => {
  if (currentDate.value) {
    return fullFormatter.format(currentDate.value.toDate());
  }
});

function getSortOrder(): number {
  let gNum = 0.0;
  if (items.value) {
    for (const i of items.value) {
      if (i.sortOrder > gNum) {
        gNum = i.sortOrder;
      }
    }
  }
  return gNum + 100.0;
}

function placeItemInList(item: Item) {
  if (items.value) {
    let index = null;
    for (let i = 0; i < items.value.length; i++) {
      const item = items.value[i];
      if (item?.complete === true) {
        index = i;
        break;
      }
    }
    if (index !== null) {
      items.value.splice(index, 0, item);
    } else {
      items.value.push(item);
    }
  }
}

const newItemInput = ref("");
async function addNewItem() {
  try {
    const res = await $fetch("/api/items", {
      method: "POST",
      body: {
        text: newItemInput.value,
        day: currentDate.value.toString(),
        sortOrder: getSortOrder(),
      },
    });
    if (items.value) {
      placeItemInList(res.data);
    }
    newItemInput.value = "";
  } catch (error) {
    console.error(error);
  }
}

function moveItemToEnd(index: number) {
  if (items.value) {
    const removedItem = items.value.splice(index, 1)[0];
    if (removedItem) {
      items.value.push(removedItem);
    }
  }
}

async function toggleComplete(
  newVal: boolean | string,
  id: number,
  index: number,
) {
  try {
    await $fetch(`/api/items/complete/${id}`, {
      method: "PATCH",
      body: null,
    });
    moveItemToEnd(index);
  } catch (error) {
    console.error(error);
    // revert check
    if (items.value && typeof newVal === "boolean") {
      items.value[index]!.complete = !newVal;
    }
  }
}
function testFunc() {
  if (items.value) {
    items.value[1]!.complete = false;
  }
}
</script>
<template>
  <UPageHeader :title="dateDisplay" headline="Calendar" />
  <div class="flex justify-between mt-4">
    <UButton icon="i-ri-arrow-left-line" variant="ghost"></UButton>
    <UButton icon="i-ri-arrow-right-line" variant="ghost"></UButton>
  </div>
  <div class="px-10 space-y-4 mt-4">
    <div v-for="(item, index) in items" :key="item.id">
      <UCheckbox
        size="xl"
        :label="item.text"
        v-model="items![index]!.complete"
        @update:model-value="(val) => toggleComplete(val, item.id, index)"
      ></UCheckbox>
    </div>
  </div>
  <div class="flex mt-4 justify-center space-x-2">
    <UInput
      v-model="newItemInput"
      placeholder="Add new..."
      @keyup.enter="addNewItem"
    />
    <UButton icon="i-ri-add-large-fill" variant="soft" @click="addNewItem" />
    <UButton @click="testFunc">Test</UButton>
  </div>
</template>
