const fs = require('fs');
const path = require('path');

const brandText = 'MAMMOTH-AI';
const reportDir = path.resolve(process.argv[2] || 'allure-report');
const logoCandidates = [
  path.resolve(__dirname, '..', 'assets', 'Mammoth-AI Logo.png'),
  path.resolve(__dirname, '..', 'Mammoth-AI Logo.png'),
  path.resolve(__dirname, '..', 'mammoth_ai_ltd_logo.jfif'),
  path.resolve(__dirname, '..', 'assets', 'mammoh-ai-logo.svg'),
];
const logoSource = logoCandidates.find((candidate) => fs.existsSync(candidate)) || logoCandidates[0];
const logoTargetName = path.basename(logoSource);
const logoTarget = path.join(reportDir, logoTargetName);
const iconCandidates = [
  path.resolve(__dirname, '..', 'assets', 'mammoh-ai-mark.svg'),
  path.resolve(__dirname, '..', 'assets', 'Mammoth-AI Logo.png'),
  path.resolve(__dirname, '..', 'Mammoth-AI Logo.png'),
];
const iconSource = iconCandidates.find((candidate) => fs.existsSync(candidate)) || iconCandidates[0];
const iconTargetName = path.basename(iconSource);
const iconTarget = path.join(reportDir, iconTargetName);

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.svg') {
    return 'image/svg+xml';
  }

  if (extension === '.png') {
    return 'image/png';
  }

  if (extension === '.jpg' || extension === '.jpeg') {
    return 'image/jpeg';
  }

  if (extension === '.jfif') {
    return 'image/jpeg';
  }

  if (extension === '.webp') {
    return 'image/webp';
  }

  if (extension === '.ico') {
    return 'image/x-icon';
  }

  throw new Error(`Unsupported image type: ${filePath}`);
}

function toDataUri(filePath) {
  const mimeType = getMimeType(filePath);
  const encoded = fs.readFileSync(filePath).toString('base64');
  return `data:${mimeType};base64,${encoded}`;
}

