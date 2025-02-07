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
    excludeCardTypes.value,
    cardName.value
  )
}
const cardAmount = ref()
const cardName = ref()
let cardsToShow = ref()
cardsToShow.value = []
let cardsPicked = ref()
cardsPicked.value = []
function getRandomCards() {
  cardsToShow.value = GetRandomCards(cardList, cardAmount.value)
}
function pickCard(card) {
  cardsPicked.value.push(card)
}
function removeCard(card) {
  var index = cardsPicked.value.indexOf(card)
  if (index !== -1) {
    cardsPicked.value.splice(index, 1)
  }
}
function removeAllPickedCards() {
  cardsPicked.value = []
}
</script>
<template>
  <FloatLabel variant="in" class="dropDown">
    <Multiselect
      v-model="selectedCardTypesAll"
      filter
      :options="cardTypes"
      @change="changedTypes()"
      inputId="typeSelect"
      class="dropDown"
    />
    <label for="typeSelect">Must have types</label>
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
    <label for="typeSelect2">Include types</label>
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
    <label for="typeSelect3">Exclude types</label>
  </FloatLabel>
  <div class="row">
    <input
      v-model="cardName"
      type="text"
      style="width: 100%; font-size: 16px"
      @change="changedTypes()"
      placeholder="Card name"
    />
  </div>
  <div class="row">
    <input
      v-model="cardAmount"
      type="number"
      style="width: 50%; font-size: 16px"
      placeholder="Card amount"
    />
    <button @click="getRandomCards()">Get cards</button>
  </div>
  <div v-if="cardsPicked.length > 0" style="width: 100%; font-size: 16px">
    <h3>Saved cards</h3>
    <div v-for="(card, index) in cardsPicked" :key="card.Name">
      <div>
        <span style="font-size: small">{{ index + 1 }}. </span>
        <span style="font-weight: bold"
          >{{ card.Cost }} {{ card.Name
          }}<span @click="removeCard(card)" class="clickable" v-tooltip="'Remove'"
            ><i class="pi pi-minus"></i></span
        ></span>

        <br />
        {{ card.Text }}
      </div>
      <div class="row">
        <i>{{ card.Types.sort().join(', ') }}</i>
      </div>
    </div>
    <button @click="removeAllPickedCards()" class="button">Remove all</button>
  </div>
  <div v-if="cardsToShow.length > 0" style="width: 100%; font-size: 16px">
    <h3>Cards</h3>
    <div v-for="(card, index) in cardsToShow" :key="card.Name">
      <div>
        <span style="font-size: small">{{ index + 1 }}. </span>
        <span style="font-weight: bold"
          >{{ card.Cost }} {{ card.Name }}
          <span @click="pickCard(card)" class="clickable" v-tooltip="'Save'"
            ><i class="pi pi-plus"></i></span
        ></span>
        <br />
        {{ card.Text }}
      </div>
      <div class="row">
        <i>{{ card.Types.sort().join(', ') }}</i>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
