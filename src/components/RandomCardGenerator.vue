<script setup lang="ts">
import Multiselect from 'primevue/multiselect'
import FloatLabel from 'primevue/floatlabel'
import { GetCardList, GetCardTypes, GetRandomCards } from '@/application/cardController'
import { ref } from 'vue'
import { isMobile } from '../application/func'

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
  <!-- <div :class="[isMobile ? 'grid-container-mob' : 'grid-container']"> -->
  <!-- <div class="row" style="display: inline-block; width: 100%"> -->
  <FloatLabel variant="in" class="dropDown">
    <Multiselect
      v-model="selectedCardTypesAll"
      filter
      :options="cardTypes"
      @change="changedTypes()"
      inputId="typeSelect"
      class="dropDown"
    />
    <label for="typeSelect">Types (include all)</label>
  </FloatLabel>
  <FloatLabel variant="in" class="dropDown">
    <Multiselect
      v-model="selectedCardTypesOne"
      filter
      :options="cardTypes"
      @change="changedTypes()"
      inputId="typeSelect2"
      class="dropDown"
    />
    <label for="typeSelect2">Types (include at least one)</label>
  </FloatLabel>
  <FloatLabel variant="in" class="dropDown">
    <Multiselect
      v-model="excludeCardTypes"
      filter
      :options="cardTypes"
      @change="changedTypes()"
      inputId="typeSelect3"
      class="dropDown"
    />
    <label for="typeSelect3">Exlude types</label>
  </FloatLabel>
  <!-- </div> -->
  <!-- </div> -->
  <div class="row">
    <input
      v-model="cardAmount"
      type="number"
      style="width: 40%; font-size: 16px"
      placeholder="Card amount"
    />
    <button @click="getRandomCards()">Get cards</button>
  </div>
  <div v-if="cardsToShow.length > 0" style="width: 100%; font-size: 16px">
    <h3>Cards</h3>
    <div v-for="card in cardsToShow" :key="card.Name">
      <div>
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
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 10px;
}
.grid-container-mob {
  display: grid;
  grid-template-columns: auto;
  padding: 10px;
}
</style>
