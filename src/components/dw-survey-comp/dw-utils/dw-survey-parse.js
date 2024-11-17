import {v4 as uuidv4} from 'uuid'
import {getDefaultSurveyStyle} from './dw-common/dw-common-utils'
import {buildMatrixQuRowCols} from './dw-survey-answer-data'
import {getSurveyTypeSimpleName} from "./dw-survey-common";
/**
 * 解析原始survey，使之能符合前端设计器相关规则
 * @param survey
 */
export function parseSurvey (survey) {
  /* survey: {
    // font-size: 22px;font-weight: bold;
    surveyNameObj: {dwHtml: '<h1>Hello DWSurvey</h1>', dwText: 'Hello DWSurvey'},
    surveyDetail: {
      surveyNodeObj: {dwHtml: '<div>非常感谢您的参与！如有涉及个人信息，我们将严格保密。</div>', dwText: '非常感谢您的参与！如有涉及个人信息，我们将严格保密。'}
    },
    questions: [
      {quTitleObj: {dwHtml: '<p>aaaa</p>', dwText: 'aaaa'}, quType: 'CHECKBOX', quCheckboxs: [{id: '1', optionTitleObj: {dwHtml: '<p>aa</p>', dwText: 'aaaa'}, itemClick: false}, {id: '2', optionTitleObj:  {dwHtml: '<p>aa</p>', dwText: 'aaaa'}, itemClick: false}, {id: '3', optionTitleObj:  {dwHtml: '<p>cc</p>', dwText: 'aaaa'}, itemClick: false}]},
      {quTitleObj: {dwHtml: '<p>abcd</p>', dwText: 'abcd'}, quType: 'RADIO', quRadios: [{id: '1', optionTitleObj:  {dwHtml: '<p>bb</p>', dwText: 'aaaa'}, itemClick: false}, {id: '2', optionTitleObj:  {dwHtml: '<p>bbb</p>', dwText: 'aaaa'}, itemClick: false}, {id: '3', optionTitleObj:  {dwHtml: '<p>ddd</p>', dwText: 'aaaa'}, itemClick: false}]},
      {quTitleObj: {dwHtml: '<p>abcd</p>', dwText: 'abcd'}, quType: 'RADIO', quRadios: [{id: '1', optionTitleObj:  {dwHtml: '<p>bb</p>', dwText: 'aaaa'}, itemClick: false}, {id: '2', optionTitleObj:  {dwHtml: '<p>bbb</p>', dwText: 'aaaa'}, itemClick: false}, {id: '3', optionTitleObj:  {dwHtml: '<p>ddd</p>', dwText: 'aaaa'}, itemClick: false}]}
    ],
      surveyTest: '',
      curEditObj: [{itemClick: false}]
  } */
  if (survey !== null) {
    if (!survey.hasOwnProperty('surveyNameObj')) survey.surveyNameObj = {dwHtml: survey.surveyName, dwText: survey.surveyNameText, dwPlaceholder: '请输入问卷标题'}
    parseSurveyDetail(survey)
    parseQuestions(survey.questions, true)
    survey.surveyTest = ''
    survey.curEditObj = [{itemClick: false}]
    // survey.surveyStyle = {themeColor: 'red'}
    survey.tempDataType = 'none'
    if (!survey.hasOwnProperty('dwId')) survey.dwId = uuidv4()
    survey.showSurvey = true
    if (!survey.hasOwnProperty('surveyStyle')) survey.surveyStyle = getDefaultSurveyStyle()
    if (!survey.surveyStyle.hasOwnProperty('showQuScoreNum')) survey.surveyStyle.showQuScoreNum = false
    survey.clientBrowser = {windowWidth: 0, matrixWidth: 0}
    if (!survey.hasOwnProperty('designLayout')) survey.designLayout = 'TB'
    // if (!survey.hasOwnProperty('designLayout')) survey.designLayout = 'LR'
    survey.watchEvent = 'oooww'
    survey.watchEventScrollToId = 'oooww'
    survey.scrollToQuIndex = null
    survey.surveyTypeSimpleName = '问卷'
    getSurveyTypeSimpleName(survey)
    survey.surveyFocusObj = {
      rightFocusTab: 'surveySet',
      focusQuIndex: null
    }
  }
  return survey
}

