const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaOpthalmHelpers
} = require('./_shared');

test("To_Verify_That_Examination_Data_Should_Be_Displayed_In_Ophthalm_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Opthalm/To_Verify_That_Examination_Data_Should_Be_Displayed_In_Ophthalm_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Register the participant and open the Examination list', async () => {
    await campServerIndiaOpthalmHelpers.routeParticipantToExamination(page, data);
  });

  await test.step('Search the participant in Examination and open the record', async () => {
    await campServerIndiaOpthalmHelpers.searchCreatedParticipantInExamination(page, data);
  });

  await test.step('Fill the Examination form and go to the Opthalm page', async () => {
    await campServerIndiaOpthalmHelpers.completeReferralExaminationForOpthalm(page, data);
    await campServerIndiaOpthalmHelpers.openModule(page);
  });

  await test.step('Verify that the Examination data is displayed in the Opthalm page', async () => {
    await campServerIndiaOpthalmHelpers.assertExaminationDataInOpthalmPage(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
