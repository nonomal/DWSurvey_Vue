<template>
  <dw-qu-orderby-options v-model="survey" :index="index" ></dw-qu-orderby-options>
</template>

<script>

import DwDesignQuestionCommon from '../../DwDesignQuestionCommon'
import DwQuOptionCommon1 from '../../dw-design-options/dw-qu-option-common2/DwQuOptionCommon2.vue'
import DwQuOrderbyOptions from './components/DwQuOrderbyOptions'

export default {
  name: 'DwDesignQuOderby',
  components: {DwQuOrderbyOptions, DwQuOptionCommon1, DwDesignQuestionCommon},
  model: {
    prop: 'survey',
    event: 'update-survey'
  },
  props: {
    index: {type: Number, default: 0},
    survey: {type: Object, default: () => {}}
  }
}
</script>
