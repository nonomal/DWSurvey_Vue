<template>
  <!--  @click.stop="clickItem"-->
  <div @click="clickItem" @mouseover="mouseoverItem" @mouseleave="mouseleaveItem" >
    <div class="dw-qu-item-body">
      <div class="dw-qu-item">
        <div class="dw-qu-item-el-checkbox-radio">
          <el-badge :hidden="!(survey.questions[quIndex].quAttr.scoreAttr.designShowScoreNum && survey.surveyAttrs.scoreAttr.enabled) || options[optionIndex].scoreNum===undefined" :value="`${options[optionIndex].scoreNum}分`" class="dw-el-badge-option-score" type="warning" >
            <i v-if="quType==='RADIO'" class="dw-qu-item-el-checkbox-radio-icon far fa-circle"></i>
            <i v-if="quType==='CHECKBOX'" class="dw-qu-item-el-checkbox-radio-icon far fa-square"></i>
          </el-badge>
          <!--
          <div v-if="survey.questions[quIndex].designShowScoreNum" style="font-size: 12px;margin-right: 5px;">
            <strong style="color: red;">{{ options[optionIndex].scoreNum }}</strong>
          </div>
          -->
          <dw-text-edit-label ref="dwEditLabel" v-model="options[optionIndex].optionTitleObj" :item-status="itemStatus" @upItemClick="upItemClick" @upValue="upValue" ></dw-text-edit-label>
        </div>
        <div v-show="itemBtnShow" class="dw-qu-item-toolbar dw-display-flex-right" >
          <el-tooltip class="item" effect="dark" content="排序选项" placement="top">
            <div class="dw-question-toolbar dw-margin-right-10"><i class="dwMoveSortQuOption dw-cursor-pointer dw-event-color el-icon-rank" aria-hidden="true" ></i></div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="在后添加选项" placement="top">
            <div class="dw-question-toolbar dw-margin-right-10" @click.stop="addOptionBefore" ><i class="dw-cursor-pointer dw-event-color el-icon-circle-plus-outline" aria-hidden="true"></i></div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除当前选项" placement="top">
            <div class="dw-question-toolbar dw-margin-right-10" @click.stop="deleteOption"><i class="dw-cursor-pointer dw-event-color el-icon-remove-outline" aria-hidden="true"></i></div>
          </el-tooltip>
        </div>
      </div>
      <template v-if="quType==='MULTIFILLBLANK' || ((quType==='RADIO' || quType==='CHECKBOX') && options[optionIndex].showOptionNote)" >
        <el-input v-if="options[optionIndex].answerInputRow>1" v-model="inputText" :placeholder="options[optionIndex].inputAttr.commonAttr.placeholder" :autosize="{ minRows: options[optionIndex].inputAttr.commonAttr.inputRow }" type="textarea" ></el-input>
        <el-input v-else v-model="inputText" :placeholder="options[optionIndex].inputAttr.commonAttr.placeholder" />
      </template>
      <el-rate v-if="quType==='SCORE'" :max="survey.questions[quIndex].paramInt02" ></el-rate>
    </div>
    <!--    <div v-show="survey.curEditObj[itemIndex].itemClick" class="dw-qu-item-toolbar dw-display-flex-right" >
      <el-tooltip class="item" effect="dark" content="排序选项" placement="top">
        <div class="dw-question-toolbar dw-margin-right-10"><i class="dwMoveSortQuOption dw-cursor-pointer dw-event-color el-icon-rank" aria-hidden="true" ></i></div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="在后添加选项" placement="top">
        <div class="dw-question-toolbar dw-margin-right-10" @click.stop="addOptionBefore" ><i class="dw-cursor-pointer dw-event-color el-icon-circle-plus-outline" aria-hidden="true"></i></div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="删除当前选项" placement="top">
        <div class="dw-question-toolbar dw-margin-right-10" @click.stop="deleteOption"><i class="dw-cursor-pointer dw-event-color el-icon-remove-outline" aria-hidden="true"></i></div>
      </el-tooltip>
    </div>-->
  </div>
</template>

<script>
import DwTextEditLabel from '../../../dw-design-survey-common/DwTextEditLabel.vue'
import {v4 as uuidV4} from 'uuid'
import {parseQuOptionType1Item} from '../../../../../dw-utils/dw-survey-parse'

export default {
  name: 'DwQuOptionCommon2Item',
  components: {DwTextEditLabel},
  model: {
    prop: 'options',
    event: 'update-options'
  },
  props: {
    quIndex: {type: Number, default: 0},
    optionIndex: {type: Number, default: 0},
    options: {type: Array, default: () => []},
    option: {type: Object, default: () => {}},
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
      itemIndex: 0,
      inputText: ''
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
      // this.upItemClick(true)
      // this.upAllItemClick()
    },
    upItemClick (itemClick) {
      // console.debug('this.itemIndex', this.itemIndex)
      // this.itemClick = itemClick
      this.itemStatus.itemClick = itemClick
      // this.options[this.optionIndex].itemClick = itemClick
      // if (this.itemIndex === 0) this.itemIndex = this.survey.curEditObj.push({itemClick: true})-1
      // this.survey.curEditObj[this.itemIndex].itemClick = true
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
      // this.options.push({id:'5',optionTitle:'<p>请设置选项</p>'})
      // this.question.quRadios = this.options;
      // this.$emit('update-survey',this.options)
      const quOption = {id: null, optionTitleObj: {dwHtml: '', dwText: '', dwPlaceholder: '请输入内容'}, itemClick: false}
      quOption.dwId = uuidV4()
      parseQuOptionType1Item(quOption)
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
      // console.debug('dragClick')
      // this.$refs.dwEditLabel.upEditorText(this.value.dwHtml)
      // this.upAllItemClick()
      this.$refs.dwEditLabel.upEditorText(this.options[this.optionIndex].optionTitleObj.dwHtml)
      console.debug('this.optionIndex', this.optionIndex)
      console.debug('focusIndex', focusIndex)
      if (focusIndex !==null && this.optionIndex === focusIndex) {
        this.upItemClick()
        this.editFocus()
      }
    },
    editFocus () {
      this.$refs.dwEditLabel.editFocus()
    },
    deleteOption () {
      console.debug('delete')
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
  justify-content: flex-end;
  align-items: center;
}
.dw-event-color{
  color: #095aaa;
  color: var(--dw-primary-button-theme-color);
}
.dw-margin-right-10{
  margin-right: 10px;
}
.dw-qu-item{
  display: grid;
  grid-template-columns: auto 90px;
}
.dw-qu-item-body{
  margin: 0;
}
.dw-qu-item-el-checkbox-radio{
  /*display: inline-flex;*/
  display: flex;
  align-items: center;
  padding: 5px 0px;
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