function escapeForInlineScript(value) {
  return value
    .replace(/<\//g, '<\\/')
    .replace(/<!--/g, '<\\!--');
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file not found: ${filePath}`);
  }
}

function updateTextFile(filePath, updater) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = updater(original);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function appendBrandingCss(css) {
  const marker = '/* MAMMOTH-AI branding */';
  const brandingBlock = `${marker}\n.side-nav{width:345px!important;}\n.side-nav__head{margin:16px 0!important;padding:0 12px 18px!important;}\n.side-nav__brand{background:url("${logoTargetName}") no-repeat center 18px!important;background-size:210px 78px!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;align-items:center!important;font-size:20px!important;font-weight:600!important;line-height:24px!important;letter-spacing:.5px!important;margin:0!important;min-height:156px!important;padding:112px 12px 12px!important;text-align:center!important;white-space:nowrap!important;}\n.side-nav__brand-text{display:block!important;max-width:100%!important;overflow:visible!important;text-overflow:clip!important;padding:0!important;}\n.side-nav_collapsed{width:64px!important;}\n.side-nav_collapsed .side-nav__brand{background-position:center 10px!important;background-size:34px 34px!important;min-height:54px!important;padding:0!important;font-size:0!important;line-height:0!important;}\n`;

  if (css.includes(marker)) {
    return css.replace(/\/\* MAMMOTH-AI branding \*\/[\s\S]*$/m, brandingBlock);
  }

  if (css.includes('/* Mammoh-AI branding */')) {
    return css.replace(/\/\* Mammoh-AI branding \*\/[\s\S]*$/m, brandingBlock);
  }

  return `${css}\n${brandingBlock}`;
}

function appendSingleFileBranding(html, logoDataUri, iconDataUri) {
  const scriptMarker = '/* MAMMOTH-AI single-file branding script */';
  const brandingCss = `.side-nav{width:345px!important;}\n.side-nav__head{margin:16px 0!important;padding:0 12px 18px!important;}\n.side-nav__brand{background:url("${logoDataUri}") no-repeat center 18px!important;background-size:210px 78px!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;align-items:center!important;font-size:20px!important;font-weight:600!important;line-height:24px!important;letter-spacing:.5px!important;margin:0!important;min-height:156px!important;padding:112px 12px 12px!important;text-align:center!important;white-space:nowrap!important;}\n.side-nav__brand-text{display:block!important;max-width:100%!important;overflow:visible!important;text-overflow:clip!important;padding:0!important;}\n.side-nav_collapsed{width:64px!important;}\n.side-nav_collapsed .side-nav__brand{background-position:center 10px!important;background-size:34px 34px!important;min-height:54px!important;padding:0!important;font-size:0!important;line-height:0!important;}`;
  const safeBrandingCss = escapeForInlineScript(JSON.stringify(brandingCss));
  const brandingScript = `<script>${scriptMarker}\n(function(){\n  const brandText = ${JSON.stringify(brandText)};\n  const brandingCss = ${safeBrandingCss};\n  let observer = null;\n  let scheduled = false;\n\n  const updateTextContent = (selector) => {\n    document.querySelectorAll(selector).forEach((node) => {\n      const text = (node.textContent || '').trim();\n      if (/^allure report\\b/i.test(text)) {\n        node.textContent = text.replace(/^allure report\\b/i, brandText);\n      }\n    });\n  };\n\n  const applyBranding = () => {\n    document.title = brandText;\n    let styleTag = document.getElementById('mammoth-ai-branding');\n    if (!styleTag) {\n      styleTag = document.createElement('style');\n      styleTag.id = 'mammoth-ai-branding';\n      document.head.appendChild(styleTag);\n    }\n    if (styleTag.textContent !== brandingCss) {\n      styleTag.textContent = brandingCss;\n    }\n    document.querySelectorAll('.side-nav__brand-text').forEach((node) => {\n      if (node.textContent !== brandText) {\n        node.textContent = brandText;\n      }\n    });\n    updateTextContent('h1, h2, h3, .widget__title, .summary-widget__title, .overview__title, .report-name');\n  };\n\n  const scheduleApply = () => {\n    if (scheduled) {\n      return;\n    }\n    scheduled = true;\n    window.requestAnimationFrame(() => {\n      scheduled = false;\n      if (observer) {\n        observer.disconnect();\n      }\n      applyBranding();\n      if (observer && document.body) {\n        observer.observe(document.body, { childList: true, subtree: true });\n      }\n    });\n  };\n\n  const startBranding = () => {\n    applyBranding();\n\n    if (!observer && document.body) {\n      observer = new MutationObserver(() => {\n        scheduleApply();\n      });\n      observer.observe(document.body, { childList: true, subtree: true });\n    }\n\n    window.addEventListener('hashchange', scheduleApply);\n    window.addEventListener('popstate', scheduleApply);\n\n    let attempts = 0;\n    const intervalId = window.setInterval(() => {\n      applyBranding();\n      attempts += 1;\n      if (attempts >= 20) {\n        window.clearInterval(intervalId);\n      }\n    }, 500);\n  };\n\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', startBranding, { once: true });\n  } else {\n    startBranding();\n  }\n})();\n</script>`;

  let updated = html.replace(/<title>.*?<\/title>/, `<title>${brandText}</title>`);

  updated = updated.replace(/<style id="mammoth-ai-branding">[\s\S]*?<\/style>/g, '');

  if (updated.includes(scriptMarker)) {
    updated = updated.replace(/<script>\/\* MAMMOTH-AI single-file branding script \*\/[\s\S]*?<\/script>/, brandingScript);
  } else {
    updated = updated.replace('</body>', `    ${brandingScript}\n</body>`);
  }

  if (updated.includes('rel="icon"')) {
    updated = updated.replace(/<link rel="icon"[^>]*href="[^"]*"[^>]*>/, `<link rel="icon" type="${getMimeType(iconSource)}" href="${iconDataUri}">`);
  } else {
    updated = updated.replace('</title>', `</title>\n    <link rel="icon" type="${getMimeType(iconSource)}" href="${iconDataUri}">`);
  }

  updated = updated.replace(/d\('widgets\/summary\.json','([^']+)'\)/, (_, encodedSummary) => {
    const parsed = JSON.parse(Buffer.from(encodedSummary, 'base64').toString('utf8'));
    parsed.reportName = brandText;
    const nextEncodedSummary = Buffer.from(JSON.stringify(parsed)).toString('base64');
    return `d('widgets/summary.json','${nextEncodedSummary}')`;
  });

  return updated;
}

function main() {
  if (!fs.existsSync(reportDir)) {
    throw new Error(`Report directory not found: ${reportDir}`);
  }

  ensureFile(logoSource);
  ensureFile(iconSource);

  const indexHtml = path.join(reportDir, 'index.html');
  const summaryJson = path.join(reportDir, 'widgets', 'summary.json');
  const appJs = path.join(reportDir, 'app.js');
  const stylesCss = path.join(reportDir, 'styles.css');
  const logoDataUri = toDataUri(logoSource);
  const iconDataUri = toDataUri(iconSource);

  ensureFile(indexHtml);

  const isSingleFileReport = !fs.existsSync(appJs) || !fs.existsSync(stylesCss) || !fs.existsSync(summaryJson);

  if (isSingleFileReport) {
    updateTextFile(indexHtml, (content) => appendSingleFileBranding(content, logoDataUri, iconDataUri));
    console.log(`Customized Allure report branding in ${reportDir}`);
    return;
  }

  [summaryJson, appJs, stylesCss].forEach(ensureFile);

  fs.copyFileSync(logoSource, logoTarget);
  fs.copyFileSync(iconSource, iconTarget);

  updateTextFile(indexHtml, (content) => {
    let updated = content.replace(/<title>.*?<\/title>/, `<title>${brandText}</title>`);

    if (updated.includes('rel="icon"')) {
      updated = updated.replace(/<link rel="icon" href="[^"]*">/, `<link rel="icon" type="image/svg+xml" href="${iconTargetName}">`);
    } else {
      updated = updated.replace('</title>', `</title>\n    <link rel="icon" type="image/svg+xml" href="${iconTargetName}">`);
    }

    return updated;
  });

  updateTextFile(summaryJson, (content) => {
    const parsed = JSON.parse(content);
    parsed.reportName = brandText;
    return `${JSON.stringify(parsed)}\n`;
  });

  updateTextFile(appJs, (content) => {
    let updated = content.replace(/(<span class="side-nav__brand-text">)(.*?)(<\/span>)/g, `$1${brandText}$3`);
    updated = updated.replace(/>(Allure|Mammoh-AI|MAMMOTH-AI)<\/span>/g, `>${brandText}</span>`);
    return updated;
  });
  updateTextFile(stylesCss, appendBrandingCss);

  console.log(`Customized Allure report branding in ${reportDir}`);
}

main();
