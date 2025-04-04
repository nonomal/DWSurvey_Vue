export default {
  /**  账号密码登录登出  **/
  loginIn: `/api/dwsurvey/anon/security-token/login.do`,
  loginInPwd: `/api/dwsurvey/anon/security/login-pwd.do`,
  loginWxQrCode: `/api/dwsurvey/anon/security/wx-login-qrcode.do`,
  loginWxStatus: `/api/dwsurvey/anon/security/login-weixin.do`,
  loginSendSms: `/api/dwsurvey/anon/security/send-smscode.do`,
  register: `/api/dwsurvey/anon/security//register.do`,

  logOut: `/api/dwsurvey/anon/security/logout.do`,
  /** 问卷数据  **/
  surveyList: `/api/dwsurvey/app/survey/list.do`,
  surveyInfo: `/api/dwsurvey/app/survey/info.do`,
  surveyUpdate: `/api/dwsurvey/app/survey/survey-base-attr.do`,
  surveyCreate: `/api/dwsurvey/app/survey/add.do`,
  surveyUpState: `/api/dwsurvey/app/survey/up-survey-status.do`,
  surveyCopy: `/api/dwsurvey/app/survey/copy.do`,
  surveyDelete: `/api/dwsurvey/app/survey/delete.do`,
  surveyReport: `/api/dwsurvey/app/stats/report.do`,
  surveyAnswerList: `/api/dwsurvey/app/answer/list.do`,
  surveyAnswerInfo: `/api/dwsurvey/app/answer/info.do`,
  surveyAnswerExport: `/api/dwsurvey/app/answer/export-xls.do`,
  surveyAnswerDelete: `/api/dwsurvey/app/answer/delete.do`,
  surveyFooterInfo: `/api/dwsurvey/anon/web/footer-info.do`,
  adminUserList: `/api/dwsurvey/admin/user/list.do`,
  adminUserCreate: `/api/dwsurvey/admin/user/add.do`,
  adminUserUpdate: `/api/dwsurvey/admin/user/edit.do`,
  adminUserDelete: `/api/dwsurvey/admin/user/delete.do`,
  curUserInfo: `/api/dwsurvey/app/user/currentUser.do`,
  curUserPwdUpdate: `/api/dwsurvey/app/user/up-pwd.do`
}
