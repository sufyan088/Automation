const { test, loadRuntimeData, loginAsAdmin, closeSession, runConvertedFlow } = require('./_shared');

test("TS_29_To_verify_when_hovering_over_statement_filename_will_appear_and_you_can_have_ability_to_copy", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Dashboard/TS_29_To_verify_when_hovering_over_statement_filename_will_appear_and_you_can_have_ability_to_copy.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await runConvertedFlow(page, data);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
