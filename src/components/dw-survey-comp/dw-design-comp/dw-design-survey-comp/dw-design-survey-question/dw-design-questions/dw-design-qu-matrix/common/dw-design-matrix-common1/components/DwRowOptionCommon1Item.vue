<template>
  <!--  @click.stop="clickItem"-->
  <div class="dw-qu-item" @click="clickItem" @mouseover="mouseoverItem" @mouseleave="mouseleaveItem" >
    <div v-show="itemBtnShow" class="dw-qu-item-toolbar" >
      <div class="dw-display-grid">
        <div class="dw-question-toolbar"><i class="dwMoveSortQuOption dw-cursor-pointer dw-event-color el-icon-rank" aria-hidden="true"></i></div>
        <div class="dw-question-toolbar" @click.stop="addOptionBefore" ><i class="dw-cursor-pointer dw-event-color el-icon-circle-plus-outline" aria-hidden="true"></i></div>
        <div class="dw-question-toolbar" @click.stop="deleteOption"><i class="dw-cursor-pointer dw-event-color el-icon-remove-outline" aria-hidden="true"></i></div>
      </div>
    </div>
    <div class="dw-qu-item-body">
      <div class="dw-qu-item-el-checkbox-radio">
        <dw-text-edit-label ref="dwEditLabel" v-model="options[optionIndex].optionTitleObj" :item-status="itemStatus" @upItemClick="upItemClick" @upValue="upValue" ></dw-text-edit-label>
      </div>
    </div>
  </div>
</template>

<script>
import DwTextEditLabel from '../../../../../../dw-design-survey-common/DwTextEditLabel.vue'
import {v4 as uuidV4} from 'uuid'
export default {
  name: 'DwRowOptionCommon1Item',
  components: {DwTextEditLabel},
  /*
  model: {
    prop: 'value',
    event: 'update-input'
  },*/
  model: {
    prop: 'options',
    event: 'update-options'
  },
  props: {
    quIndex: {type: Number, default: 0},
    optionIndex: {type: Number, default: 0},
    options: {type: Array, default: () => []},
    survey: {type: Object, default: () => {}},
    quType: {type: String, default: ''},
    value: {type: Object, default: () => {}}
  },
  data () {
    return {
      itemStatus: {
        itemHover: false,
        itemClick: false
      },
      itemHover: false,
      itemClick: false,
      itemIndex: 0,
      inputText: null
    }
  },
  computed: {
    itemBtnShow () {
      return this.itemStatus.itemHover || this.itemStatus.itemClick
    }
  },
  watch: {
    options: function (newValue, oldValue) {
      // console.debug(newValue)
      // console.log('upEditorText changed from ' + oldValue + ' to ' + newValue)
      // console.debug('newValue', newValue)
      // console.debug('oldValue', oldValue)
      // console.debug('watch-options', this.options[this.optionIndex].optionTitleObj.dwHtml)
      // this.$refs.dwEditLabel.upEditorText(this.options[this.optionIndex].optionTitleObj.dwHtml)
    }
  },
  mounted () {
    // console.debug('itemIndex', this.optionIndex)
    if (this.options[this.optionIndex].itemClick) {
      this.upItemClick()
      this.editFocus()
      this.options[this.optionIndex].itemClick = false
    }
  },
  methods: {
    clickItem () {
      // this.upItemClick()
      // this.upAllItemClick()
    },
    upItemClick (itemClick) {
      // if (this.itemIndex === 0) this.itemIndex = this.survey.curEditObj.push({itemClick: true})-1
      // this.survey.curEditObj[this.itemIndex].itemClick = true
      this.itemStatus.itemClick = itemClick
    },
    upAllItemClick () {
      // const curObjs = this.survey.curEditObj
      // for (let i = 0; i < curObjs.length; i++) if (i !== this.itemIndex) this.survey.curEditObj[i].itemClick = false
    },
    mouseleaveItem () {
      // this.itemHover = false
      this.itemStatus.itemHover = false
    },
    mouseoverItem () {
      // this.itemHover = true
      this.itemStatus.itemHover = true
    },
    addOptionBefore () {
      const quOption = {id: null, optionTitleObj: {dwHtml: '新行选项', dwText: '新行选项', dwPlaceholder: '请输入内容'}, itemClick: false}
      quOption.dwId = uuidV4()
      this.options.splice(this.optionIndex+1, 0, quOption)
      this.$emit('update-options', this.options)
      this.$emit('refresh-options', this.optionIndex+1)
    },
    upValue (html) {
      // 此处使用了引用类型可以不传更新
      // console.debug('html', html)
      // this.$emit('update-input', html)
      this.options[this.optionIndex].optionTitleObj = html
      this.$emit('update-options', this.options)
    },
    dragClick (focusIndex) {
      // this.$refs.dwEditLabel.upEditorText(this.value.dwHtml)
      // this.upAllItemClick()
      this.$refs.dwEditLabel.upEditorText(this.options[this.optionIndex].optionTitleObj.dwHtml)
      if (focusIndex !==null && this.optionIndex === focusIndex) {
        this.upItemClick()
        this.editFocus()
      }
    },
    editFocus () {
      this.$refs.dwEditLabel.editFocus()
    },
    deleteOption () {
      // console.debug('delete')
      this.options.splice(this.optionIndex, 1)
      this.$emit('refresh-options', null)
    }
  }
}
</script>

