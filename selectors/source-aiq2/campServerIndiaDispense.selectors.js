const campServerIndiaDispenseSelectors = {
  dispenseLink: 'a[href="dispatch.php"], a:has-text("Dispense")',
  pageHeading: 'nav a.navbar-brand b, nav b, .navbar-brand b',
  sourceTable: '#Source_data table, #Source_data, table',
  participantCells: '#Source_data td, [onclick*="dispatch.php"], [onclick*="dispatchedit.php"], [onclick*="dispatchedit.php"], td',
  nextButton: '#btnNext, button[name="btnNext"], button:has-text("Next")',
  backButton: '#btnBack, button[name="btnBack"], button:has-text("Back")',
  finishButton: '#btnFinish, button[name="btnFinish"], button:has-text("Finish")',
  toastMessages: '#toast-container .toast .toast-title, #toast-container .toast .toast-message',
  step1: '#step1',
  step2: '#step2',
  step4: '#step4',
  notTakingReasonSelect: '#de_dis_rejectreason, select[name="de_dis_rejectreason"]',
  notTakingOtherTextbox: '#de_dis_rejectothers, input[name="de_dis_rejectothers"]',
  frameModelField: '#de_dis_framemodel, input[name="de_dis_framemodel"]',
  frameColorSelect: '#de_dis_framecolor, select[name="de_dis_framecolor"]',
  tasselSelect: '#de_dis_tesseldesc, select[name="de_dis_tesseldesc"]',
  frameTypeSelect: '#de_dis_frametype, select[name="de_dis_frametype"]',
  caseSelect: '#de_dis_casedesc, select[name="de_dis_casedesc"]',
  selvetSelect: '#de_dis_selvetdesc, select[name="de_dis_selvetdesc"]'
};

module.exports = {
  campServerIndiaDispenseSelectors
};
