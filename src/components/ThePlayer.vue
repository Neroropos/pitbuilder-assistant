<script setup lang="ts">
import { GetBackgrounds, GetHeritages } from '@/application/playerController'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import { ref } from 'vue'
const heritage = ref()
const element = ref()
const background = ref()
const heritages = GetHeritages()
const backgrounds = GetBackgrounds()
</script>
<template>
  <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block; width: 100%">
    <Select
      v-model="heritage"
      :options="heritages"
      option-label="Name"
      class="w-full md:w-56"
      inputId="heritageSelect"
      style="width: 100%"
    ></Select>
    <label for="heritageSelect">Heritage</label>
  </FloatLabel>
  <div v-if="heritage != null">
    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block; width: 100%">
      <Select
        v-model="element"
        :options="heritage.Elements"
        class="w-full md:w-56"
        inputId="elementSelect"
        style="width: 100%"
      ></Select>
      <label for="elementSelect">Element</label>
    </FloatLabel>
  </div>
  <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block; width: 100%">
    <Select
      v-model="background"
      :options="backgrounds"
      option-label="Name"
      class="w-full md:w-56"
      inputId="backgroundSelect"
      style="width: 100%"
    ></Select>
    <label for="backgroundSelect">Background</label>
  </FloatLabel>
</template>
