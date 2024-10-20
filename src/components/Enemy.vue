<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Enemy, GetClassList, GetTemplateList } from '@/application/charMath'
import Multiselect from 'primevue/multiselect'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'
import { ref } from 'vue'
const enemyClasses = GetClassList()
const enemyTemplates = GetTemplateList()
const currentEnemy = ref(new Enemy())
const currHp = ref()
const currBlock = ref()
currBlock.value = 0
const currBarrier = ref()
currBarrier.value = 0
const dealDmg = ref()
const props = defineProps(['id'])
const turnTakenId = 'turnTaken' + props.id
function changed(ev: {}) {
  currentEnemy.value.update()
  currHp.value = currentEnemy.value.HP
}
function damage() {
  let input = dealDmg.value
  if (!input) return
  if (currBlock.value > input) {
    currBlock.value = currBlock.value - input
    return
  } else {
    input = input - currBlock.value
    currBlock.value = 0
  }
  if (currBarrier.value > input) {
    currBarrier.value = currBarrier.value - input
    return
  } else {
    input = input - currBarrier.value
    currBarrier.value = 0
  }
  currHp.value = currHp.value - input
  if (currentEnemy.value.HPBar > 1 && currHp.value <= 0) {
    const checks = document.querySelectorAll('[id^="HpBar"]') as NodeListOf<HTMLInputElement>
    let uncheckThis = -1
    checks.forEach((x, index) => {
      if (x.checked) uncheckThis = index
    })
    if (uncheckThis >= 0) checks[uncheckThis].checked = false
    if (checks[0].checked) currHp.value = currentEnemy.value.HP + currHp.value
  }
}
</script>
<template>
  <div class="row" style="display: inline-block">
    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block">
      <Select
        v-model="currentEnemy.Class"
        filter
        :options="enemyClasses"
        option-group-label="Type"
        option-group-children="Values"
        option-label="Name"
        class="w-full md:w-56"
        @change="changed($event)"
        inputId="classSelect"
      ></Select>
      <label for="classSelect">Class</label>
    </FloatLabel>

    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block">
      <Multiselect
        v-model="currentEnemy.Templates"
        filter
        :options="enemyTemplates"
        option-label="Name"
        class="w-full md:w-80"
        @change="changed($event)"
        inputId="templateSelect"
      />
      <label for="templateSelect">Templates</label>
    </FloatLabel>
    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block">
      <Select
        v-model="currentEnemy.Tier"
        filter
        :options="[1, 2, 3]"
        class="w-full md:w-80"
        @change="changed($event)"
        inputId="tierSelect"
      ></Select>
      <label for="tierSelect">Tier</label>
    </FloatLabel>
  </div>
  <div class="row">
    <div v-if="currentEnemy.HPBar > 1" style="display: inline-block" class="row">
      <div
        v-for="cnt in currentEnemy.HPBar"
        :key="cnt"
        style="display: inline-block; width: 60px; font-size: 16px"
      >
        <input :id="'HpBar' + cnt" type="checkbox" checked />
      </div>
    </div>
    <div id="HP" style="display: inline-block">HP: {{ currentEnemy.HP }}/</div>
    <input
      v-model="currHp"
      type="number"
      style="display: inline-block; width: 60px; font-size: 16px"
      placeholder="HP"
    />
    <input
      v-model="currBarrier"
      type="number"
      style="display: inline-block; width: 60px; font-size: 16px"
      placeholder="BAR"
    />
    <input
      v-model="currBlock"
      type="number"
      style="display: inline-block; width: 60px; font-size: 16px"
      placeholder="BLK"
    />
    <div
      v-if="currHp <= currentEnemy.HP / 2 && currHp > 0"
      style="display: inline-block; color: crimson"
    >
      Bloodied
    </div>
    <div v-if="currHp <= 0" style="display: inline-block; color: crimson">Defeated</div>
    <div class="row">
      <input
        v-model="dealDmg"
        type="number"
        style="display: inline-block; width: 60px; font-size: 16px"
        placeholder="DMG"
      />
      <button style="display: inline-block" @click="damage()">Deal damage</button>
    </div>
    <div>
      <div>Conditions</div>
      <textarea type="text" style="display: inline-block; font-size: 16px"></textarea>
    </div>
    <div class="row">
      <label :for="turnTakenId" style="display: inline-block">Turn taken?</label>
      <input
        :id="turnTakenId"
        type="checkbox"
        style="display: inline-block; width: 60px; font-size: 16px"
      />
    </div>
  </div>
  <div>
    <h3>Actions</h3>
    <div v-for="act in currentEnemy.ActionsShown" :key="act.Name">
      <span style="font-weight: bold">{{ act.Name }}</span> - {{ act.Text }}
    </div>
    <div class="row">
      <div id="Damage" style="display: inline-block">Basic damage: {{ currentEnemy.DmgMod }}</div>
    </div>
  </div>
  <div v-if="currentEnemy.PassivesShown.length > 0">
    <h3>Passives</h3>
    <div v-for="pass in currentEnemy.PassivesShown" :key="pass.Name">
      <span style="font-weight: bold">{{ pass.Name }}</span> - {{ pass.Text }}
    </div>
  </div>
  <div v-if="currentEnemy.ResistancesShown.length > 0">
    <span style="font-weight: bold">Resistances</span><br />
    {{ currentEnemy.ResistancesShown }}
  </div>
  <div v-if="currentEnemy.WeaknessesShown.length > 0">
    <span style="font-weight: bold">Weaknesses</span><br />
    {{ currentEnemy.WeaknessesShown }}
  </div>
</template>
