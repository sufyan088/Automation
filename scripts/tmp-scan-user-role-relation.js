const { chromium } = require('playwright');
const { loadRuntimeData } = require('../helpers/iteration-matrix/dataLoader.js');
const { loginAsAdmin } = require('../helpers/iteration-matrix/auth.js');

async function openFirstMenuAndEdit(row) {
  await row.getByRole('button', { name: /Open menu/i }).click();
  const editItem = row.page().getByRole('menuitem', { name: /Edit User Details/i }).first();
  await editItem.click();
}

(async () => {
  const data = loadRuntimeData();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await loginAsAdmin(page, data);
  await page.getByRole('link', { name: /^Admin$/ }).click();
  await page.getByRole('heading', { name: /User Management/i }).waitFor();

  const rows = page.locator('tbody tr');
  const count = await rows.count();
  const sampleCount = Math.min(count, 6);
  const results = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const row = rows.nth(index);
    const rowText = ((await row.textContent()) || '').trim().replace(/\s+/g, ' ');
    await openFirstMenuAndEdit(row);
    await page.getByRole('heading', { name: /Edit User/i }).waitFor();

    const texts = await page.locator('h1, h2, h3, label, p, button, [role="combobox"], input').evaluateAll((nodes) =>
      nodes.map((node) => ({
        text: (node.textContent || '').trim(),
        placeholder: node.getAttribute('placeholder') || '',
        role: node.getAttribute('role') || '',
        name: node.getAttribute('name') || '',
        type: node.getAttribute('type') || ''
      }))
    );

    const hasSearchUserRoles = texts.some((item) => /search user roles/i.test(item.text) || /search user roles/i.test(item.placeholder));
    const hasAssign = texts.some((item) => /assign selected roles/i.test(item.text));
    const hasUnassign = texts.some((item) => /unassign selected roles/i.test(item.text));
    const roleLabels = texts
      .map((item) => item.text)
      .filter((text) => /role/i.test(text) || /assign selected roles/i.test(text) || /unassign selected roles/i.test(text))
      .slice(0, 20);

    results.push({
      index,
      rowText,
      hasSearchUserRoles,
      hasAssign,
      hasUnassign,
      roleLabels
    });

    const backToList = page.getByRole('link', { name: /Back to users list/i }).first();
    if (await backToList.isVisible().catch(() => false)) {
      await backToList.click();
    } else {
      await page.goBack();
    }
    await page.getByRole('heading', { name: /User Management/i }).waitFor();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
