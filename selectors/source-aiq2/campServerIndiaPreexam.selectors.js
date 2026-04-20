const campServerIndiaPreexamSelectors = {
  preExamLink: 'a[href="preexam.php"], a:has-text("Pre Exam")',
  examinationLink: 'a[href="examination.php"], a:has-text("Examination")',
  dispenseLink: 'a[href="dispatch.php"], a:has-text("Dispense")',
  pageHeading: 'nav a.navbar-brand b, nav b, .navbar-brand b',
  listContainer: '#navbars, table, tbody',
  participantCells: 'td, [onclick*="preexamedit.php"]',
  nextButton: '#btnNext, button[name="btnNext"], button:has-text("Next")',
  finishButton: '#btnFinish, button[name="btnFinish"], button:has-text("Finish")',
  diagnosisSection: '#step3',
  diagnosisCheckboxLabels: '#step3 label.toggle, #step3 label.toggle.ms-4',
  otherIssuesTextbox: '#de_exa_diagnosisoiothers, input[name="de_exa_diagnosisoiothers"]',
  examinationStationButton: '#step3 span:text-is("Examination"), #step3 button:has-text("Examination")',
  dispenseStationButton: '#step3 span:text-is("Dispense"), #step3 button:has-text("Dispense")',
  successDialog: '#divPreExaSuccess',
  successMessage: '#lblLine1, #divPreExaSuccess p, #divPreExaSuccess',
  closeMessageButton: '#divPreExaSuccess button:has-text("Close Message"), #divPreExaSuccess button',
  toastMessages: '#toast-container .toast .toast-title, #toast-container .toast .toast-message'
};

module.exports = {
  campServerIndiaPreexamSelectors
};
