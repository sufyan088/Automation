const digiteyessettingsCountrysettingsSelectors = {
  settingsMenuButton: [
    { type: 'role', role: 'button', options: { name: /digiteyes\s*settings/i }, name: 'role:DigitEYES Settings' },
    { type: 'css', value: 'button[data-bs-target="#digiteyes-settings"]', name: 'css:settings-toggle' },
    { type: 'text', value: 'DigitEYES Settings', name: 'text:DigitEYES Settings' }
  ],
  moduleLink: [
    { type: 'role', role: 'link', options: { name: /country settings/i }, name: 'role:Country Settings' },
    { type: 'css', value: 'a[href="countrysettings.php"]', name: 'css:countrysettings.php' },
    { type: 'text', value: 'Country Settings', name: 'text:Country Settings' }
  ],
  implementationPartnersLink: [
    { type: 'role', role: 'link', options: { name: /implementation partners/i }, name: 'role:Implementation Partners' },
    { type: 'css', value: 'a[href="implementationpartners.php"]', name: 'css:implementationpartners.php' },
    { type: 'text', value: 'Implementation Partners', name: 'text:Implementation Partners' }
  ],
  hospitalsLink: [
    { type: 'role', role: 'link', options: { name: /hospitals/i }, name: 'role:Hospitals' },
    { type: 'css', value: 'a[href="hospitals.php"]', name: 'css:hospitals.php' },
    { type: 'text', value: 'Hospitals', name: 'text:Hospitals' }
  ],
  deSalesforceFieldMappingLink: [
    { type: 'role', role: 'link', options: { name: /de salesforce field mapping/i }, name: 'role:DE Salesforce Field Mapping' },
    { type: 'css', value: 'a[href="de-salesforce-field-mapping.php"]', name: 'css:de-salesforce-field-mapping.php' },
    { type: 'text', value: 'DE Salesforce Field Mapping', name: 'text:DE Salesforce Field Mapping' }
  ],
  pageMarker: [
    { type: 'role', role: 'heading', options: { name: /country settings/i }, name: 'role:Country Settings heading' },
    { type: 'css', value: 'header h3.m-0', name: 'css:header h3.m-0' }
  ],
  configureIcon: [
    { type: 'css', value: '#datatable tbody tr:first-child i.fa.fa-cogs', name: 'css:first row fa-cogs' },
    { type: 'css', value: 'i.fa.fa-cogs', name: 'css:any fa-cogs' }
  ],
  fullAddressCheckbox: [
    { type: 'css', value: '#DE_CS_fulladdress', name: 'css:#DE_CS_fulladdress' },
    { type: 'css', value: 'input[name="DE_CS_fulladdress"]', name: 'css:input[name=DE_CS_fulladdress]' }
  ],
  prescreeningCheckbox: [
    { type: 'css', value: '#DE_CS_prescreening', name: 'css:#DE_CS_prescreening' },
    { type: 'css', value: 'input[name="DE_CS_prescreening"]', name: 'css:input[name=DE_CS_prescreening]' }
  ],
  preExamCheckbox: [
    { type: 'css', value: '#DE_CS_preexam', name: 'css:#DE_CS_preexam' },
    { type: 'css', value: 'input[name="DE_CS_preexam"]', name: 'css:input[name=DE_CS_preexam]' }
  ],
  fflAtPrescreeningCheckbox: [
    { type: 'css', value: '#DE_CS_isfflatpre', name: 'css:#DE_CS_isfflatpre' },
    { type: 'css', value: 'input[name="DE_CS_isfflatpre"]', name: 'css:input[name=DE_CS_isfflatpre]' }
  ],
  saveButton: [
    { type: 'css', value: 'button[name="btnsubmit"]', name: 'css:button[name=btnsubmit]' },
    { type: 'role', role: 'button', options: { name: /^save$/i }, name: 'role:Save' }
  ],
  successToast: [
    { type: 'text', value: 'Country Settings Saved Successfully', name: 'text:Country Settings Saved Successfully' },
    { type: 'text', value: 'Country Settings Saved Successfully!', name: 'text:Country Settings Saved Successfully!' }
  ]
};

module.exports = {
  digiteyessettingsCountrysettingsSelectors
};