export function parseSurveyDetail (survey) {
  const surveyDetail = survey.surveyDetail
  if (surveyDetail !== null) {
    const surveyNoteText = surveyDetail.surveyNoteText !== null ? surveyDetail.surveyNoteText : ''
    // surveyDetail.surveyNodeObj = {dwHtml: surveyDetail.surveyNote, dwText: surveyNoteText}
    if (!survey.surveyDetail.hasOwnProperty('surveyNodeObj')) survey.surveyDetail.surveyNodeObj = {dwHtml: surveyDetail.surveyNote, dwText: surveyNoteText, dwPlaceholder: '请输入问卷介绍'}
  }
  survey.surveyDetail.effective_model = survey.surveyDetail.effective === 1
  survey.surveyDetail.effectiveIp_model = survey.surveyDetail.effectiveIp === 1
  survey.surveyDetail.refresh_model = survey.surveyDetail.refresh === 1
  survey.surveyDetail.rule_model = survey.surveyDetail.rule === 3
  survey.surveyDetail.ynEndNum_model = survey.surveyDetail.ynEndNum === 1
  survey.surveyDetail.endNum_model = survey.surveyDetail.endNum
  survey.surveyDetail.ynEndTime_model = survey.surveyDetail.ynEndTime === 1
  if (!survey.surveyDetail.hasOwnProperty('dwId')) survey.surveyDetail.dwId = uuidv4()
  // v6版本重新定义问卷属性存放类
  if (!survey.hasOwnProperty('surveyAttrs')) {
    survey.surveyAttrs = {
      anBroAttr: {enabled: false, anNum: 1},
      anIpAttr: {enabled: false, anNum: 1},
      anRefreshAttr: {randomCode: true},
      anPwdAttr: {enabled: false, anPwdCode: null},
      anEndNumAttr: {enabled: false, endNum: null},
      anEndTimeAttr: {enabled: false, endTime: null}
    }
  }
  if (!survey.surveyAttrs.hasOwnProperty('anStartTimeAttr')) {
    survey.surveyAttrs.anStartTimeAttr = {enabled: false, startTime: null}
  }
  if (!survey.surveyAttrs.hasOwnProperty('scoreAttr')) {
    survey.surveyAttrs.scoreAttr = {
      enabled: false, // 是否打开计分功能
      maxScore: 0, // 最大分值
      showSumScore: {
        enabled: true,
        showContent: 'sumAndDetail'
      }
    }
  }
  if (!survey.surveyAttrs.scoreAttr.hasOwnProperty('showSumScore')) {
    survey.surveyAttrs.scoreAttr.showSumScore = {
      enabled: true,
      showContent: 'sumAndDetail'
    }
  }
  /* survey.surveyAttrs = {
    anBroAttr: {enabled: false, anNum: 1},
      anIpAttr: {enabled: false, anNum: 1},
      anRefreshAttr: {randomCode: true},
      anPwdAttr: {enabled: false, anPwdCode: null},
      anEndNumAttr: {enabled: false, endNum: null},
      anEndTimeAttr: {enabled: false, endTime: null}
  } */
  if (!survey.surveyAttrs.hasOwnProperty('opoqAttr')) {
    survey.surveyAttrs.opoqAttr = {
      enabled: false // 是否一页一题
    }
  }
}
/**
 * 解析题目
 * @param noModel 非模型
 * @param questions
 */
export function parseQuestions (questions, noModel) {
  if (questions !== null && questions.length > 0) {
    // 循环然后定义以上内容
    questions.forEach((question, quIndex) => {
      question.showQu = true
      question.logicIsHide = false
      parseQuestion(question, noModel)
    })
  }
  return questions
}

