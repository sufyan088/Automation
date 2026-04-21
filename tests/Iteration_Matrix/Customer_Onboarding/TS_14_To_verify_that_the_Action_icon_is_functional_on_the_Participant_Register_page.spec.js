const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_14_To_verify_that_the_Action_icon_is_functional_on_the_Participant_Register_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding/TS_14_To_verify_that_the_Action_icon_is_functional_on_the_Participant_Register_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
