<script setup lang="ts">
import Multiselect from 'primevue/multiselect'
import FloatLabel from 'primevue/floatlabel'
import { GetCardList, GetCardTypes, GetRandomCards } from '@/application/cardController'
import { ref } from 'vue'

const cardTypes = GetCardTypes()
let cardList = GetCardList()
const selectedCardTypesAll = ref([])
const selectedCardTypesOne = ref([])
const excludeCardTypes = ref([])
function changedTypes() {
  cardList = GetCardList(
    selectedCardTypesOne.value,
    selectedCardTypesAll.value,
    excludeCardTypes.value
  )
}
const cardAmount = ref()
let cardsToShow = ref()
cardsToShow.value = []
function getRandomCards() {
  cardsToShow.value = GetRandomCards(cardList, cardAmount.value)
}
</script>
<template>
  <div class="row" style="display: inline-block; width: 500px">
    <FloatLabel class="w-full" variant="in" style="display: inline-block">
      <Multiselect
        v-model="selectedCardTypesAll"
        filter
        :options="cardTypes"
        class="w-full"
        @change="changedTypes()"
        inputId="typeSelect"
        style="width: 500px"
      />
      <label for="typeSelect">Types (include all)</label>
    </FloatLabel>
    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block">
      <Multiselect
        v-model="selectedCardTypesOne"
        filter
        :options="cardTypes"
        class="w-full md:w-80"
        @change="changedTypes()"
        inputId="typeSelect2"
        style="width: 500px"
      />
      <label for="typeSelect2">Types (include at least one)</label>
    </FloatLabel>
    <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block">
      <Multiselect
        v-model="excludeCardTypes"
        filter
        :options="cardTypes"
        class="w-full md:w-80"
        @change="changedTypes()"
        inputId="typeSelect3"
        style="width: 500px"
      />
      <label for="typeSelect3">Exlude types</label>
    </FloatLabel>
  </div>
  <div class="row">
    <input
      v-model="cardAmount"
      type="number"
      style="display: inline-block; width: 60px; font-size: 16px"
      placeholder="Card amuont"
    />
    <button style="display: inline-block" @click="getRandomCards()">Get cards</button>
  </div>
  <div v-if="cardsToShow.length > 0" style="display: inline-block; width: 500px; font-size: 16px">
    <h3>Cards</h3>
    <div v-for="card in cardsToShow" :key="card.Name">
      <div style="display: inline-block">
        <span style="font-weight: bold">{{ card.Cost }} {{ card.Name }}</span
        ><br />
        {{ card.Text }}
      </div>
      <div class="row">
        <i>{{ card.Types.sort().join(', ') }}</i>
      </div>
    </div>
  </div>
</template>