/**
 * 解析题目
 * @param question
 * @param noModel
 */
export function parseQuestion (question, noModel) {
  const quName = question.quName !== null ? question.quName : question.quTitle
  if (!question.hasOwnProperty('quTitleObj')) question.quTitleObj = {dwHtml: question.quTitle, dwText: quName, dwPlaceholder: '请输入题目标题', isNew: false}
  const quNote = question.quNote
  if (!question.hasOwnProperty('quNoteObj')) question.quNoteObj = {dwHtml: quNote, dwText: quNote, dwPlaceholder: '请输入题目备注', isNew: false}
  if (!question.hasOwnProperty('questionLogics') || question.questionLogics===null) question.questionLogics = []
  if (noModel && !question.hasOwnProperty('dwId')) question.dwId = uuidv4()
  addNewQuProps(question)// 新版重新梳理属性结构
  const quType = question.quType
  if (quType === 'RADIO') {
    parseQuRadio(question)
  } else if (quType === 'CHECKBOX') {
    parseQuCheckbox(question)
  } else if (quType === 'ORDERQU') {
    parseQuOrderbys(question)
  } else if (quType === 'MULTIFILLBLANK') {
    parseQuMultiFillblanks(question)
  } else if (quType === 'SCORE') {
    parseQuScores(question)
  } else if (quType === 'FILLBLANK') {
    parseQuFbk(question)
  } else if (quType === 'UPLOADFILE') {
    parseQuUploadFile(question)
  } else if (quType === 'PAGETAG') {
    question.quTypeName = '分页组件'
  } else if (quType === 'PARAGRAPH') {
    question.quTypeName = '分段组件'
  } else if (quType === 'MATRIX_RADIO') {
    question.quTypeName = '矩阵单选题'
  } else if (quType === 'MATRIX_CHECKBOX') {
    question.quTypeName = '矩阵多选题'
  } else if (quType === 'MATRIX_INPUT') {
    question.quTypeName = '矩阵填空题'
  } else if (quType === 'MATRIX_SCALE') {
    question.quTypeName = '矩阵量表题'
  } else if (quType === 'MATRIX_SLIDER') {
    question.quTypeName = '矩阵滑块题'
  }
  if (!question.hasOwnProperty('validateObj')) question.validateObj = {errorText: '', isOk: true}
  /*
  if (!question.hasOwnProperty('dateAttrs')) question.dateAttrs = []
  if (!question.hasOwnProperty('timeRange') || !question.timeRange.hasOwnProperty('range')) question.timeRange = {range: null, step: null}
  if (question.checkType==='TIME' && question.dateAttrs.includes('range')) question.answer = {startTime: null, endTime: null}
  if (!question.hasOwnProperty('dateFormat')) { question.dateFormat = 0 }
  */

  // 新版重新梳理属性结构
  // const commonAttr = {checkType: null, placeholder: '', defaultValue: '', inputRow: 1, minlength: 0, maxlength: 123}
  // const dateTimeAttr = {timeRange: {range: null, step: null}, dateFormat: null, attrs: []}
  // const numAttr = {min: null, max: null}
  // const inputAttr = {commonAttr, dateTimeAttr, numAttr}
  // if (!question.hasOwnProperty('quAttr')) question.quAttr = {isRequired: true, inputAttr}
  question.itemClick = false
  if (!question.hasOwnProperty('question')) {
    question.quFocusObj = {
      quFocus: false,
      quSetShow: false,
      quLogicShow: false,
      quMoreOptionShow: false,
      quMoreOptionShowEdit: false,
      quScorePopoverShow: false,
      quScaleTextPopoverShow: false,
      quMoreOptionColShow: false
    }
  }
}

