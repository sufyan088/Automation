const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_42_To_verify_the_data_for_the_Credit_Pair_invoices_on _the_duplicates_tracker_page_for_One_positive_one_negative_for_Initial_Run", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicates_Tracker/TS_42_To_verify_the_data_for_the_Credit_Pair_invoices_on _the_duplicates_tracker_page_for_One_positive_one_negative_for_Initial_Run.ds"
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
