<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Enemy, EnemyArchetype, GetClassList, GetTemplateList } from '@/application/charMath'
import Multiselect from 'primevue/multiselect'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'
import { ref } from 'vue'
import { computed } from 'vue'

const enemyClasses = GetClassList()
const enemyArchetypes = ref([{ Name: 'None' }] as EnemyArchetype[])
console.log(enemyClasses)
const enemyTemplates = GetTemplateList()
const currentEnemy = ref(new Enemy())
const currHp = ref()
const currBlock = ref()
currBlock.value = 0
const currBarrier = ref()
currBarrier.value = 0
const dealDmg = ref()
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', modelValue.value)
  }
})
const turnTakenId = 'turnTaken' + modelValue.value.id
const isBloodied = ref()
isBloodied.value = false

function changedClass(ev: {}) {
  enemyArchetypes.value = currentEnemy.value.Class.Archetypes
  enemyArchetypes.value.push(new EnemyArchetype())
  // currentEnemy.value.Class.Archetypes.forEach((item) => {
  //   const arr = result.find((x) => x.Type == item.Type)
  //   if (arr) result.find((x) => x.Type == item.Type)?.Values.push(item)
  //   else {
  //     const newGroup = new GroupedClass({ Type: item.Type, Values: [item] })
  //     result.push(newGroup)
  //   }
  // })
  // result.forEach((gr) => {
  //   gr.Values.sort((a, b) => a.Name?.localeCompare(b.Name || '') || 0)
  // })
  // return result
  changed(ev)
}

function changed(ev: {}) {
  currentEnemy.value.update()
  modelValue.value.Challenge = currentEnemy.value.Challenge
  currHp.value = currentEnemy.value.HP
}

function hpChange() {
  let trueHP = 0
  const trueMaxHP = currentEnemy.value.HPBar * currentEnemy.value.HP
  if (currentEnemy.value.HPBar > 1) {
    const checks = document.querySelectorAll('[id^="HpBar"]') as NodeListOf<HTMLInputElement>
    checks.forEach((x) => {
      if (x.checked) {
        trueHP += currentEnemy.value.HP
      }
    })
    trueHP -= currentEnemy.value.HP
  }
  trueHP += currHp.value
  if (trueHP * 2 <= trueMaxHP && trueHP > 0) isBloodied.value = true
  else isBloodied.value = false
}
function damage() {
  let input = dealDmg.value
  if (!input) return
  if (input < 0) {
    currHp.value = currHp.value - input
    if (currHp.value > currentEnemy.value.HP) currHp.value = currentEnemy.value.HP
    return
  }
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
  hpChange()
}
</script>
<template>
  <div>Challenge: {{ currentEnemy.Challenge }}</div>
  <div class="row" style="display: inline-block">
    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block; width: 100%">
      <Select
        v-model="currentEnemy.Class"
        filter
        :options="enemyClasses"
        option-group-label="Type"
        option-group-children="Values"
        option-label="Name"
        class="w-full md:w-56"
        @change="changedClass($event)"
        inputId="classSelect"
        style="width: 100%"
      ></Select>
      <label for="classSelect">Class</label>
    </FloatLabel>

    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block; width: 100%">
      <Select
        v-model="currentEnemy.Archetype"
        filter
        :options="enemyArchetypes"
        option-label="Name"
        class="w-full md:w-80"
        @change="changed($event)"
        inputId="archetypeSelect"
        style="width: 100%"
      ></Select>
      <label for="archetypeSelect">Archetype</label>
    </FloatLabel>

    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block; width: 100%">
      <Multiselect
        v-model="currentEnemy.Templates"
        filter
        :options="enemyTemplates"
        option-group-label="Type"
        option-group-children="Values"
        option-label="Name"
        class="w-full md:w-80"
        @change="changed($event)"
        inputId="templateSelect"
        style="width: 100%"
      />
      <label for="templateSelect">Templates</label>
    </FloatLabel>
    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block; width: 100%">
      <Select
        v-model="currentEnemy.Tier"
        filter
        :options="[1, 2, 3]"
        class="w-full md:w-80"
        @change="changed($event)"
        inputId="tierSelect"
        style="width: 100%"
      ></Select>
      <label for="tierSelect">Tier</label>
    </FloatLabel>
  </div>
  <div>
    <div v-if="currentEnemy.HPBar > 1">
      <span
        v-for="cnt in currentEnemy.HPBar"
        :key="cnt"
        style="display: inline-block; width: 60px; font-size: 16px"
      >
        <input :id="'HpBar' + cnt" type="checkbox" checked @change="hpChange()" />
      </span>
    </div>
    <div id="HP">
      HP:
      <input
        v-model="currHp"
        type="number"
        style="width: 60px; font-size: 16px"
        placeholder="HP"
        @change="hpChange()"
      />
      /{{ currentEnemy.HP }}
    </div>
    <div id="BAR">
      BAR:
      <input
        v-model="currBarrier"
        type="number"
        style="width: 60px; font-size: 16px"
        placeholder="BAR"
      />
    </div>
    <div id="BAR">
      BLK:
      <input
        v-model="currBlock"
        type="number"
        style="width: 60px; font-size: 16px"
        placeholder="BLK"
      />
    </div>
    <div v-if="isBloodied" style="color: crimson">Bloodied</div>
    <div v-if="currHp <= 0" style="color: crimson">Defeated</div>
    <div class="row">
      <input
        v-model="dealDmg"
        type="number"
        style="width: 60px; font-size: 16px"
        placeholder="DMG"
      />
      <button @click="damage()">Deal damage</button>
    </div>
    <div>
      <div>Conditions</div>
      <textarea type="text" style="font-size: 16px"></textarea>
    </div>
    <div class="row">
      <label :for="turnTakenId">Turn taken?</label>
      <input :id="turnTakenId" type="checkbox" style="width: 60px; font-size: 16px" />
    </div>
  </div>
  <div>
    <div class="row">
      <div><span style="font-weight: bold">Strike</span> - {{ currentEnemy.Strike }}</div>
    </div>
    <div class="row">
      <div><span style="font-weight: bold">Defend</span> - {{ currentEnemy.Defend }}</div>
    </div>
    <div class="row">
      <div><span style="font-weight: bold">Maneuver</span> - {{ currentEnemy.Maneuver }}</div>
    </div>
  </div>
  <div>
    <h3>Actions</h3>
    <div v-for="act in currentEnemy.ActionsShown" :key="act.Name">
      <span style="font-weight: bold">{{ act.Name }}</span> - {{ act.Text }}
    </div>
    <div class="row">
      <div id="Damage">Basic damage: {{ currentEnemy.DmgMod }}</div>
    </div>
  </div>
  <div v-if="currentEnemy.PassivesShown.length > 0">
    <h3>Passives</h3>
    <div v-for="pass in currentEnemy.PassivesShown" :key="pass.Name">
      <span style="font-weight: bold">{{ pass.Name }}</span> - {{ pass.Text }}
    </div>
  </div>
  <div v-if="currentEnemy.ImmunitiesShown.length > 0">
    <span style="font-weight: bold">Immunities</span><br />
    {{ currentEnemy.ImmunitiesShown }}
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
