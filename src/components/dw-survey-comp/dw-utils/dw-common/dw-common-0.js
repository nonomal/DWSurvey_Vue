
/**
 * 统一本地存储对于key名称处理
 * @param surveyId
 * @param type
 * @returns {null}
 */
export function buildSurveyLocalStorageKey (surveyId, type) {
  const storageKey = `${surveyId}_${type}`
  // console.debug('storageKey', storageKey)
  return storageKey
}

/**
 * 将json对象保存到本地存储
 * @param storageKey
 * @param jsonValue
 */
export function saveJsonObj2LocalStorage (storageKey, jsonValue) {
  localStorage.setItem(storageKey, JSON.stringify(jsonValue))
}

export function getLocalStorageByKey (storageKey) {
  return localStorage.getItem(storageKey)
}

export function getLocalStorageByKeyword (storageKeyword) {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.includes(storageKeyword)) {
      keys.push(key)
    }
  }
  return keys
}
