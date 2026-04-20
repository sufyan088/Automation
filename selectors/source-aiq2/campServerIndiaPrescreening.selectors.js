const campServerIndiaPrescreeningSelectors = {
  dashboardLink: 'a[href="dashboard.php"], button:has-text("Dashboard")',
  preScreeningLink: 'a[href="prescreening.php"], a:has-text("Pre-Screening")',
  pageHeading: 'nav a.navbar-brand b, nav b, .navbar-brand b',
  listContainer: '#navbars, table, tbody',
  participantCells: 'td, [onclick*="prescreeningedit.php"]',
  complaintsSection: '#step1',
  visionSection: '#step2',
  noComplaintsButton: '#btnNoComplaints',
  nextButton: '#btnNext, button[name="btnNext"]',
  finishButton: '#btnFinish, button[name="btnFinish"]',
  toastMessages: '#toast-container .toast .toast-title, #toast-container .toast .toast-message',
  successDialog: '#divExaSuccess',
  successMessage: '#divExaSuccess p, #divExaSuccess',
  closeMessageButton: '#divExaSuccess button:has-text("Close Message"), #divExaSuccess button',
  distanceVisionRightUnaided: '#de_exa_va_dv_re_unaided',
  distanceVisionLeftUnaided: '#de_exa_va_dv_le_unaided',
  distanceVisionRightGlasses: '#de_exa_va_dv_re_glasses',
  distanceVisionLeftGlasses: '#de_exa_va_dv_le_glasses',
  nearVisionRightUnaided: '#de_exa_va_nv_re_unaided',
  nearVisionLeftUnaided: '#de_exa_va_nv_le_unaided',
  nearVisionRightGlasses: '#de_exa_va_nv_re_glasses',
  nearVisionLeftGlasses: '#de_exa_va_nv_le_glasses',
  headacheEyeStrainNa: '#de_exa_na_complaint1',
  blurredVisionNa: '#de_exa_na_complaint2',
  painRednessNa: '#de_exa_na_complaint3',
  wateringDischargeNa: '#de_exa_na_complaint4',
  swellingNa: '#de_exa_na_complaint6'
};

module.exports = {
  campServerIndiaPrescreeningSelectors
};
