<template>
  <div>
    <dw-answer-default-layout v-model="survey" :ext-props="extProps" ></dw-answer-default-layout>
  </div>
</template>

<script>
import DwAnswerSurveyBody from './dw-answer-survey-body/DwAnswerSurveyBody.vue'
import DwAnswerDefaultLayout from './dw-anaswer-survey-layouts/dw-answer-default-layout/DwAnswerDefaultLayout.vue'
import {Loading} from 'element-ui'
import {dwSurveyAnswerById} from './api/dw-survey-answer'
import {initAnswerBySurvey, parseAnswerData, showPageByIndex} from '../dw-utils/dw-survey-answer-data'
import {getSurveyAnswerJsonBySurveyId} from './dw-utils/dw-survey-answer-common'
import {getEsId, surveyAnswerLocalStorage, surveyInitLocalStorage} from './dw-utils/dw-survey-answer-utils'
import {getSurveyAnswerData} from '../dw-utils/dw-survey-answer'
import {initAnswerSurveyProgress} from './dw-utils/dw-survey-answer-progress'
import {dwSurveyAnswerLogicLoad} from './dw-utils/dw-survey-answer-logic'

export default {
  name: 'DwAnswerSurveyMain',
  components: {DwAnswerDefaultLayout, DwAnswerSurveyBody},
  props: {
    extProps: {type: Object, default: () => {}},
    answerProps: {type: Object, default: () => {}}
  },
  data () {
    return {
      /*
      survey: {
        surveyNameObj: {dwHtml: '', dwText: ''},
        surveyDetail: {
          surveyNodeObj: {dwHtml: '', dwText: ''}
        },
        answer: {questions: []},
        surveyStyle: {
          themeColor: 'none'
        }
      },
      */
      uuidList: [],
      survey: null, // 點认保持为null, 加载时不会闪
      loading: true,
      answerData: null,
      answerCheckResult: null
    }
  },
  watch: {
    '$route' (to, from) {
      console.debug('$route to', to)
      this.survey = null
      this.loading = true
      this.answerData = null
      this.answerCheckResult = null
      this.loadSurvey()
    }
  },
  mounted () {
    this.loadSurvey()
  },
  methods: {
    loadSurvey () {
      const loadingInstance = Loading.service({
        fullscreen: true,
        spinner: 'fa-solid fa-spinner fa-spin-pulse',
        background: '#00000091',
        customClass: 'dw-loading dw-answer-custom-theme',
        text: '数据加载中'
      })
      // const sid = this.$route.params.id
      // const answerId = this.$route.params.answerId
      const surveyId = this.answerProps.surveyId
      const sid = this.answerProps.sid
      const answerId = this.answerProps.answerId
      const params = {surveyId, sid, answerId, anPwd: this.answerProps.anPwd}
      if (this.$route.query.hasOwnProperty('anPwd')) params.anPwd = this.$route.query.anPwd
      // 1、答卷合法性判断
      // 2、加载问卷与答卷
      getSurveyAnswerJsonBySurveyId(params, (survey, answerCheckResult) => {
        // survey.surveyStyle.themeColor = '#025bb7'
        survey.dwDebug = false
        if (this.extProps!=null) {
          if (this.extProps.hasOwnProperty('readonly')) survey.readonly = this.extProps.readonly
          if (this.extProps.hasOwnProperty('isShowScore')) {
            survey.isShowScore = this.extProps.isShowScore
            if (survey.hasOwnProperty('surveyAttrs')) survey.isShowScore = (survey.surveyAttrs.scoreAttr.enabled && this.extProps.isShowScore)
            if (survey.hasOwnProperty('surveyType')) survey.isShowScore = (survey.isShowScore || survey.surveyType === 'exam')
          }
        }
        this.answerCheckResult = answerCheckResult
        if (answerCheckResult.hasOwnProperty('anCheckIsPass') && answerCheckResult.hasOwnProperty('anCheckResultMsg') && !answerCheckResult.anCheckIsPass && answerCheckResult.anCheckResultCode!==403 && answerCheckResult.anCheckResultCode!==409) {
          survey.answerMsg = {showAnswerMsg: true, answerMsgInfo: answerCheckResult.anCheckResultMsg, noSurveyJson: false, answerCheckResult}
          this.survey = survey
        } else {
          survey.answerCheckResult = answerCheckResult
          // 初始化答卷数据结构
          initAnswerBySurvey(survey)
          // 加载原答卷数据
          this.loadAnswerData(survey)
          if (this.survey!==null) this.survey.answerCheckResult = this.answerCheckResult
        }
        const surveyName = survey.surveyNameObj.dwText
        document.title = surveyName+' - 调问网'
        // 以服务的方式调用的 Loading 需要异步关闭
        this.$nextTick(() => { loadingInstance.close() })
      }, (answerCheckResult) => {
        if (answerCheckResult.hasOwnProperty('anCheckIsPass') && answerCheckResult.hasOwnProperty('anCheckResultMsg') && !answerCheckResult.anCheckIsPass) {
          const answerMsg = {showAnswerMsg: true, answerMsgInfo: answerCheckResult.anCheckResultMsg, noSurveyJson: true, answerCheckResult}
          this.survey = {answerMsg, showSurvey: true}
          if (answerCheckResult.anCheckResultCode>=500) {
            this.$message.error(answerCheckResult.anCheckResultMsg)
          }
        }
        this.$nextTick(() => { loadingInstance.close() })
      })
    },
    loadAnswerData (survey) {
      // this.$route.params.hasOwnProperty('answerId') && this.$route.params.answerId!=null
      if (this.answerProps.hasOwnProperty('answerId') && this.answerProps.answerId!==null && this.answerProps.answerId!==undefined) {
        // const answerId = this.$route.params.answerId
        const answerId = this.answerProps.answerId
        dwSurveyAnswerById({answerId}).then((response) => {
          const httpResult = response.data
          if (httpResult.resultCode === 200) {
            this.answerData = httpResult.data
          } else {
            this.$message.warning('未找到对应的答卷记录！')
          }
          this.answerData2Survey(survey)
        })
      } else {
        this.answerData2Survey(survey)
      }
    },
    answerData2Survey (survey) {
      if (this.answerData!=null) {
        parseAnswerData(survey, this.answerData)
      }
      survey.answerMsg = {showAnswerMsg: false, answerMsgInfo: null, noSurveyJson: false}
      this.setSurveyData(survey)
    },
    setSurveyData (survey) {
      // 先判断是否有 answerId ，如果有则不需要考虑本地之前的缓存数据
      // this.$route.params.hasOwnProperty('answerId') && this.$route.params.answerId!=null
      if (this.answerProps.hasOwnProperty('answerId') && this.answerProps.answerId!==null && this.answerProps.answerId!==undefined) {
        if (survey.hasOwnProperty('dwEsSurveyAnswer') && survey.dwEsSurveyAnswer!==null) {
          const dwEsSurveyAnswer = survey.dwEsSurveyAnswer
          if ((this.extProps === undefined || (this.extProps.hasOwnProperty('readonly') && !this.extProps.readonly)) && (dwEsSurveyAnswer.hasOwnProperty('answerCommon') && dwEsSurveyAnswer.answerCommon.hasOwnProperty('anTime') && dwEsSurveyAnswer.answerCommon.anTime.hasOwnProperty('endAnDate'))) {
            const endAnDate = dwEsSurveyAnswer.answerCommon.anTime.endAnDate
            if (endAnDate!==null) {
              const endAnDateTime =new Date(endAnDate).getTime()
              const localLastActionDateTime = surveyAnswerLocalStorage.getSurveyAnswerActionTime(survey)
              if (localLastActionDateTime>endAnDateTime) {
                this.$confirm('检测到当前加载的答卷数据在本地有过修改，是否使用本地最新修改。', '提示', {
                  confirmButtonText: '是，使用本地最新数据',
                  cancelButtonText: '否，使用原始提交数据',
                  type: 'warning'
                }).then(() => {
                  this.localStorage2Survey(survey)
                  this.lastSetSurvey()
                }).catch(() => {
                  this.survey = survey
                  this.lastSetSurvey()
                })
              } else {
                this.survey = survey
                this.lastSetSurvey()
              }
            } else {
              this.survey = survey
              this.lastSetSurvey()
            }
          } else {
            this.survey = survey
            this.lastSetSurvey()
          }
        }
      } else {
        this.localStorage2Survey(survey)
        this.lastSetSurvey()
      }
    },
    localStorage2Survey (survey) {
      // 先判断本地有没有临时数据，如果有则看本地的临时数据版本是否与线上一致，一致则使用本地临时数据。
      const localStorageSurveyObj = this.getLocalStorage(survey)
      if (localStorageSurveyObj!==null) {
        this.localSurveyInitParams(localStorageSurveyObj)
        this.survey = localStorageSurveyObj
      } else {
        // 此处需要重置分页
        showPageByIndex(survey, 1, 'next')
        this.survey = survey
      }
    },
    getLocalStorage (survey) {
      // const localStorageSurveyObj = surveyAnswerLocalStorage.getSurveyAnswerObjByLocalStorage(this.$route.params.id, this.$route.params.answerId)
      const sid = survey.sid
      const answerId = getEsId(survey)
      const localStorageSurveyObj = surveyAnswerLocalStorage.getSurveyAnswerObjByLocalStorage(sid, answerId)
      if (localStorageSurveyObj!==null) {
        if (survey.hasOwnProperty('dwVersion') && localStorageSurveyObj.hasOwnProperty('dwVersion')) {
          if (survey.dwVersion===localStorageSurveyObj.dwVersion) {
            // 版本一致才返回
            return localStorageSurveyObj
          } else {
            // 考虑到本地缓存数据同步到新版本结构上面
            const localAnswer = getSurveyAnswerData(localStorageSurveyObj)
            parseAnswerData(survey, localAnswer)
            // 此处需要重置分页
            showPageByIndex(survey, 1, 'next')
            return survey
          }
        }
      }
      return null
    },
    checkAnswerPwd () {
      const survey = this.survey
      // 如果需要检查密码
      if (survey!=null && survey.hasOwnProperty('surveyAttrs') && survey.surveyAttrs.hasOwnProperty('anPwdAttr') && survey.surveyAttrs.anPwdAttr.hasOwnProperty('enabled')) {
        if (survey.surveyAttrs.anPwdAttr.enabled && !this.answerCheckResult.anCheckIsPass) {
          // 则弹出密码输入框，问卷不先显示
          this.survey.answerMsg.showAnswerMsg = true
          this.survey.answerMsg.showAnswerPwd = true
          // 如果带有密码，则提示输入正确密码
          this.survey.answerMsg.answerPwdError = '请输入正确密码'
        }
      }
    },
    lastSetSurvey () {
      const survey = this.survey
      // 初始化问卷进度状态
      initAnswerSurveyProgress(survey)
      // 此处需要重置分页
      showPageByIndex(survey, 1, 'next')
      // 逻辑处理初始化
      dwSurveyAnswerLogicLoad(survey)
      // 加载完成把问卷初始数据存入local
      // surveyInitLocalStorage.saveSurvey2LocalStorage(this.$route.params.id, this.$route.params.answerId, this.survey)
      // surveyInitLocalStorage.saveSurvey2LocalStorage(this.survey) // 这个数据没有取到作用
      // 如果是答新问卷，则需要检查答卷密码。
      this.checkAnswerPwd()
      if (this.survey!=null && this.survey.hasOwnProperty('firstLoadAnswer')) this.survey.firstLoadAnswer = false
      if (this.survey!=null) {
        const relateContactEsId = this.answerProps.relateContactEsId
        this.survey.dwParams = {relateContactEsId}
      }
    },
    localSurveyInitParams (localStorageSurveyObj) {
      localStorageSurveyObj.watchEvent = 'oooww'
      localStorageSurveyObj.watchEventScrollToId = 'aa22'
      localStorageSurveyObj.scrollToQuIndex = null
    }
  }
}
</script>
<style>
.dw-loading .el-loading-spinner *{
  /*font-size: 20px!important;
  color: #023e79;*/
}
.dw-answer-custom-theme .el-loading-spinner *{
  font-size: 20px!important;
  color: #127ee5 !important;
}
</style>
