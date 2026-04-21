const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_23_To_verify_that_the_comments_can_be_added_in_the_comments_section_on_the_viewing_payment_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Remittance_Management/TS_23_To_verify_that_the_comments_can_be_added_in_the_comments_section_on_the_viewing_payment_page.ds"
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
