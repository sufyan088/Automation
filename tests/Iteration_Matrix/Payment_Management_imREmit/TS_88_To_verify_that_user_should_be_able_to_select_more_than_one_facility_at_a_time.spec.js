const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_88_To_verify_that_user_should_be_able_to_select_more_than_one_facility_at_a_time", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Payment_Management_imREmit/TS_88_To_verify_that_user_should_be_able_to_select_more_than_one_facility_at_a_time.ds"
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
