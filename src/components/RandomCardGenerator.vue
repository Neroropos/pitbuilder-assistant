<script>
import Multiselect from 'primevue/multiselect'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'
import { GetCardList } from '@/application/cardController'

const cardTypes = GetCardTypes()
const cardList = GetCardList(cardTypes)
</script>
<template>
  <FloatLabel class="w-full md:w-56" variant="in" style="display: inline-block">
    <Multiselect
      v-model="selectedCardTypes"
      filter
      :options="cardTypes"
      option-label="Name"
      class="w-full md:w-80"
      @change="changed($event)"
      inputId="typeSelect"
    />
    <label for="typeSelect">Types</label>
  </FloatLabel>
</template>
