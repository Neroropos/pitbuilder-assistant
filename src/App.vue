<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import CombatTracker from './components/CombatTracker.vue'
import RandomCardGenerator from './components/RandomCardGenerator.vue'
import ThePlayer from './components/ThePlayer.vue'
</script>

<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Enemies</Tab>
      <Tab value="1">Cards</Tab>
      <Tab value="2">Player</Tab>
    </TabList>

    <TabPanels>
      <TabPanel value="0">
        <CombatTracker></CombatTracker>
      </TabPanel>
      <TabPanel value="1"> <RandomCardGenerator></RandomCardGenerator></TabPanel>
      <TabPanel value="2"> <ThePlayer></ThePlayer></TabPanel>
    </TabPanels>
  </Tabs>
</template>