function addNewQuProps (question) {
  // 新版重新梳理属性结构
  if (question.hasOwnProperty('quAttr')) {
    if (!question.quAttr.hasOwnProperty('isRequired')) question.quAttr.isRequired = true
  } else {
    question.quAttr = {isRequired: true}
  }
  // 加上分值配置
  if (!question.quAttr.hasOwnProperty('scoreAttr')) {
    question.quAttr.scoreAttr = {maxScore: 0, designShowScoreNum: false}
  }
  const quType = question.quType
  if (quType==='CHECKBOX' && !question.quAttr.scoreAttr.hasOwnProperty('allRight')) {
    question.quAttr.scoreAttr.allRight = {enabled: false, scoreNum: 0}
  }
  if (!question.quAttr.hasOwnProperty('showQuNote')) {
    question.quAttr.showQuNote = false
  }
  // 数值区间数据
  if (quType==='SCORE') {
    if (!question.quAttr.hasOwnProperty('scoreQuAttr')) {
      // 评分题的属性
      question.quAttr.scoreQuAttr = {max: 5, texts: []}
    }
  }
  if (quType==='MATRIX_SCALE') {
    if (!question.quAttr.hasOwnProperty('scaleAttr')) {
      question.quAttr.scaleAttr = {min: 0, max: 10, showLrText: true}
    }
  }
  if (quType==='MATRIX_SLIDER') {
    if (!question.quAttr.hasOwnProperty('sliderAttr')) {
      question.quAttr.sliderAttr = {min: 0, max: 100, step: 1, showLrText: true}
    }
  }
  return question
}

function getInputQuProps () {
  // 新版重新梳理属性结构
  const commonAttr = {checkType: null, placeholder: '', defaultValue: '', inputRow: 1, minlength: 0, maxlength: 119, isRequired: 1}
  const dateTimeAttr = {timeRange: {range: null, step: null}, dateFormat: null, attrs: []}
  const numAttr = {min: null, max: null}
  const inputAttr = {commonAttr, dateTimeAttr, numAttr}
  return inputAttr
}

/**
 * 生成题目模板
 * @param questions
 * @returns {*}
 */
export function initQuestionModels (questions) {
  if (questions !== null && questions.length > 0) {
    // 循环然后定义以上内容
    questions.map((question, quIndex) => {
      // question.isRequired = 1
      question.showQu = true
      question.logicIsHide = false
      addNewQuProps(question)
      // 为矩阵题构建选项
      buildMatrixOption(question)
    })
  }
  return questions
}
/**
 * 解析单选题
 * @param question
 */
function parseQuRadio (question) {
  question.quTypeName = '单选题'
  if (question.cellCount === 0) question.cellCount = 2
  parseQuOptionType1(question, question.quRadios)
}

/**
 * 解析多选题
 * @param question
 */
function parseQuCheckbox (question) {
  question.quTypeName = '多选题'
  if (question.cellCount === 0) question.cellCount = 2
  parseQuOptionType1(question, question.quCheckboxs)
  if (!question.quAttr.hasOwnProperty('scoreAttr')) {
    question.quAttr.scoreAttr = {maxScore: 0, designShowScoreNum: false, allRight: {enabled: false, scoreNum: 0}}
  }
}

/**
 * 解析排序题
 * @param question
 */
function parseQuOrderbys (question) {
  question.quTypeName = '排序题'
  parseQuOptionType1(question, question.quOrderbys)
}

/**
 * 解析多项填空题
 * @param question
 */
function parseQuMultiFillblanks (question) {
  question.quTypeName = '多项填空题'
  parseQuOptionType1(question, question.quMultiFillblanks)
}

/**
 * 解析评分题
 * @param question
 */
function parseQuScores (question) {
  question.quTypeName = '评分题'
  parseQuOptionType1(question, question.quScores)
}

/**
 * 解析填空题
 * @param question
 */
