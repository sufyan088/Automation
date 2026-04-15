const campServerLoginSelectors = {};

async function openModule(page) {
  return page;
}

module.exports = {
  campServerLoginHelpers: {
    openModule,
    selectors: campServerLoginSelectors
  }
};
