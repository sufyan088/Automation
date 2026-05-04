# Migration Notes - File Processing Module

## Source inventory

The uploaded FileProcessing module contained these AIQ scripts:

1. TS_01_To_verify_File_Processing_button.ds
2. TS_02_To_verify_the_customer_file_search_by_Id_on_file_processing_page.ds
3. TS_03_To_verify_the_customer_file_search_by_filename_on_file_processing_page.ds
4. TS_04_To_verify_that_Go_to_next_page_button_is_functional.ds
5. TS_05_To_verify_that_Go_to_last_page_button_is_functional.ds
6. TS_06_To_verify_that_Go_to_previous_page_button_is_functional .ds
7. TS_07_To_verify_that_Go_to_first_page_button_is_functional.ds
8. TS_08_To_Verify_That_Pagination_Button_Is_Functional .ds
9. TS_09_To_verify_that_Search_all_entries_field_is_functional .ds
10. TS_10_To_verify_that_Column_View_button_is_functional.ds
11. TS_11_To_verify_that_Asc_button_is_responsive_for_all_the_entries_present_in_the_border.ds
12. TS_12_To_verify_that_Dsc_button_is_responsive_for_all_the_entries_present_in_the_border.ds
13. TS_13_To_verify_that_Hide_button_is_responsive_for_the_entries_present_in_the_border.ds
14. TS_14_To_verify_that_Run_To_Top_button_is_functional.ds

## Utility files used for this module

- Utility Functions/Login_As_An_Admin.ds
- Utility Functions/imREmit/Click_on_imREmit_module.ds
- Utility Functions/imREmit/Select_Customer_File_Processing.ds
- Utility Functions/Logout_Function.ds

## Reusable flow identified

Most scripts follow this flow:

1. enable shadow DOM
2. allow non-visible / non-enabled search
3. login as admin
4. click imREmit module
5. open File Processing
6. optionally select customer
7. perform feature-specific interaction
8. logout

One script searches/selects customer before opening File Processing, and that order was preserved.

## DPL and hard-coded data

### DPL-driven
The POC loads:
- URL
- Username_Admin
- Password_Admin
- CustomerName-like values where applicable

### Hard-coded values preserved from AIQ
- Search by ID: `953f3dac-c29c-4e2d-b355-7f278e8865aa`
- Search by filename: `Stanford_IM_Response_2024-09-03 06:42:39.txt`
- Search all entries: `VeriZonPayment`
- File Processing customer selection: `Verizon Customer`

These are exposed as environment-variable overrides through `.env.example`.

## Historical pain points addressed

### Scripts becoming too abstract
The tests keep visible business steps through `test.step()` and do not hide the entire flow in one helper.

### Locator failures
The fallback locator helper tries candidates in sequence and includes useful error messages.

### Login getting stuck
Login is done per test with explicit waits and a post-login landing verification.

### Retry / re-execution confusion
Each test is self-contained and uses explicit steps, which makes retries easier to understand.

### Slow application response
The helpers wait for page stability and visible controls instead of assuming instant rendering.

## Assumptions and limitations

- The AIQ selectors were converted as faithfully as possible, but some Sahi-specific accessors have no one-to-one Playwright equivalent.
- Where AIQ used generic SVG selectors, semantic button/text-based selectors were preferred first.
- The POC is intentionally designed for one module but can be scaled using the same helper pattern.
