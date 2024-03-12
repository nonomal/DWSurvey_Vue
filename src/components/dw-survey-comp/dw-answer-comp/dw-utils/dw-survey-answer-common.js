import {dwSurveyJsonBySurveyId} from '../api/dw-survey-answer'
import {parseSurvey} from '../../dw-utils/dw-survey-parse'

/**
 * 根据SurveyId 取 surveyJson
 * @param params
 * @param successCallback
 * @param noJsonCallback
 */
export function getSurveyAnswerJsonBySurveyId (params, successCallback, noJsonCallback) {
  // 先看看有没有JSON，有就取JSON数据。没有再取原来的Survey结构数据进行转换
  dwSurveyJsonBySurveyId(params).then((response) => {
    console.debug('surveyJsonBySurveyId', response)
    const httpResult = response.data
    if (httpResult.resultCode === 200) {
      const surveyAnswerResult = httpResult.data
      if (surveyAnswerResult.hasOwnProperty('answerCheckResult') && surveyAnswerResult.hasOwnProperty('surveyJson')) {
        const answerCheckResult = surveyAnswerResult.answerCheckResult
        const surveyJson = surveyAnswerResult.surveyJson
        if (surveyJson!==null && surveyJson.hasOwnProperty('surveyJsonText') && surveyJson.surveyJsonText !== null && surveyJson.surveyJsonText!=='') {
          successCallback(parseSurvey(JSON.parse(surveyJson.surveyJsonText)), answerCheckResult)
        } else {
          noJsonCallback(answerCheckResult)
        }
      }
    }
  })
}
