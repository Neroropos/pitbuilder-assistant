<!-- eslint-disable vue/require-v-for-key -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Enemy, GetClassListForPrint, GetTemplateListForPrint } from '@/application/charMath'
import { ref } from 'vue'

const enemyClassesPR = GetClassListForPrint()
const enemyTemplatesPR = GetTemplateListForPrint()
</script>
<template>
  <div>
    <h1>Classes</h1>
    <div v-for="eClass in enemyClassesPR" :key="eClass.Name">
      <h2>{{ eClass.Name }}</h2>
      <div>Type: {{ eClass.Type }}</div>
      <div>Challenge: {{ eClass.Challenge }}</div>
      <div>Basic damage: {{ eClass.OffScaling * 2 }}</div>
      <div>Basic block: {{ eClass.DefScaling * 2 }}</div>
      <div>Base health: {{ eClass.DefScaling * 7 }}</div>
      <div v-if="eClass.HPBar > 0">Health bars: {{ eClass.HPBar + 1 }}</div>
      <div v-if="eClass.Weaknesses.length > 0">Weaknesses: {{ eClass.Weaknesses.join(', ') }}</div>
      <div v-if="eClass.Resistances.length > 0">
        Resistances: {{ eClass.Resistances.join(', ') }}
      </div>
      <div v-if="eClass.Immunities.length > 0">Immunities: {{ eClass.Immunities.join(', ') }}</div>
      <div v-if="eClass.Actions.length > 0">
        <h3>Actions</h3>
        <div v-for="act in eClass.Actions" :key="act.Name">
          <span style="font-weight: bold">{{ act.Name }}</span> - {{ act.Text }}
        </div>
      </div>
      <div v-if="eClass.Passives.length > 0">
        <h3>Passives</h3>
        <div v-for="pas in eClass.Passives" :key="pas.Name">
          <span style="font-weight: bold">{{ pas.Name }}</span> - {{ pas.Text }}
        </div>
      </div>
      <div v-if="eClass.PostAttack.length > 0">
        <h3>After every attack</h3>
        <div v-for="pos in eClass.PostAttack" :key="pos.Name">
          <span style="font-weight: bold">{{ pos.Name }}</span> - {{ pos.Text }}
        </div>
      </div>
      <br />
    </div>
    <h1>Templates</h1>
    <div v-for="eTemp in enemyTemplatesPR" :key="eTemp.Name">
      <h2>{{ eTemp.Name }}</h2>
      <div>Type: {{ eTemp.Type }}</div>
      <div>Challenge: {{ eTemp.Challenge }}</div>
      <div v-if="eTemp.ChallengeMult != 1">Challenge multiplier: {{ eTemp.ChallengeMult }}</div>
      <div>Damage modifier: {{ eTemp.OffScaling * 2 + eTemp.DmgMod }}</div>
      <div>Block modifier: {{ eTemp.DefScaling * 2 + eTemp.BlockMod }}</div>
      <div>Health modifier: {{ eTemp.DefScaling * 7 + eTemp.HPMod }}</div>
      <div v-if="eTemp.HPBar > 0">Extra health bars: {{ eTemp.HPBar }}</div>
      <div v-if="eTemp.Weaknesses.length > 0">Weaknesses: {{ eTemp.Weaknesses.join(', ') }}</div>
      <div v-if="eTemp.Resistances.length > 0">Resistances: {{ eTemp.Resistances.join(', ') }}</div>
      <div v-if="eTemp.Immunities.length > 0">Immunities: {{ eTemp.Immunities.join(', ') }}</div>
      <div v-if="eTemp.Actions.length > 0">
        <h3>Actions</h3>
        <div v-for="act in eTemp.Actions">
          <span style="font-weight: bold">{{ act.Name }}</span> - {{ act.Text }}
        </div>
      </div>
      <div v-if="eTemp.Passives.length > 0">
        <h3>Passives</h3>
        <div v-for="pas in eTemp.Passives">
          <span style="font-weight: bold">{{ pas.Name }}</span> - {{ pas.Text }}
        </div>
      </div>
      <div v-if="eTemp.PostAttack.length > 0">
        <h3>After every attack</h3>
        <div v-for="pos in eTemp.PostAttack" :key="pos.Name">
          <span style="font-weight: bold">{{ pos.Name }}</span> - {{ pos.Text }}
        </div>
      </div>
      <br />
    </div>
  </div>
</template>
