<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane v-if="survey.hasOwnProperty('designLayout') && survey.designLayout === 'LR'" label="题型">
        <div :style="`height:${lrContentHeight}px;`" style="overflow-y: scroll;" class="scrollable-hidden scrollable-y">
          <dw-design-toolbar-left v-model="survey" ></dw-design-toolbar-left>
        </div>
      </el-tab-pane>
      <el-tab-pane label="大纲">
        <div :style="`height:${lrContentHeight}px;`" style="overflow-y: scroll;" class="scrollable-hidden scrollable-y">
          <!--          <el-collapse>
            <el-collapse-item title="第1页" name="1">
              <ul class="dw_left_ul">
                <li>Q1、您的姓名</li>
                <li>Q2、您的姓名</li>
                <li>Q3、您的姓名</li>
                <li>Q4、您的姓名</li>
                <li>Q5、您的姓名</li>
              </ul>
            </el-collapse-item>
          </el-collapse>-->
          <div class="dw_left_ul">
            <div style="padding-bottom: 5px;">
              <el-alert title="拖动目录可修改题目排序" type="info" show-icon></el-alert>
            </div>
            <draggable
              v-model="survey.questions"
              :force-fallback="true"
              :group="{ name: 'questionGroup', pull: false, put: false }"
              animation="300"
              drag-class="dwDragClass"
              ghost-class="dwGhostClass"
              chosen-class="dwChosenClass"
              @onAdd="onAdd"
              @start="onStart"
              @end="onEnd">
              <transition-group>
                <div v-for="(item, index) in survey.questions" :key="`surveyQu${index}`" >
                  <dw-design-catalog-qu-item v-model="survey" :index="index"></dw-design-catalog-qu-item>
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="题库">
        <div :style="`height:${lrContentHeight}px;`" class="scrollable-hidden scrollable-y">
          <dw-design-qu-banks v-model="survey" @start-drag-right="onStartRight" @end-drag="onEnd" ></dw-design-qu-banks>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import {dwResetQuestionRefreshValue} from '../../../../../dw-utils/dw-survey-update-question'
import DwDesignCatalogQuItem from './components/DwDesignCatalogQuItem.vue'
import DwDesignSurveyAttrs from './components/DwDesignSurveyAttrs.vue'
import DwDesignToolbarLeft from './components/DwDesignToolbarLeft.vue'
import DwDesignQuBanks from "../dw-design-body-right/components/DwDesignQuBanks.vue";

export default {
  name: 'DwDesignContainerBodyLeft',
  components: {
    DwDesignQuBanks,
    DwDesignToolbarLeft,
    DwDesignSurveyAttrs,
    DwDesignCatalogQuItem,
    draggable
  },
  model: {
    prop: 'survey',
    event: 'update-survey'
  },
  props: {
    survey: {type: Object, default: () => {}},
    lrContentHeight: {type: Number, default: () => {}}
  },
  data () {
    return {
      contentStyle: '',
      drag: false
    }
  },
  mounted () {
    // window.addEventListener('scroll', this.onScroll)
  },
  methods: {
    onAdd (attrs) {
      console.debug('left onAdd attrs', attrs)
      // 自动执行focus事件
      const newIndex = attrs.newIndex
      this.refreshData(newIndex)
      this.survey.questions[newIndex].quTitleObj.isNew = true
    },
    onStart () {
      this.drag = true
    },
    onEnd (attrs) {
      this.drag = false
      // 更新状态
      const newIndex = attrs.newIndex
      const oldIndex = attrs.oldIndex
      if (newIndex>oldIndex) {
        this.refreshData(oldIndex)
      } else {
        this.refreshData(newIndex)
      }
    },
    onScroll () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const headerHeight = 60
      if (scrollTop >= headerHeight) {
        const lrHeight = window.innerHeight - (157+60) - 20
        this.contentStyle = `height:${lrHeight}px;`
      } else {
        const newTop = headerHeight - scrollTop
        const lrHeight = window.innerHeight - (157+60+newTop) - 20
        this.contentStyle = `height:${lrHeight}px;`
      }
    },
    refreshData (quIndex) {
      const questions = this.survey.questions
      questions.forEach((item, index) => {
        if (index>=quIndex) this.survey.questions.splice(index, 1, dwResetQuestionRefreshValue(JSON.parse(JSON.stringify(item))))
      })
    }
  }
}
</script>

<style scoped>
.dw_left_ul{
  list-style: none;
  padding: 0;
  margin: 0;
}
.dw_left_ul li{
  padding: 0 5px;
  margin: 0;
}
/deep/ .el-collapse-item__header{
  height: 38px;
  line-height: 38px;
}
/deep/ .el-collapse-item__content{
  padding-bottom: 10px;
}
</style>
