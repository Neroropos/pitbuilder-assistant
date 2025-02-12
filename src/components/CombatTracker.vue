<script setup lang="ts">
import { ref } from 'vue'
import Enemy from './Enemy.vue'
import { isMobile } from '../application/func'
const counter = ref([{ id: 1, Challenge: 0 }])
let rounds = ref(1)
let elements = ref([
  { name: 'air', value: false, icon: 'fa-solid fa-wind', onColor: 'lightGrey', color: '' },
  { name: 'dark', value: false, icon: 'pi pi-moon', onColor: 'black', color: '' },
  { name: 'earth', value: false, icon: 'fa-solid fa-mountain', onColor: 'brown', color: '' },
  { name: 'fire', value: false, icon: 'fa-solid fa-fire', onColor: 'red', color: '' },
  { name: 'ice', value: false, icon: 'fa-solid fa-snowflake', onColor: 'lightBlue', color: '' },
  { name: 'light', value: false, icon: 'pi pi-sun', onColor: 'yellow', color: '' },
  { name: 'lightning', value: false, icon: 'fa-solid fa-bolt', onColor: 'magenta', color: '' },
  { name: 'nature', value: false, icon: 'fa-solid fa-tree', onColor: 'green', color: '' },
  { name: 'water', value: false, icon: 'fa-solid fa-water', onColor: 'blue', color: '' }
])
function addEnemy() {
  let newId = 1
  if (counter.value.length > 0) newId = counter.value[counter.value.length - 1].id + 1
  counter.value.push({ id: newId, Challenge: 0 })
}
function close(id: number) {
  counter.value.splice(counter.value.map((item) => item.id).indexOf(id), 1)
}
function newRound() {
  const checks = document.querySelectorAll('[id^="turnTaken"]') as NodeListOf<HTMLInputElement>
  checks.forEach((x) => (x.checked = false))
  rounds.value++
}
function toggleElement(elementName: string) {
  var el = elements.value.find((x) => x.name == elementName)
  if (!el) return
  el.value = !el.value
  if (el.value) el.color = el.onColor
  else el.color = ''
}
function refresh() {
  rounds.value = 1
  elements.value.forEach((el) => {
    el.value = true
    toggleElement(el.name)
  })
}
</script>

<template>
  <head> </head>
  <div style="width: 100%">
    <button @click="newRound()" class="grid-item button">New round</button> Round {{ rounds }}
    <span @click="refresh()" class="clickable"><i class="pi pi-refresh"></i></span>
    <span v-for="element in elements" :key="element.name">
      <span
        @click="toggleElement(element.name)"
        class="clickable"
        :style="{ backgroundColor: element.color }"
        ><i :class="element.icon"></i
      ></span>
    </span>
  </div>

  <div :class="[isMobile ? 'grid-container-mob' : 'grid-container']">
    <div v-for="(item, index) in counter" :key="item.id" class="grid-item">
      <span style="float: left; padding-right: 8px">{{ item.id }}</span
      ><span @click="close(item.id)" class="close clickable"
        ><i class="pi pi-times-circle"></i></span
      ><Enemy v-model="counter[index]" />
    </div>
    <button @click="addEnemy()" class="grid-item button">Add</button>
  </div>
  <span>
    Total Challenge: {{ counter.reduce((sum, current) => sum + current.Challenge || 0, 0) }}
  </span>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  background-color: #2196f3;
  padding: 10px;
}
.grid-container-mob {
  display: grid;
  grid-template-columns: auto;
  background-color: #2196f3;
  padding: 10px;
}
.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 20px;
  font-size: 16px;
  text-align: center;
}
.close {
  float: right;
}
.close:hover {
  float: right;
}
</style>
