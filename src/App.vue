<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import CombatTracker from './components/CombatTracker.vue'
import RandomCardGenerator from './components/RandomCardGenerator.vue'
import ThePlayer from './components/ThePlayer.vue'
import Export from './components/Export.vue'
import { isMobile } from './application/func'
</script>

<template>
  <head>
    <link href="./assets/output.css" rel="stylesheet" />
  </head>
  <div :class="[isMobile ? 'grid-container-mob' : 'grid-container']">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Enemies</Tab>
        <Tab value="1">Cards</Tab>
        <Tab value="2">Player</Tab>
        <Tab value="3">Export</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <CombatTracker></CombatTracker>
        </TabPanel>
        <TabPanel value="1"> <RandomCardGenerator></RandomCardGenerator></TabPanel>
        <TabPanel value="2"> <ThePlayer></ThePlayer></TabPanel>
        <TabPanel value="3"> <Export></Export></TabPanel>
      </TabPanels>
    </Tabs>
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
</style>