<style scoped>
.dw-padding-top-10{
  padding-top: 10px;
}
.dw-margin-bottom-10{
  margin-bottom: 10px;
}
.dw-margin-left-right-10{
  margin-right: 10px;
  margin-left: 10px;
}
.dw-margin-right-10{
  margin-right: 10px;
}
.dw-margin-left-10{
  margin-left: 10px;
}
.dw-display-flex{
  display: flex;
  align-items: center;
}
.dw-display-flex-left{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.dw-display-flex-right{
  display: flex;
  /*justify-content: flex-end;*/
  /*align-items: center;*/
  /*align-content: center;*/
}
.dw-event-color{
  color: #095aaa;
}
.dw-margin-right-10{
  margin-right: 10px;
}
.dw-qu-item{
  /*display: grid;*/
  /*grid-template-columns: auto 90px;*/
  position: relative;
}
.dw-qu-item-body{
  margin: 0px;
}
.dw-qu-item-el-checkbox-radio{
  /*display: inline-flex;*/
  display: flex;
  align-items: center;
  padding: 5px 0;
  font-size: 14px;
}
.dw-qu-item-el-checkbox-radio-icon{
  /*background: red;*/
  font-size: 18px;
  width: 28px;
  color: #848484;
}
.dw-qu-item-el-checkbox-radio-icon.dw-checked{
  color: #0557a8;
}
.dw-qu-item-el-checkbox-radio .dw-qu-option-text{
  /*margin:auto;*/
  width: 100%;
  padding: 6px;
}

.dw-input-default{
  border: 1px solid transparent;
}
.dw-input-focus{
  border: 1px solid #095aaa;
  background: #e5f5f5;
}
.dw-display-grid{
  display: grid;
  grid-template-columns: repeat(3,auto);
  grid-column-gap: 5px;
  align-items: center;
  align-content: center;
  justify-items: start;
  justify-content: start;
}
.dw-qu-item-toolbar{
  position: absolute;
  right: 40px;
  top: -20px;
  z-index: 10;
  /*border: 1px solid #095aaa;*/
}
.dw-qu-item-toolbar .dw-question-toolbar{
  padding: 2px 3px 0px 3px;
  /*background: red;*/
  line-height: normal;
}

.dw-el-badge-option-score /deep/ .el-badge__content{
  border-radius: 3px;
  font-size: 8px;
  height: 14px;
  line-height: 14px;
  padding: 0 2px;
  border: none;
}
.dw-el-badge-option-score /deep/ .el-badge__content.is-fixed{
  /*top: -3px;
  right: 30px;*/
  top: 0;
  right: 20px;
}
</style>