function parseQuFbk (question) {
  question.quTypeName = '填空题'
  if (!question.hasOwnProperty('placeholder')) question.placeholder = '请输入'
  if (!question.hasOwnProperty('step')) question.step = '00:05'
  const inputAttr = getInputQuProps()
  /*
  if (question.hasOwnProperty('quAttr')) {
    if (!question.quAttr.hasOwnProperty('isRequired')) question.quAttr.isRequired = true
    if (!question.quAttr.hasOwnProperty('inputAttr')) question.quAttr.inputAttr = inputAttr
  } else {
    question.quAttr = {isRequired: true, inputAttr}
  }*/
  addNewQuProps(question)
  if (!question.quAttr.hasOwnProperty('inputAttr') || question.quAttr.inputAttr===undefined) question.quAttr.inputAttr = inputAttr
  if (!question.quAttr.inputAttr.hasOwnProperty('dateTimeAttr')) question.quAttr.inputAttr.dateTimeAttr = inputAttr.dateTimeAttr
  const checkType = question.checkType
  if (checkType==='DATE') {
    question.quAttr.inputAttr.commonAttr.checkType='DATE'
    console.debug('question.quAttr.inputProp', question.quAttr.inputProp)
    question.quAttr.inputAttr.dateTimeAttr.dateFormat = 3
  } else if (checkType==='TIME') {
    question.quAttr.inputAttr.commonAttr.checkType='TIME'
    question.quAttr.inputAttr.dateTimeAttr.dateFormat = 7
  } else if (checkType==='EMAIL') {
    question.quAttr.inputAttr.commonAttr.checkType='EMAIL'
  } else if (checkType==='PHONENUM') {
    question.quAttr.inputAttr.commonAttr.checkType='PHONE'
  } else if (checkType==='IDENTCODE') {
    question.quAttr.inputAttr.commonAttr.checkType='IDENT_CODE'
  } else if (checkType==='DIGITS') {
    question.quAttr.inputAttr.commonAttr.checkType='DIGITS'
  }
}

function parseQuUploadFile (question) {
  question.quTypeName = '上传题'
  if (!question.hasOwnProperty('placeholder')) question.placeholder = '请输入'
  if (!question.hasOwnProperty('step')) question.step = '00:05'
}

/**
 * 用于解析单选、多选、排序、多项填空题的选项
 * @param question
 * @param quOptions
 */
function parseQuOptionType1 (question, quOptions) {
  if (quOptions !==null && quOptions.length>0) {
    quOptions.forEach((quOption, optionIndex) => {
      if (question.hasOwnProperty('dwId') && !quOption.hasOwnProperty('dwId')) quOption.dwId = uuidv4()
      parseQuOptionType1Item(quOption)
    })
  }
  // question.quOptions = quOptions // 暂时先不考虑这个方案，还是分别处理更清楚
}

export function parseQuOptionTypeByQu (question, quOption) {
  const quType = question.quType
  if (quType === 'RADIO' || quType === 'CHECKBOX' || quType === 'ORDERQU' || quType === 'MULTIFILLBLANK' || quType === 'SCORE') {
    parseQuOptionType1Item(quOption)
  }
  // question.quOptions = quOptions // 暂时先不考虑这个方案，还是分别处理更清楚
}

export function parseQuOptionType1Item (quOption) {
  const optionTitle = quOption.optionTitle !== null ? quOption.optionTitle : quOption.optionName
  // oss版本把html保存在 optionTitle
  const optionName = quOption.optionName !== null ? quOption.optionName : optionTitle
  if (!quOption.hasOwnProperty('optionTitleObj')) quOption.optionTitleObj = {dwHtml: optionName, dwText: optionTitle, dwPlaceholder: '请输入选项内容'}
  if (!quOption.hasOwnProperty('dateAttrs')) quOption.dateAttrs = []
  if (!quOption.hasOwnProperty('checked')) quOption.checked = false
  if (!quOption.hasOwnProperty('orderIndex')) quOption.orderIndex = 0
  const inputAttr = getInputQuProps()
  if (!quOption.hasOwnProperty('inputAttr')) quOption.inputAttr = inputAttr
  if (!quOption.hasOwnProperty('showOptionNote')) quOption.showOptionNote = 0 // 选项题
  if (!quOption.hasOwnProperty('isRequired')) quOption.isRequired = 1 // 多项填空题
  if (!quOption.hasOwnProperty('otherText')) quOption.otherText = null // 多项填空题
  quOption.validateObj = {errorText: '', isOk: true}
  if (!quOption.hasOwnProperty('scoreNum')) quOption.scoreNum = null
}

