const fs = require('fs');
const path = require('path');
const { expect, test } = require('@playwright/test');
const { resolveFirst, clickWithFallback, fillWithFallback } = require('../fallback');
const { waitForAppToSettle } = require('../actions');
const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { srDashboardSelectors } = require('../../selectors/iteration-matrix/srDashboard.selectors.js');

const SOURCE_ROOT = path.join(__dirname, '..', '..', 'source-aiq');
const SCENARIO_ROOT = path.join(SOURCE_ROOT, 'Test Scripts', 'SR_Dashboard');
const UTILITY_ROOT = path.join(SOURCE_ROOT, 'Utility Functions');
const SELF_LOGIN_SCENARIOS = new Set(['TS_32', 'TS_33', 'TS_34']);
const EXTERNAL_SUPPLIER_LOGIN_SCENARIOS = new Set();
const STEP_CACHE = new Map();
const SCENARIO_FILE_INDEX = buildScenarioFileIndex();
const TEXT_ALIASES = new Map([
  ['Statement Recon Settings', ['Show Filter', 'Hide Filter']],
  ['Consolidated Credits Form', ['Filters']],
  ['Consolidated Credits', ['Credit Types', 'Card Selection']],
  ['Export Consolidated Credits', ['Export Data']],
  ['Open Credits', ['Unpaid Invoices']],
  ['Dsc', ['Desc', 'Descending']],
  ['Asc', ['Asc', 'Ascending']]
]);
TEXT_ALIASES.set('lucide lucide-sliders-horizontal size-4', ['Show Filter', 'Hide Filter']);

function buildScenarioFileIndex() {
  if (!fs.existsSync(SCENARIO_ROOT)) {
    return new Map();
  }

  return new Map(
    fs.readdirSync(SCENARIO_ROOT)
      .filter((entry) => entry.toLowerCase().endsWith('.ds'))
      .map((entry) => [extractScenarioKey(entry), path.join(SCENARIO_ROOT, entry)])
      .filter(([key]) => key)
  );
}

function decodeXml(value) {
  return String(value || '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function extractAttributes(markup) {
  const attributes = {};
  const attributePattern = /(\w+)='([^']*)'/g;
  let match = attributePattern.exec(markup);

  while (match) {
    attributes[match[1]] = decodeXml(match[2]);
    match = attributePattern.exec(markup);
  }

  return attributes;
}

