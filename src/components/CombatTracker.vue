<script setup lang="ts">
import { ref } from 'vue'
import Enemy from './Enemy.vue'
import { isMobile } from '../application/func'
const counter = ref([{ id: 1 }])
let rounds = ref(1)
function addEnemy() {
  let newId = 0
  if (counter.value.length > 0) newId = counter.value[counter.value.length - 1].id + 1
  counter.value.push({ id: newId })
}
function close(id: number) {
  counter.value.splice(counter.value.map((item) => item.id).indexOf(id), 1)
}
function newRound() {
  const checks = document.querySelectorAll('[id^="turnTaken"]') as NodeListOf<HTMLInputElement>
  checks.forEach((x) => (x.checked = false))
  rounds.value++
}
</script>

<template>
  <head>
    <link href="./assets/output.css" rel="stylesheet" />
  </head>
  <div>
    <button @click="newRound()" class="grid-item button">New round</button> Round {{ rounds }}
    <span @click="rounds = 1" class="clickable"><i class="pi pi-refresh"></i></span>
  </div>

  <div :class="[isMobile ? 'grid-container-mob' : 'grid-container']">
    <div v-for="item in counter" :key="item.id" class="grid-item">
      <span @click="close(item.id)" class="close clickable"><i class="pi pi-times-circle"></i></span
      ><Enemy :id="item.id" />
    </div>
    <button @click="addEnemy()" class="grid-item button">Add</button>
  </div>
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
.clickable {
  display: inline-block;
  padding: 2px 5px;
  /* border-style: solid;
  border-width: thin; */
  /* width: 15px;
  height: 15px; */
  font-size: 16px;
  /* background: #dadae6; */
}

.clickable:hover {
  display: inline-block;
  padding: 2px 5px;
  /* background: #515064; */
  color: #fff;
  cursor: pointer;
}
.button {
  cursor: pointer;
}
</style>