/**
 * 重置题目所有Id, 包括内部选项ID
 * @param question
 */
export function resetQuestion (question) {
  question.dwId = uuidv4()
  const quType = question.quType
  if (quType === 'RADIO') {
    resetQuOptionType1(question, question.quRadios)
  } else if (quType === 'CHECKBOX') {
    resetQuOptionType1(question, question.quCheckboxs)
  } else if (quType === 'ORDERQU') {
    resetQuOptionType1(question, question.quOrderbys)
  } else if (quType === 'MULTIFILLBLANK') {
    resetQuOptionType1(question, question.quMultiFillblanks)
  } else if (quType === 'SCORE') {
    resetQuOptionType1(question, question.quScores)
  } else if (quType === 'MATRIX_RADIO' || quType === 'MATRIX_CHECKBOX' || quType === 'MATRIX_INPUT' || quType==='MATRIX_SCALE' || quType === 'MATRIX_SLIDER') {
    resetMatrixQuOptionType1(question, question.quRows, question.quCols)
  }
}

/**
 * 重置选项的ID
 * @param question
 * @param quOptions
 */
function resetQuOptionType1 (question, quOptions) {
  if (quOptions !==null && quOptions.length>0) {
    quOptions.forEach((quOption, optionIndex) => {
      quOption.dwId = uuidv4()
    })
    parseQuOptionType1(question, quOptions)
  }
}

/**
 * 重置选项的ID，矩阵题的
 * @param question
 * @param quRows
 * @param quCols
 */
function resetMatrixQuOptionType1 (question, quRows, quCols) {
  if (quRows !==null && quRows.length>0) {
    quRows.forEach((quRow, optionIndex) => {
      quRow.dwId = uuidv4()
    })
  }
  if (quCols !==null && quCols.length>0) {
    quCols.forEach((quCol, optionIndex) => {
      quCol.dwId = uuidv4()
    })
  }
}

/**
 * 初始化工具栏组件模板时会调用
 * @param question
 */
export function buildMatrixOption (question) {
  const quType = question.quType
  if (quType==='MATRIX_RADIO' || quType === 'MATRIX_CHECKBOX' || quType === 'MATRIX_INPUT' || quType==='MATRIX_SCALE' || quType === 'MATRIX_SLIDER') {
    if (!question.hasOwnProperty('quRows') || question.quRows===null || question.quRows.length===0) {
      const quRows = []
      for (let i=0; i<3; i++) {
        const quOption = {dwId: uuidv4(), optionTitleObj: {dwHtml: `行选项${i}`, dwText: `行选项${i}`, dwPlaceholder: '请输入选项内容'}}
        if (quType==='MATRIX_SCALE' || quType === 'MATRIX_SLIDER') {
          quOption.lr = {
            left: {optionTitleObj: {dwHtml: `极不可能`, dwText: `不可能`, dwPlaceholder: '请输入选项内容'}},
            right: {optionTitleObj: {dwHtml: `极有可能`, dwText: `极有可能`, dwPlaceholder: '请输入选项内容'}}
          }
        }
        quRows.push(quOption)
      }
      question.quRows = quRows
    }
  }
  if (quType==='MATRIX_RADIO' || quType === 'MATRIX_CHECKBOX' || quType === 'MATRIX_INPUT') {
    if (!question.hasOwnProperty('quCols') || question.quCols===null || question.quCols.length===0) {
      const quCols = [{dwId: uuidv4(), optionTitleObj: {dwHtml: '', dwText: '', dwPlaceholder: ''}, scoreNum: null, tempEmptyOption: true}] // tempEmptyOption 表示不是真实选项，用于显示列时保证列数多一列。
      for (let i=0; i<3; i++) {
        const quOption = {dwId: uuidv4(), optionTitleObj: {dwHtml: `列选项${i}`, dwText: `列选项${i}`, dwPlaceholder: '请输入选项内容'}, scoreNum: null, tempEmptyOption: false}
        quCols.push(quOption)
      }
      question.quCols = quCols
    }
    buildMatrixQuRowCols(question)
  }
}