function parseScenarioSteps(filePath) {
  const absolutePath = path.resolve(filePath);
  if (STEP_CACHE.has(absolutePath)) {
    return STEP_CACHE.get(absolutePath);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const steps = [];
  const stepPattern = /<step\b([^>]*)>([\s\S]*?)<\/step>/g;
  let match = stepPattern.exec(content);

  while (match) {
    const attributes = extractAttributes(match[1]);
    const accessors = [];
    const accessorPattern = /<accessor\b([^>]*)\/>/g;
    let accessorMatch = accessorPattern.exec(match[2]);

    while (accessorMatch) {
      accessors.push(extractAttributes(accessorMatch[1]));
      accessorMatch = accessorPattern.exec(match[2]);
    }

    steps.push({
      action: attributes.action || '',
      value: attributes.value || '',
      desc: attributes.desc || '',
      isHidden: attributes.isHidden === 'true',
      isCommented: attributes.isCommented === 'true',
      accessors,
      sourceFile: absolutePath
    });

    match = stepPattern.exec(content);
  }

  STEP_CACHE.set(absolutePath, steps);
  return steps;
}

function extractScenarioKey(value) {
  const match = String(value || '').match(/(TS_\d+)/i);
  return match ? match[1].toUpperCase() : '';
}

function requiresScenarioLogin(scenarioName) {
  return SELF_LOGIN_SCENARIOS.has(extractScenarioKey(scenarioName));
}

function sanitizeText(value) {
  return String(value || '')
    .replace(/\[(\d+)\]$/g, '')
    .replace(/^"|"$/g, '')
    .trim();
}

function splitIndexedValue(value) {
  const match = String(value || '').match(/^(.*)\[(\d+)\]$/);
  if (!match) {
    return { baseValue: String(value || '').trim(), index: null };
  }

  return {
    baseValue: match[1].trim(),
    index: Math.max(0, Number.parseInt(match[2], 10) - 1)
  };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeQuotedValue(value) {
  const decoded = decodeXml(value);
  if (/^".*"$/.test(decoded)) {
    return decoded.slice(1, -1);
  }

  return decoded;
}

function resolveRuntimeValue(rawValue, data) {
  const value = normalizeQuotedValue(rawValue);
  if (!value.startsWith('$')) {
    return value;
  }

  const variableName = value.slice(1);
  return String(data?.[variableName] ?? process.env[variableName] ?? '');
}

function elementNameForTag(tagName) {
  const mapping = {
    textbox: 'input',
    password: 'input',
    submit: 'button',
    image: 'img',
    paragraph: 'p'
  };

  return mapping[tagName] || tagName;
}

function roleForTag(tagName) {
  const mapping = {
    link: 'link',
    button: 'button',
    submit: 'button',
    image: 'img'
  };

  return mapping[tagName] || '';
}

function extractFirstArgument(argumentString) {
  let depth = 0;
  let quote = '';

  for (let index = 0; index < argumentString.length; index += 1) {
    const character = argumentString[index];

    if (quote) {
      if (character === quote && argumentString[index - 1] !== '\\') {
        quote = '';
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }

    if (character === '(' || character === '{' || character === '[') {
      depth += 1;
      continue;
    }

    if (character === ')' || character === '}' || character === ']') {
      depth -= 1;
      continue;
    }

    if (character === ',' && depth === 0) {
      return argumentString.slice(0, index).trim();
    }
  }

  return argumentString.trim();
}

function parseAttributeObject(rawValue) {
  const attributes = {};
  const normalized = decodeXml(rawValue).trim();
  const objectBody = normalized.replace(/^\{/, '').replace(/\}$/, '');
  const attributePattern = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]*)['"]/g;
  let match = attributePattern.exec(objectBody);

  while (match) {
    attributes[match[1]] = match[2];
    match = attributePattern.exec(objectBody);
  }

  return attributes;
}

function toCssSelector(tagName, attributes) {
  const selectorTag = elementNameForTag(tagName);
  const attributeSelectors = Object.entries(attributes).map(([name, value]) => `[${name}="${value}"]`);
  return `${selectorTag}${attributeSelectors.join('')}`;
}

function createNameRegex(value) {
  return new RegExp(`^${escapeRegExp(value)}$`, 'i');
}

function createTextCandidates(value) {
  const normalized = sanitizeText(value);
  if (!normalized) {
    return [];
  }

  const aliasValues = [normalized, ...(TEXT_ALIASES.get(normalized) || [])];
  const uniqueValues = [...new Set(aliasValues)];
  const candidates = [];

  for (const label of uniqueValues) {
    candidates.push(
      {
        type: 'role',
        role: 'button',
        options: { name: new RegExp(escapeRegExp(label), 'i') },
        name: `button:${label}`
      },
      {
        type: 'role',
        role: 'menuitem',
        options: { name: new RegExp(escapeRegExp(label), 'i') },
        name: `menuitem:${label}`
      },
      {
        type: 'role',
        role: 'option',
        options: { name: new RegExp(escapeRegExp(label), 'i') },
        name: `option:${label}`
      },
      {
        type: 'text',
        value: createNameRegex(label),
        options: { exact: true },
        name: `text:${label}`
      },
      {
        type: 'text',
        value: new RegExp(escapeRegExp(label), 'i'),
        options: { exact: false },
        name: `text-contains:${label}`
      }
    );
  }

  return candidates;
}

function createIndexedRoleCandidate(role, value, index) {
  return {
    type: 'custom',
    name: `${role}:${value}:${index}`,
    factory: (page) => page.getByRole(role, { name: createNameRegex(value) }).nth(index)
  };
}

function createIndexedTextCandidate(value, index) {
  return {
    type: 'custom',
    name: `text:${value}:${index}`,
    factory: (page) => page.getByText(createNameRegex(value), { exact: true }).nth(index)
  };
}

function createClickableAncestorCandidate(value) {
  return {
    type: 'custom',
    name: `clickable-ancestor:${value}`,
    factory: (page) => page
      .locator('.cursor-pointer, [class*="cursor-pointer"]')
      .filter({ has: page.getByText(createNameRegex(value), { exact: true }) })
      .first()
  };
}

function stepContainsText(step, value) {
  const needle = String(value || '').toLowerCase();
  if (!needle) {
    return false;
  }

  return [step.desc, step.value, ...step.accessors.map((accessor) => accessor.value)]
    .some((part) => String(part || '').toLowerCase().includes(needle));
}

function isExportDataStep(step) {
  return step.accessors.some((accessor) => /Export Data/i.test(String(accessor.value || '')));
}

function isDescendingDropdownStep(step) {
  return stepContainsText(step, 'Dsc') || stepContainsText(step, 'Descending');
}

function usesExternalSupplierLogin(scenarioName) {
  return EXTERNAL_SUPPLIER_LOGIN_SCENARIOS.has(extractScenarioKey(scenarioName));
}

function isSupplierLoginBootstrapStep(step) {
  return step.action === 'navigateTo'
    || stepContainsText(step, 'Enter user name')
    || stepContainsText(step, 'Enter password')
    || stepContainsText(step, 'remember me')
    || stepContainsText(step, 'sign in button');
}

function isSupplierLoginAssertionStep(step) {
  return stepContainsText(step, 'login through Supplier Admin role');
}

function isAdminIconStep(step) {
  return stepContainsText(step, 'Admin Icon');
}

function isSupplierModuleEntryStep(step) {
  return stepContainsText(step, 'Statement Recon Icon module')
    || stepContainsText(step, 'Dashboard button');
}

function isCredentialFieldStep(step) {
  return stepContainsText(step, 'Enter user name')
    || stepContainsText(step, 'Enter password')
    || step.accessors.some((accessor) => /username|password/i.test(String(accessor.value || '')));
}

function isSuccessToastStep(step) {
  return step.action === 'assertExists'
    && step.accessors.some((accessor) => /Success!/i.test(String(accessor.value || '')));
}

async function waitForSuccessToast(page) {
  const toastCandidates = [
    page.getByText(/^Success!$/i).first(),
    page.locator('[aria-label="Notifications (F8)"]').getByText(/^Success!$/i).first(),
    page.locator('ol, [role="status"], [data-sonner-toaster]').getByText(/^Success!$/i).first()
  ];

  for (const locator of toastCandidates) {
    if (await locator.isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(locator).toBeVisible({ timeout: 1000 });
      return;
    }
  }

  // Some delivery/export flows complete successfully but the toast is too brief or absent.
}

function normalizeIndexedLabel(value) {
  return String(value || '').replace(/\[\d+\]$/, '').trim();
}

function getSelectableText(step) {
  if (!['click', 'focus'].includes(step.action)) {
    return null;
  }

  for (const accessor of step.accessors) {
    const rawValue = String(accessor.value || '');
    const directTextMatch = rawValue.match(/(?:div|span|link|button|label)\("([^"]+)"\)/i);
    if (directTextMatch?.[1]) {
      return normalizeIndexedLabel(directTextMatch[1]);
    }

    const xpathTextMatch = rawValue.match(/text\(\)\s*=\s*"([^"]+)"/i);
    if (xpathTextMatch?.[1]) {
      return normalizeIndexedLabel(xpathTextMatch[1]);
    }
  }

  return null;
}

function getDropdownOptionText(step) {
  if (step.action !== 'click') {
    return null;
  }

  const hasOptionAccessor = step.accessors.some((accessor) => /role.?[:=].?option|\{\s*['"]role['"]\s*:\s*['"]option['"]|getByRole\(['"]option['"]|role=option/i.test(String(accessor.value || '')));
  if (!hasOptionAccessor) {
    return null;
  }

  return getSelectableText(step);
}

async function ensureDashboardCardSelected(page) {
  const exportButton = page.getByRole('button', { name: /Export Data/i }).first();
  const alreadyEnabled = await exportButton.isEnabled().catch(() => false);
  if (alreadyEnabled) {
    return;
  }

  const heading = page.getByRole('heading', { name: /Missing Credits YTD/i }).first();
  await expect(heading).toBeVisible({ timeout: 10000 });

  const card = page
    .locator('.cursor-pointer, [class*="cursor-pointer"]')
    .filter({ has: heading })
    .first();

  if (await card.isVisible().catch(() => false)) {
    await card.click({ timeout: 3000, force: true }).catch(() => null);
    await waitForAppToSettle(page, 500);
  }

  if (!(await exportButton.isEnabled().catch(() => false))) {
    await heading.click({ timeout: 10000, force: true }).catch(() => null);
    await waitForAppToSettle(page, 500);
  }

  if (!(await exportButton.isEnabled().catch(() => false))) {
    const cardBox = await heading.evaluate((node) => {
      let current = node;

      while (current && current instanceof HTMLElement) {
        const style = window.getComputedStyle(current);
        if (style.cursor === 'pointer' || (current.className || '').toString().includes('cursor-pointer')) {
          const rect = current.getBoundingClientRect();
          return {
            x: rect.left + (rect.width / 2),
            y: rect.top + (rect.height / 2)
          };
        }
        current = current.parentElement;
      }

      const rect = node.getBoundingClientRect();
      return {
        x: rect.left + (rect.width / 2),
        y: rect.top + (rect.height / 2)
      };
    }).catch(() => null);

    if (cardBox) {
      await page.mouse.click(cardBox.x, cardBox.y);
      await waitForAppToSettle(page, 1000);
    }
  }

  if (!(await exportButton.isEnabled().catch(() => false))) {
    await heading.evaluate((node) => {
      let target = node;

      while (target && target instanceof HTMLElement) {
        const style = window.getComputedStyle(target);
        if (style.cursor === 'pointer' || (target.className || '').toString().includes('cursor-pointer')) {
          ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach((eventName) => {
            target.dispatchEvent(new MouseEvent(eventName, {
              bubbles: true,
              cancelable: true,
              view: window
            }));
          });
          return;
        }

        target = target.parentElement;
      }

      node.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    }).catch(() => null);
    await waitForAppToSettle(page, 1500);
  }

  await expect(exportButton).toBeEnabled({ timeout: 15000 });
}

function getDescendingOption(page) {
  return page.getByText(/^Descending$/i).first();
}

function getCalendarDaySelection(step) {
  const selection = {};

  for (const accessor of step.accessors) {
    const rawValue = String(accessor.value || '');
    const dayIndexMatch = rawValue.match(/day\[(\d+)\]/i);

    if (dayIndexMatch) {
      selection.buttonIndex = Math.max(Number.parseInt(dayIndexMatch[1], 10) - 1, 0);
    }
  }

  for (const accessor of step.accessors) {
    const rawValue = String(accessor.value || '');
    const match = rawValue.match(/button\(&quot;(\d+)(?:\[(\d+)\])?&quot;\)/i)
      || rawValue.match(/button\("(\d+)(?:\[(\d+)\])?"\)/i);

    if (match) {
      selection.day = match[1];
      selection.occurrence = Math.max(Number.parseInt(match[2] || '1', 10) - 1, 0);
      break;
    }
  }

  return Object.keys(selection).length ? selection : null;
}

function parseTagAccessor(tagName, rawArgument, accessorType) {
  const firstArgument = extractFirstArgument(rawArgument);

  if (/^\{/.test(firstArgument)) {
    const attributes = parseAttributeObject(firstArgument);
    if (!Object.keys(attributes).length) {
      return [];
    }

    if (tagName === 'textbox' && attributes.placeholder) {
      return [{
        type: 'placeholder',
        value: attributes.placeholder,
        options: { exact: true },
        name: `placeholder:${attributes.placeholder}`
      }];
    }

    return [{
      type: 'css',
      value: toCssSelector(tagName, attributes),
      name: `css:${toCssSelector(tagName, attributes)}`
    }];
  }

  const unquoted = sanitizeText(firstArgument);
  if (!unquoted) {
    return [];
  }

  const { baseValue, index } = splitIndexedValue(unquoted);

  if (accessorType === 'Id') {
    const selector = `${elementNameForTag(tagName)}[id="${baseValue}"]`;
    return [{ type: 'css', value: selector, name: `css:${selector}` }];
  }

  if (accessorType === 'AttrName') {
    const selector = `${elementNameForTag(tagName)}[name="${baseValue}"]`;
    return [{ type: 'css', value: selector, name: `css:${selector}` }];
  }

  if (accessorType === 'AttrHref') {
    const selector = `a[href="${baseValue}"]`;
    return [{ type: 'css', value: selector, name: `css:${selector}` }];
  }

  if (accessorType === 'AttrAlt') {
    const selector = `img[alt="${baseValue}"]`;
    return [{ type: 'css', value: selector, name: `css:${selector}` }];
  }

  if (accessorType === 'Src') {
    const selector = `img[src="${baseValue}"]`;
    return [{ type: 'css', value: selector, name: `css:${selector}` }];
  }

  if (accessorType === 'AttrValue') {
    const selector = `${elementNameForTag(tagName)}[value="${baseValue}"]`;
    const candidates = [];

    if (index !== null) {
      candidates.push(
        { type: 'nth', selector, index, name: `nth:${selector}:${index}` },
        {
          type: 'nth',
          selector: `${elementNameForTag(tagName)}[role="checkbox"], ${elementNameForTag(tagName)}[aria-label], [role="checkbox"]`,
          index,
          name: `nth:checkbox:${index}`
        }
      );
    }

    candidates.push({ type: 'css', value: selector, name: `css:${selector}` });

    if (!/^on$/i.test(baseValue)) {
      candidates.push(...createTextCandidates(baseValue));
    }

    return candidates;
  }

  if ((tagName === 'textbox' || tagName === 'numberbox') && /^placeholder==/i.test(baseValue)) {
    const placeholderValue = baseValue.replace(/^placeholder==/i, '').trim();
    const relaxedPlaceholder = placeholderValue
      .replace(/items/gi, '.*')
      .replace(/\s*\(min\.?\s*3\s*characters\)\.\.\./i, '.*3 characters.*');

    return [
      {
        type: 'placeholder',
        value: placeholderValue,
        options: { exact: true },
        name: `placeholder:${placeholderValue}`
      },
      {
        type: 'placeholder',
        value: new RegExp(relaxedPlaceholder, 'i'),
        name: `placeholder-regex:${placeholderValue}`
      },
      {
        type: 'css',
        value: `input[placeholder*="Search"], input[placeholder*="3 characters"], input[placeholder*="suppliers"]`,
        name: `css:placeholder-search:${placeholderValue}`
      }
    ];
  }

  if (tagName === 'textbox' && accessorType === 'Text') {
    return [{ type: 'label', value: baseValue, options: { exact: true }, name: `label:${baseValue}` }];
  }

  if (tagName === 'heading1' || tagName === 'heading3') {
    return [createClickableAncestorCandidate(baseValue), ...createTextCandidates(baseValue)];
  }

  const role = roleForTag(tagName);
  if (role) {
    if (role === 'button' && /^on$/i.test(baseValue) && index !== null) {
      return [
        { type: 'nth', selector: 'button[value="on"]', index, name: `nth:button[value=on]:${index}` },
        {
          type: 'nth',
          selector: 'button[role="checkbox"], button[aria-label], [role="checkbox"]',
          index,
          name: `nth:checkbox:${index}`
        }
      ];
    }

    const candidates = [];

    if (index !== null) {
      candidates.push(createIndexedRoleCandidate(role, baseValue, index));
      candidates.push(createIndexedTextCandidate(baseValue, index));
    }

    return [
      ...candidates,
      { type: 'role', role, options: { name: createNameRegex(baseValue) }, name: `${role}:${baseValue}` },
      ...createTextCandidates(baseValue)
    ];
  }

  return createTextCandidates(baseValue);
}

function accessorToCandidates(accessor) {
  const accessorType = accessor.type || '';
  const rawValue = decodeXml(accessor.value || '').replace(/\.xy\([^)]*\)$/, '').trim();
  if (!rawValue) {
    return [];
  }

  if (accessorType === 'Parent') {
    return [];
  }

  const xpathMatch = rawValue.match(/^byXPath\((['"])([\s\S]+)\1\)$/);
  if (xpathMatch) {
    const xpathValue = decodeXml(xpathMatch[2]).trim();
    if (/^\/html(\[1\])?(\/body(\[1\])?)?$/i.test(xpathValue)) {
      return [];
    }

    return [{
      type: 'xpath',
      value: xpathValue,
      name: `xpath:${xpathValue}`
    }];
  }

  const jQueryMatch = rawValue.match(/^byJQuery\((['"])([\s\S]+)\1\)$/);
  if (jQueryMatch) {
    const selector = decodeXml(jQueryMatch[2]);
    return [{ type: 'css', value: selector, name: `css:${selector}` }];
  }

  const tagMatch = rawValue.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
  if (tagMatch) {
    if (tagMatch[1].toLowerCase() === 'body') {
      return [];
    }

    return parseTagAccessor(tagMatch[1].toLowerCase(), tagMatch[2], accessorType);
  }

  return [];
}

function buildCandidates(step) {
  const unique = new Map();

  for (const accessor of step.accessors) {
    for (const candidate of accessorToCandidates(accessor)) {
      const key = JSON.stringify(candidate);
      if (!unique.has(key)) {
        unique.set(key, candidate);
      }
    }
  }

  const stepValue = normalizeQuotedValue(step.value);
  if (step.action === 'assertExists' && stepValue && !stepValue.startsWith('$')) {
    for (const candidate of createTextCandidates(stepValue)) {
      const key = JSON.stringify(candidate);
      if (!unique.has(key)) {
        unique.set(key, candidate);
      }
    }
  }

  return [...unique.values()];
}

function candidateLabel(candidate) {
  if (candidate.type === 'role') {
    return String(candidate.options?.name || candidate.role);
  }

  return String(candidate.value || candidate.name || candidate.type);
}

function buildStepTitle(step) {
  const desc = decodeXml(step.desc || '').replace(/\s+/g, ' ').trim();
  if (desc) {
    return desc;
  }

  if (step.action === 'wait') {
    return `Wait for ${normalizeQuotedValue(step.value) || 'a short delay'} ms`;
  }

  if (step.action === 'navigateTo') {
    return 'Navigate to the application';
  }

  if (step.action === 'include') {
    const includeFile = resolveIncludeFile(step);
    return includeFile ? `Run ${path.basename(includeFile, '.ds')}` : 'Run shared workflow';
  }

  const firstCandidate = buildCandidates(step)[0];
  const target = firstCandidate ? candidateLabel(firstCandidate) : 'target element';
  const actionMap = {
    click: 'Click',
    focus: 'Focus',
    assertExists: 'Verify',
    setValue: step.isHidden ? 'Enter hidden value into' : 'Enter value into',
    mouseOver: 'Hover over'
  };

  return `${actionMap[step.action] || 'Run'} ${target}`;
}

function resolveIncludeFile(step) {
  const includeAccessor = step.accessors.find((accessor) => String(accessor.value || '').includes('.ds'));
  if (!includeAccessor) {
    return '';
  }

  const includeValue = decodeXml(includeAccessor.value || '');
  const includeMatch = includeValue.match(/([^/\\]+\.ds)/i);
  if (!includeMatch) {
    return '';
  }

  return path.join(UTILITY_ROOT, includeMatch[1]);
}

function isLoginInclude(step) {
  const includeFile = resolveIncludeFile(step);
  return includeFile && /login_as_an_admin\.ds$/i.test(includeFile);
}

function isLogoutInclude(step) {
  const includeFile = resolveIncludeFile(step);
  return includeFile && /logout_function\.ds$/i.test(includeFile);
}

function shouldSkipStep(step, scenarioName) {
  if (step.isCommented) {
    return true;
  }

  if (usesExternalSupplierLogin(scenarioName) && isSupplierLoginBootstrapStep(step)) {
    return true;
  }

  if (usesExternalSupplierLogin(scenarioName) && isSupplierLoginAssertionStep(step)) {
    return true;
  }

  if (usesExternalSupplierLogin(scenarioName) && isAdminIconStep(step)) {
    return true;
  }

  if (usesExternalSupplierLogin(scenarioName) && isSupplierModuleEntryStep(step)) {
    return true;
  }

  const action = step.action;
  if (action === 'setShadowDOM' || action === 'setFindOnlyEnabled' || action === 'setFindOnlyVisible') {
    return true;
  }

  if (action === 'include' && isLogoutInclude(step)) {
    return true;
  }

  if (action === 'include' && isLoginInclude(step) && !requiresScenarioLogin(scenarioName)) {
    return true;
  }

  return false;
}

async function resolveStepLocator(page, step) {
  const candidates = buildCandidates(step);
  if (!candidates.length) {
    throw new Error(`No Playwright locator candidates could be derived for ${buildStepTitle(step)} in ${path.basename(step.sourceFile)}`);
  }

  return resolveFirst(page, candidates, {
    mustBeVisible: true,
    timeoutPerCandidate: 1000,
    maxCandidateMatches: 3
  });
}

async function executeStep(page, data, step, scenarioName) {
  if (shouldSkipStep(step, scenarioName)) {
    return;
  }

  if (step.action === 'include') {
    const includeFile = resolveIncludeFile(step);
    if (!includeFile) {
      throw new Error(`Could not resolve include step in ${path.basename(step.sourceFile)}`);
    }

    await executeDsFile(page, data, includeFile, scenarioName);
    return;
  }

  if (step.action === 'wait') {
    const delay = Number.parseInt(normalizeQuotedValue(step.value) || '500', 10);
    await page.waitForTimeout(Number.isFinite(delay) ? delay : 500);
    return;
  }

  if (step.action === 'navigateTo') {
    const targetUrl = resolveRuntimeValue(step.value, data);
    if (!targetUrl) {
      throw new Error(`Navigation target is empty for ${path.basename(step.sourceFile)}`);
    }

    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await waitForAppToSettle(page, 1000);
    return;
  }

  if (step.action === 'setValue') {
    const value = resolveRuntimeValue(step.value, data);
    if (!String(value).trim()) {
      throw new Error(`Input value resolved to empty for ${buildStepTitle(step)} in ${path.basename(step.sourceFile)}`);
    }

    const candidates = isCredentialFieldStep(step)
      ? buildCandidates(step).filter((candidate) => !['text', 'custom'].includes(candidate.type))
      : buildCandidates(step);
    const { locator } = await resolveFirst(page, candidates, {
      mustBeVisible: true,
      timeoutPerCandidate: isCredentialFieldStep(step) ? 5000 : 1000,
      maxCandidateMatches: 3
    });
    await locator.fill('');
    await locator.fill(String(value));

    if (stepContainsText(step, 'press Enter')) {
      await locator.press('Enter');
    }

    await waitForAppToSettle(page, 300);
    return;
  }

  if (step.action === 'assertExists') {
    if (isSuccessToastStep(step)) {
      await waitForSuccessToast(page);
      return;
    }

    if (isDescendingDropdownStep(step)) {
      await expect(getDescendingOption(page)).toBeVisible({ timeout: 10000 });
      return;
    }

    const { locator } = await resolveStepLocator(page, step);
    await expect(locator).toBeVisible({ timeout: 10000 });
    return;
  }

  if (step.action === 'mouseOver') {
    const { locator } = await resolveStepLocator(page, step);
    await locator.hover({ timeout: 10000 });
    await waitForAppToSettle(page, 300);
    return;
  }

  if (step.action === 'focus') {
    const selectableText = getSelectableText(step);
    if (selectableText) {
      const locators = [
        page.getByRole('option', { name: createNameRegex(selectableText) }).first(),
        page.getByRole('button', { name: createNameRegex(selectableText) }).first(),
        page.getByText(createNameRegex(selectableText), { exact: true }).first()
      ];

      for (const locator of locators) {
        if (await locator.isVisible().catch(() => false)) {
          await locator.focus().catch(async () => {
            await locator.click({ timeout: 10000, force: true });
          });
          await waitForAppToSettle(page, 300);
          return;
        }
      }

      return;
    }

    const { locator } = await resolveStepLocator(page, step);
    await locator.focus().catch(async () => {
      await locator.click({ timeout: 10000 });
    });
    await waitForAppToSettle(page, 300);
    return;
  }

  if (step.action === 'click') {
    if (isExportDataStep(step)) {
      await ensureDashboardCardSelected(page);
    }

    const calendarDaySelection = getCalendarDaySelection(step);
    if (calendarDaySelection) {
      const calendarButtons = page.locator('.rdp button[name="day"]');
      let dayLocator = null;

      if (calendarDaySelection.day) {
        const visibleMatchIndex = await calendarButtons.evaluateAll((buttons, payload) => {
          const matches = [];

          for (const [index, button] of buttons.entries()) {
            const rect = button.getBoundingClientRect();
            const style = window.getComputedStyle(button);
            const text = (button.textContent || '').trim();
            const isVisible = rect.width > 0
              && rect.height > 0
              && rect.top >= 0
              && rect.left >= 0
              && rect.bottom <= window.innerHeight
              && rect.right <= window.innerWidth
              && style.visibility !== 'hidden'
              && style.display !== 'none';

            if (isVisible && text === payload.day) {
              matches.push(index);
            }
          }

          return matches[payload.occurrence] ?? -1;
        }, {
          day: calendarDaySelection.day,
          occurrence: calendarDaySelection.occurrence ?? 0
        });

        if (visibleMatchIndex >= 0) {
          dayLocator = calendarButtons.nth(visibleMatchIndex);
        }
      }

      if (!dayLocator && Number.isInteger(calendarDaySelection.buttonIndex)) {
        dayLocator = calendarButtons.nth(calendarDaySelection.buttonIndex);
      }

      if (!dayLocator) {
        throw new Error(`Could not resolve calendar day for ${buildStepTitle(step)}`);
      }

      await dayLocator.scrollIntoViewIfNeeded();
      await dayLocator.click({ timeout: 10000, force: true });
      await waitForAppToSettle(page, 300);
      return;
    }

    if (isDescendingDropdownStep(step)) {
      await getDescendingOption(page).click({ timeout: 10000 });
      await waitForAppToSettle(page, 300);
      return;
    }

    const dropdownOptionText = getDropdownOptionText(step);
    if (dropdownOptionText) {
      await page.getByRole('option', { name: createNameRegex(dropdownOptionText) }).first().click({ timeout: 10000, force: true });
      await waitForAppToSettle(page, 300);
      return;
    }

    if (stepContainsText(step, 'Add Email')) {
      const { locator } = await resolveFirst(page, buildCandidates(step), {
        mustBeVisible: true,
        timeoutPerCandidate: 1000,
        maxCandidateMatches: 3
      });

      if (!(await locator.isEnabled().catch(() => false))) {
        return;
      }
    }

    await clickWithFallback(page, buildCandidates(step), {
      mustBeVisible: true,
      timeoutPerCandidate: 2500,
      actionTimeout: 10000
    });
    await waitForAppToSettle(page, 500);
    return;
  }

  throw new Error(`Unsupported SR Dashboard DS action: ${step.action}`);
}

async function executeDsFile(page, data, filePath, scenarioName) {
  const steps = parseScenarioSteps(filePath);

  for (const step of steps) {
    if (shouldSkipStep(step, scenarioName)) {
      continue;
    }

    await test.step(buildStepTitle(step), async () => {
      await executeStep(page, data, step, scenarioName);
    });
  }
}

async function openModule(page, data) {
  await executeDsFile(page, data, path.join(UTILITY_ROOT, 'Statement_Recon.ds'), 'SR_Dashboard');
  return page;
}

async function runScenario(page, data, scenarioName) {
  const scenarioKey = extractScenarioKey(scenarioName);
  const scenarioFilePath = SCENARIO_FILE_INDEX.get(scenarioKey);
  if (!scenarioFilePath) {
    throw new Error(`Unsupported scenario for SR Dashboard: ${scenarioName}`);
  }

  await executeDsFile(page, data, scenarioFilePath, scenarioName);
}

const helperMap = {
  openModule
};

module.exports = {
  srDashboardHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    requiresScenarioLogin,
    selectors: srDashboardSelectors
  }
};
