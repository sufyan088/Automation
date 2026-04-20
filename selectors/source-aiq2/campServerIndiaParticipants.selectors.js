const campServerIndiaParticipantsSelectors = {
  homeLink: 'a[href="home.php"], a:has-text("Home")',
  participantsLink: 'a[href="patients.php"], a:has-text("Participants")',
  pageHeading: 'nav a.navbar-brand b, nav b, .navbar-brand b',
  pageHeadingText: 'b:has-text("Participants"), .navbar-brand b:has-text("Participants")',
  searchDateField: 'form input[type="date"], form input[value*="-"]',
  searchButton: 'button:has-text("Search"), button[name="btnSearch"], #btnSearch',
  sourceTable: '#Source_data table, #Source_data',
  participantCells: '#Source_data td, td, [onclick*="patientview.php"]',
  participantDetailUrl: /patientview\.php/i,
  projectCodeValue: 'xpath=//*[self::b or self::strong][contains(normalize-space(),"Project Code")]/ancestor::div[contains(@class,"row")][1]//*[contains(@class,"col-sm-9")][1]',
  preScreeningHeaderIcon: '#Source_data thead img[src*="prescreening-black"]',
  examinationHeaderIcon: '#Source_data thead img[src*="examination-black"]',
  ophthalmHeaderIcon: '#Source_data thead img[src*="doctor-black"]',
  dispenseHeaderIcon: '#Source_data thead img[src*="dispatch-black"]',
  preScreeningSection: 'div.bg-prescreening, div[class*="bg-prescreening"], .row.rowmb18:has-text("Pre-Screening"), div:has(> button:has-text("Unlock")):has-text("Pre-Screening"), div:has(> button:has-text("Edit")):has-text("Pre-Screening")',
  preExamSection: 'div.bg-preexam, div[class*="bg-preexam"], .row.rowmb18:has-text("Pre Exam"), .row.rowmb18:has-text("Pre Examination"), div:has(> button:has-text("Unlock")):has-text("Pre Exam"), div:has(> button:has-text("Unlock")):has-text("Pre Examination"), div:has(> button:has-text("Edit")):has-text("Pre Exam"), div:has(> button:has-text("Edit")):has-text("Pre Examination")',
  examinationSection: 'div.bg-examination, div[class*="bg-examination"], .row.rowmb18:has-text("Examination"), div:has(> button:has-text("Unlock")):has-text("Examination"), div:has(> button:has-text("Edit")):has-text("Examination")',
  ophthalmSection: 'div.bg-ophthalm, div.bg-opthalm, div.bg-doctor, div[class*="bg-oph"], div[class*="bg-doctor"], .row.rowmb18:has-text("Ophthalm"), .row.rowmb18:has-text("Opthalm")',
  dispenseSection: 'div.bg-dispense, div[class*="bg-dispense"], .row.rowmb18:has-text("Dispense"), div:has(> button:has-text("Unlock")):has-text("Dispense"), div:has(> button:has-text("Edit")):has-text("Dispense")',
  preScreeningUnlockButton: '#btnPreUnlock, button[name="btnPreUnlock"], button:has-text("Unlock"), a:has-text("Unlock")',
  preExamUnlockButton: '#btnPreExamUnlock, button[name="btnPreExamUnlock"], button:has-text("Unlock"), a:has-text("Unlock")',
  examinationUnlockButton: '#btnExaUnlock, button[name="btnExaUnlock"], button:has-text("Unlock"), a:has-text("Unlock")',
  dispenseUnlockButton: '#btnDisUnlock, button[name="btnDisUnlock"], button:has-text("Unlock"), a:has-text("Unlock")',
  preScreeningEditButton: 'button[onclick*="prescreeningedit.php"], a[href*="prescreeningedit.php"]',
  preExamEditButton: 'button[onclick*="preexamedit.php"], a[href*="preexamedit.php"]',
  examinationEditButton: 'button[onclick*="examinationedit.php"], a[href*="examinationedit.php"]',
  sectionEditButton: '#btnEdit, button[name="btnEdit"], button:has-text("Edit")',
  stayHereButton: '#divDialog button:has-text("Stay Here"), #divDialog .btn:has-text("Stay Here")',
  dialogHeading: '#divDialog h4 b, #divDialog b',
  toastMessages: '#toast-container .toast .toast-title, #toast-container .toast .toast-message'
};

module.exports = {
  campServerIndiaParticipantsSelectors
};