// 如果SurveyJson没有，则从结构化的数据中取问卷数据。
// 编辑的时候只保存JSON结构副本，直到发布好一步才生成结构化数据。
// 发布时保存的方案，结构化数据提交到数据库，如果有ID则更新对应的数据，如果没有ID，则新增，同时把最新的结构化数据返回。
// 对于新增在保存的时候需要进行生复判断，防止生成重复数据。
// 对于已经删除的数据，如果同步呢，删除的时候真删除，直接调用后台删除功能。

/*
      <div>{{ item.optionTitleObj.dwText }}</div>
          <el-tooltip class="item" effect="dark" content="排序选项" placement="top">
            <div class="dw-question-toolbar dw-margin-right-10"><i class="dwMoveSortQuOption dw-cursor-pointer dw-event-color el-icon-rank" aria-hidden="true"></i></div>
          </el-tooltip>
 */
/**
 * 1、编辑器工具栏通过布置并从后台返回工具信息 OK
 * 2.0、编辑器问卷基本属性配置 OK
 * 2.1、模板库通过后台返回 OK
 * 2.2、右边题库拖入效果优化 OK
 * 2.3、完善拖动的预览效果 OK
 * 2.4、拖动后index层改变的问题 OK
 * 2.5、编辑器加导航菜单 OK
 * 2.6、编辑器中逻辑配置 OK
 * 2.7、配置各题逻辑 OK
 * 2.8  保存编辑结果，并发布问卷 OK
 * 2.9（编辑时只保存JSON数据，发布时：根据之前的保存的JSON，进行结构化，实现与之前版本兼容(如果需求则进行转换)）
 * 2.10 编辑，答卷都使用最新的JSON数据直接展现。 OK
 * 2.11 简化JSON，编辑保存时对数据进行简化，去掉编辑中保留的一些辅助信息。如题目option选项，统一处理不再分到不同字段上面。如果是原始转化成最新的JSON，最新的也可以转化成原始的，实现双向转换 ？
 * 2.11.1 简化JSON，保存时把在新版本中没有使用的字段去掉。
 * 2.12 结构化数据只在统计页面使用。
 * 2.13 JSON数据中加一个新字段辅助UUID，在前端生成并用于数据KEY，跟后端数据ID不是同一个作用。（对JSON数据格式化的时候统一生成） OK
 * 2.14 完成答卷页面 OK
 * 2.15 答卷表单基本验证 OK
 * 2.17 需要考虑答卷页主题修改的便利性
 * 3、发布问卷并保存 OK
 * 4、回答问卷并保存答案 ?
 * 4.1、整合ES，并完成统计操作
 * 4.2、定义ES索引结构
 * 4.3、数据保存ID的处理，让ES自动生成ID。
 * 5、完善基础版本编辑器未完成的功能
 * 6、升级编辑器与企业版目前提供的功能同步
 * 修改数据结构，把QuOption合并到一起
 * 业务系统内dwId使用V4生成，es document使用自己生成的ID。
 * 如果更新，则先删除之前的document, 再更新。
 * 插入前先查询是否已经同步过，即对应的answerDwId有没有对应的值。
 */
