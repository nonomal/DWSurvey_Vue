export function dwSurveyQuAddOption (survey, index, quOption) {
  /*
  // 从组件中抽取的原代码片段备注
  const quType = this.survey.questions[this.index].quType
  // const quOption = {id: null, optionTitleObj: {dwHtml: '', dwText: '', dwPlaceholder: '请输入内容'}, itemClick: false}
  if (quType === 'RADIO') {
    const quOptions = this.survey.questions[this.index].quRadios
    quOptions.push(quOption)
    this.survey.questions[this.index].quRadios = quOptions
  } else if (quType === 'CHECKBOX') {
    const quOptions = this.survey.questions[this.index].quCheckboxs
    quOptions.push(quOption)
    this.survey.questions[this.index].quCheckboxs = quOptions
  }
  console.debug('question', this.survey.questions[this.index])
  */
  const quType = survey.questions[index].quType
  // const quOption = {id: null, optionTitleObj: {dwHtml: '', dwText: '', dwPlaceholder: '请输入内容'}, itemClick: false}
  if (quType === 'RADIO') {
    const quOptions = survey.questions[index].quRadios
    quOptions.push(quOption)
    survey.questions[index].quRadios = quOptions
  } else if (quType === 'CHECKBOX') {
    const quOptions = survey.questions[index].quCheckboxs
    quOptions.push(quOption)
    survey.questions[index].quCheckboxs = quOptions
  }
  console.debug('question', survey.questions[index])
  return survey
}

/**
 * 重置对应题目选项，一般用于清空选项重新设置时。
 * @param survey
 * @param index
 * @param callback
 */
export function dwResetQuOptions (survey, index, callback) {
  // 进行重置
  const quType = survey.questions[index].quType
  if (quType === 'RADIO') survey.questions[index].quRadios = []
  else if (quType === 'CHECKBOX') survey.questions[index].quCheckboxs = []
  else if (quType === 'SCORE') survey.questions[index].quOrderbys = []
  callback(survey)
}

/**
 * 将对应的题目选项转换成回车分隔的纯文本，对于可能有html标签的题目选项不合适。
 * @param survey
 * @param index
 * @returns {string}
 */
export function dwOption2Texts (survey, index) {
  const quType = survey.questions[index].quType
  let quOptions = []
  if (quType === 'RADIO') quOptions = survey.questions[index].quRadios
  else if (quType === 'CHECKBOX') quOptions = survey.questions[index].quCheckboxs
  let optionText = ''
  quOptions.forEach((item, index) => {
    optionText += item.optionTitleObj.dwText + '\r\n'
  })
  return optionText
}
