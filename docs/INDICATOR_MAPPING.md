# IDH Dashboard — Indicator Mapping

> Generated from `shared/indicators.json`. Do not hand-edit — edit the registry and run `node scripts/generate-mapping-doc.js`.

Source: **IDH Logic Sheet (1).xlsx** (sheet `Updated Design Sheet_v2`, rows 2-70), cross-referenced with **idh_prod_sync_driver (1).sql**.

Total indicators: **69**

## Overview

### Overview

#### Farmers Enrolled

- **Sheet row:** 2
- **Chart type:** KPI Card
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form)
- **Logic:** Total response count in Farmer Master Form.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM farmer_master_form WHERE isActive = '1'
  ```
- **Notes:** Working as per current logic — no change.

#### Field Facilitators Registered

- **Sheet row:** 3
- **Chart type:** KPI Card
- **Form(s) / table(s):** `field_facilitator_registration` (Field Facilitator Registration)
- **Logic:** Total response count in Field Facilitator Registration.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM field_facilitator_registration WHERE isActive = '1'
  ```
- **Notes:** Working as per current logic — no change.

#### FIG Registered

- **Sheet row:** 4
- **Chart type:** KPI Card
- **Form(s) / table(s):** `fig_registration` (FIG Registration)
- **Logic:** Total response count in FIG Registration.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM fig_registration WHERE isActive = '1'
  ```
- **Notes:** Working as per current logic — no change.

#### Farmers Enrolled into FIG

- **Sheet row:** 5
- **Chart type:** KPI Card
- **Form(s) / table(s):** `farmer_fig_enrollment` (Farmer FIG Enrollment)
- **Logic:** Total response count in Farmer FIG Enrollment.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM farmer_fig_enrollment WHERE isActive = '1'
  ```
- **Notes:** Working as per current logic — no change.

#### Farmer Engagement and Adoption

- **Sheet row:** 6
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form), `daily_activity_ffs` (Daily Activity FFS), `individual_farmer_visit` (Individual Farmer Visit)
- **Categories:** Enrolled, Trained, Adopting 1+ Practice, Access to Inputs, Receiving CKT Messages, Access to Financial Services, Done Soil Testing
- **Logic:** Composite bar comparing 7 funnel categories, one query per bar against the form named for that category.
- **SQL:**
  ```sql
  -- one SELECT per category, see categories[].op
  SELECT COUNT(*) FROM farmer_master_form WHERE isActive='1';
  SELECT SUM(nosfarmers) FROM daily_activity_ffs WHERE isActive='1';
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND demonstrated_practices IS NOT NULL AND demonstrated_practices <> '';
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND input_provided IS NOT NULL AND input_provided <> '';
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('1', msg_from_ckt);
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND iccrl IS NOT NULL AND iccrl <> '';
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('1', soil_test);
  ```
- **Notes:** AMBIGUITY IN SHEET: the Revised Logic column (I6) leaves the 'Adopting 1+ Practice' source question blank, and reassigns 'Access to Inputs' to the same column (demonstrated_practices) that the original spec (F6) used for 'Adopting 1+ Practice' — likely a copy/paste duplication in the sheet. Implemented here as: 'Adopting 1+ Practice' = demonstrated_practices answered (matches original F6 intent), 'Access to Inputs' = input_provided answered (matches original F6 intent). Flag for client confirmation before go-live.

#### Regenerative Practices Adoption Levels

- **Sheet row:** 7
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `demonstrated_practices`
- **Categories:** 1 Practice, 2 Practices, 3 Practices, 4 Practices, 5 Practices
- **Logic:** For each response, count how many options were selected in Observed Adoption of Demonstrated Practices, then bucket the response into the matching bar (1..5 practices).
- **SQL:**
  ```sql
  SELECT (LENGTH(demonstrated_practices) - LENGTH(REPLACE(demonstrated_practices, ',', '')) + 1) AS n_practices, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND demonstrated_practices IS NOT NULL AND demonstrated_practices <> '' GROUP BY n_practices
  ```
- **Notes:** Fixes bug: only 2 of 5 bars ('1 Practice' and '4+ Practices') were rendering; all 5 buckets must show.

#### Practice-wise Adoption of Regenerative Practices

- **Sheet row:** 8
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `demonstrated_practices`
- **Categories:** Soil Health, Water, Biodiversity, GHG Reduction, Livelihood
- **Logic:** Multi-select field — one response selecting multiple practices counts individually toward each practice's bar.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('1', demonstrated_practices); -- repeat per category value
  ```
- **Notes:** Was showing 'No Data Available'.

## Farmer Mobilization and Activity Demonstration

### Farmer Enrollment

#### Farmer Enrollment

- **Sheet row:** 9
- **Chart type:** KPI Card
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form)
- **Logic:** Total count of farmers enrolled.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM farmer_master_form WHERE isActive = '1'
  ```
- **Notes:** Working as per current logic — no change.

#### Age Group Distribution

- **Sheet row:** 10
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form)
- **Source column:** `age_of_farmer`
- **Categories:** Below 25, 25–35, 36–50, Above 50
- **Logic:** Bucket Age of Farmer into brackets; blank/null ages are dropped entirely (not counted in any bracket).
- **SQL:**
  ```sql
  SELECT CASE WHEN age_of_farmer <= 24 THEN 'Below 25' WHEN age_of_farmer BETWEEN 25 AND 35 THEN '25–35' WHEN age_of_farmer BETWEEN 36 AND 50 THEN '36–50' ELSE 'Above 50' END AS bracket, COUNT(*) AS value FROM farmer_master_form WHERE isActive='1' AND age_of_farmer IS NOT NULL GROUP BY bracket
  ```
- **Notes:** Fixes bug: '>50 yrs' bar showed 14702 vs a manually verified 14674 — root cause was blank ages leaking into a bracket; fix is to exclude NULL ages via the WHERE clause before bucketing. ASSUMPTION: exact bracket cut points (25/35/50) are not specified in the sheet beyond the '>50' reference — confirm with client before go-live.

#### Gender Distribution

- **Sheet row:** 11
- **Chart type:** Donut Chart (ECharts)
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form)
- **Source column:** `gender_farmer`
- **Categories:** Male, Female, Other
- **Logic:** Count Male / Female / Other; blanks ignored. Only one 'Other' category should exist.
- **SQL:**
  ```sql
  SELECT gender_farmer, COUNT(*) AS value FROM farmer_master_form WHERE isActive='1' AND gender_farmer IN ('1','2','3') GROUP BY gender_farmer
  ```
- **Notes:** Fixes bug: wrong totals + a duplicate 'Other' option displayed. Manually verified counts: Male 19327, Female 6834, Other 1.

#### Landholding Size Distribution

- **Sheet row:** 12
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form)
- **Source column:** `total_farm_area`
- **Categories:** ≤ 2 ha, 2.1–5 ha, > 5 ha
- **Logic:** Bucket Total Farm Area into 3 brackets; blanks excluded entirely.
- **SQL:**
  ```sql
  SELECT CASE WHEN total_farm_area <= 2 THEN '≤ 2 ha' WHEN total_farm_area BETWEEN 2.1 AND 5 THEN '2.1–5 ha' ELSE '> 5 ha' END AS bracket, COUNT(*) AS value FROM farmer_master_form WHERE isActive='1' AND total_farm_area IS NOT NULL GROUP BY bracket
  ```
- **Notes:** Fixes bug: major count variance vs manual QA; last bracket changed from '5.1–10 ha' to '> 5 ha' (open-ended). Manually verified: ≤2ha 13244, 2.1–5ha 9675, >5ha 3157. UNIT FLAG: schema comment on total_farm_area says 'in acres' but the sheet labels brackets 'ha' with the same numeric cutoffs (2 / 5) the client used for manual verification — implemented literally against the raw column with no unit conversion to match the verified counts; confirm the true unit with the client.

#### Education Level Distribution

- **Sheet row:** 13
- **Chart type:** Donut Chart (ECharts)
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form)
- **Source column:** `education_level_farmer`
- **Categories:** No Formal Education, Primary, Secondary, Higher Secondary, Graduate & Post Graduate Above
- **Logic:** Count each of the 5 defined education categories; every response must map into one of them. Show count per slice, percentage (of total including blanks) on hover.
- **SQL:**
  ```sql
  SELECT education_level_farmer, COUNT(*) AS value FROM farmer_master_form WHERE isActive='1' AND education_level_farmer IS NOT NULL AND education_level_farmer <> '' GROUP BY education_level_farmer
  ```
- **Notes:** Fixes bug: an 'Unknown' bucket was absorbing responses that should map to the 5 defined categories; chart type changed pie → donut per spec, with hover showing % of total (incl. blanks).

#### Area under Coffee Cultivation (Arabica / Robusta)

- **Sheet row:** 14
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form)
- **Categories:** Arabica, Robusta
- **Logic:** Sum Coffee Area for Arabica across all responses vs sum Coffee Area for Robusta across all responses.
- **SQL:**
  ```sql
  SELECT SUM(coffee_area_arabica) AS arabica, SUM(coffee_area_robusta) AS robusta FROM farmer_master_form WHERE isActive='1'
  ```
- **Notes:** Was 'No Data Available'.

### Farmer Training

#### Average Time Duration

- **Sheet row:** 15
- **Chart type:** KPI Card
- **Form(s) / table(s):** `daily_activity_ffs` (Daily Activity FFS)
- **Source column:** `training_duration`
- **Logic:** Average of training session duration (minutes).
- **SQL:**
  ```sql
  SELECT AVG(training_duration) AS value FROM daily_activity_ffs WHERE isActive='1'
  ```
- **Notes:** Working as per current logic — no change.

#### Number of Farmers Trained

- **Sheet row:** 16
- **Chart type:** KPI Card
- **Form(s) / table(s):** `daily_activity_ffs` (Daily Activity FFS)
- **Source column:** `nosfarmers`
- **Logic:** Sum of 'Number of Farmers Attended training' across all training sessions.
- **SQL:**
  ```sql
  SELECT SUM(nosfarmers) AS value FROM daily_activity_ffs WHERE isActive='1'
  ```
- **Notes:** Fixes bug: was showing an incorrect total (465) — root cause was aggregating per-session count instead of summing attendance across sessions.

#### Topics Covered During Training Session

- **Sheet row:** 17
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `daily_activity_ffs` (Daily Activity FFS)
- **Source column:** `covered_topics`
- **Categories:** Soil, Water, Biodiversity, GHG, Livelihoods
- **Logic:** Count how many training sessions covered each topic; a session covering multiple topics counts individually toward each.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM daily_activity_ffs WHERE isActive='1' AND FIND_IN_SET('Soil', covered_topics); -- repeat per category
  ```
- **Notes:** Fixes bug: 'No Data Available' + wrong categories displayed.

#### Mode of Training Session

- **Sheet row:** 18
- **Chart type:** Donut Chart (ECharts)
- **Form(s) / table(s):** `daily_activity_ffs` (Daily Activity FFS)
- **Source column:** `training_type`
- **Categories:** FFS, Group Training, Individual Visit
- **Logic:** Count each Type of Training Conducted.
- **SQL:**
  ```sql
  SELECT training_type, COUNT(*) AS value FROM daily_activity_ffs WHERE isActive='1' GROUP BY training_type
  ```
- **Notes:** Was 'No Data Available'.

### RegenAg Activity Demonstration

#### Number of Farmers Attended Demos

- **Sheet row:** 19
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `nos_farmers`
- **Logic:** Sum of Number of Farmers Observed/Participated.
- **SQL:**
  ```sql
  SELECT SUM(nos_farmers) AS value FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Working as per current logic — no change.

#### Demo Participation Under Different Activities

- **Sheet row:** 20
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `demonstration_theme`
- **Logic:** Count of responses per Theme of Demonstration Conducted.
- **SQL:**
  ```sql
  SELECT demonstration_theme, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND demonstration_theme IS NOT NULL GROUP BY demonstration_theme
  ```
- **Notes:** Working as per current logic — no change.

#### Total Area Adopted (acres)

- **Sheet row:** 21
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source columns:** `soil_health_total_area`, `total_area_under_water_practices`, `total_biodiversity_area`, `total_climate_mitigation_area`, `total_livelihood_area`
- **Logic:** Sum acreage across all adopted-practice categories, divided by 2.471 (acres → hectares).
- **SQL:**
  ```sql
  SELECT SUM(soil_health_total_area + total_area_under_water_practices + total_biodiversity_area + total_climate_mitigation_area + total_livelihood_area) / 2.471 AS value FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Working as per current logic — no change.

#### Area Adopted Under Different Practices

- **Sheet row:** 22
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Categories:** Soil Health, Water, Biodiversity, Climate Mitigation, Livelihood
- **Logic:** Compare summed acreage across the 5 practice categories. Show absolute number always, percentage on hover.
- **SQL:**
  ```sql
  SELECT SUM(soil_health_total_area) AS soil, SUM(total_area_under_water_practices) AS water, SUM(total_biodiversity_area) AS biodiversity, SUM(total_climate_mitigation_area) AS climate, SUM(total_livelihood_area) AS livelihood FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** SHEET CONFLICT: the Validations column (G22) asks for '5 Bars Comparison' while the Revised Logic column (I22) says 'display in a pie chart' — Revised Logic wins as the latest correction, implemented as pie. Was 'No Data Available'.

## Regen Agricultural Practices

### Hectares under Regenerative Agriculture

#### Total Land Under Sustainable Coffee Farming

- **Sheet row:** 23
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source columns:** `soil_health_total_area`, `total_area_under_water_practices`, `total_biodiversity_area`, `total_climate_mitigation_area`, `total_livelihood_area`
- **Logic:** Same as 'Total Area Adopted' — sum acreage across all adopted-practice categories / 2.471.
- **SQL:**
  ```sql
  SELECT SUM(soil_health_total_area + total_area_under_water_practices + total_biodiversity_area + total_climate_mitigation_area + total_livelihood_area) / 2.471 AS value FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Working as per current logic — no change. Duplicate KPI of fm-demo-03, surfaced here for the Regen Practices dashboard's own headline card.

#### Conservation Practices Adopted

- **Sheet row:** 24
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `if_yes_cradle_pits`
- **Skip-logic dependency:** `cradle_pits` = `1`
- **Categories:** Riparian Barriers, Trenches, Cradle Pits, Others
- **Logic:** Among responses that answered Yes to 'Riparian Barriers/Trenches/Cradle pits on plantation slopes', count which specific option was picked.
- **SQL:**
  ```sql
  SELECT if_yes_cradle_pits, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND cradle_pits='1' GROUP BY if_yes_cradle_pits
  ```
- **Notes:** Was 'No Data Available'.

#### Irrigation Methods Used

- **Sheet row:** 25
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `irrigation_method_used`
- **Categories:** Rainfed, Sprinkler, Drip, Solar Pump, Open Storage
- **Logic:** Multi-select — each option selected in a response counts individually toward that option's slice.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('Rainfed', irrigation_method_used); -- repeat per category
  ```
- **Notes:** Was 'No Data Available'.

#### Usage of Regen Ag Inputs

- **Sheet row:** 26
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `yes_for_use_of_npm`
- **Skip-logic dependency:** `use_of_npm` = `1`
- **Categories:** On-farm Enriched Composting, Biological Concoctions
- **Logic:** Only visible when 'Use of NPM/IPM/RegenAg inputs' = Yes (skip logic); count each option chosen. Ignore blanks.
- **SQL:**
  ```sql
  SELECT yes_for_use_of_npm, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND use_of_npm='1' AND yes_for_use_of_npm IS NOT NULL AND yes_for_use_of_npm <> '' GROUP BY yes_for_use_of_npm
  ```
- **Notes:** Fixes bug: was rendered as a bar graph and returned 'No Data Available' — correct chart type is pie; query above resolves the missing-data issue (the skip-logic dependency on use_of_npm='1' was not applied).

#### Methods of On-farm Enriched Composting

- **Sheet row:** 27
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `enriches_composting`
- **Categories:** Bio-digesters, Bio-char, Enzyme-tech, Heap/Pit Composting, None
- **Logic:** Count each Method of On-farm Enriched Composting option selected.
- **SQL:**
  ```sql
  SELECT enriches_composting, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' GROUP BY enriches_composting
  ```
- **Notes:** Fixes bug: 'No Data Available' and a missing 'None' option (only 4 of 5 were visible).

#### Rainwater Harvesting

- **Sheet row:** 28
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `yes_for_rainwater_harvesting`
- **Skip-logic dependency:** `rainwater_harvesting` = `1`
- **Categories:** Cradle Pits, Check Dams, Contour Bunding, Open Storage
- **Logic:** Among Yes responses to Rainwater Harvesting, count each method selected.
- **SQL:**
  ```sql
  SELECT yes_for_rainwater_harvesting, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND rainwater_harvesting='1' GROUP BY yes_for_rainwater_harvesting
  ```
- **Notes:** Was 'No Data Available'.

#### Post-harvest De-pulping

- **Sheet row:** 29
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `post_harvest_depulping`
- **Categories:** Conventional, Ecopulper, None
- **Logic:** Count each Post-harvest de-pulping method selected.
- **SQL:**
  ```sql
  SELECT post_harvest_depulping, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' GROUP BY post_harvest_depulping
  ```
- **Notes:** Fixes bug: 'No Data Available' and a missing 'None' option (only 2 of 3 were visible).

#### Urea Alternatives Adopted

- **Sheet row:** 30
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `replace_urea`
- **Categories:** Neem Coated, Nano Urea, Liquid Urea, None
- **Logic:** Count each urea-alternative option selected.
- **SQL:**
  ```sql
  SELECT replace_urea, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' GROUP BY replace_urea
  ```
- **Notes:** Fixes bug: 'No Data Available' and a missing 'None' option (only 3 of 4 were visible).

#### Integrated Pest Management

- **Sheet row:** 31
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `pest_management`
- **Categories:** Eco-friendly Methods, Biological Methods, Pheromone Traps, None
- **Logic:** Count each IPM option selected.
- **SQL:**
  ```sql
  SELECT pest_management, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' GROUP BY pest_management
  ```
- **Notes:** Fixes bug: 'No Data Available' and a missing 'None' option (only 3 of 4 were visible).

### Nutrient Management and Regen Ag Inputs

#### Inputs Provided During the Visit

- **Sheet row:** 32
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `input_provided`
- **Categories:** Seedlings, Biochar, Fertilizers, Bio Traps, Cover Crop Seeds, Others
- **Logic:** Count each input type selected during the visit.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('Seedlings', input_provided); -- repeat per category
  ```
- **Notes:** Was 'No Data Available'.

#### Quantity of Inputs Distributed

- **Sheet row:** 33
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `total_input_quantity`
- **Logic:** Sum of Input Quantity Distributed across all responses.
- **SQL:**
  ```sql
  SELECT SUM(total_input_quantity) AS value FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Was 'No Data Available'.

## Soil Health Management

### Demonstration on Soil Health Practices

#### Demonstrations Conducted for Soil Health Practices

- **Sheet row:** 34
- **Chart type:** KPI Card
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `activity_type`
- **Logic:** Count of responses where Type of Activity = Soil Health.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND activity_type = 'Soil Health'
  ```
- **Notes:** Fixes bug: was showing zero despite Soil Health responses existing — root cause was matching on the wrong option code/value.

#### Activities Conducted for Improving Soil Health

- **Sheet row:** 35
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `order29`
- **Categories:** Cover Cropping, Alternative Fertilization
- **Logic:** Count each option selected; show percentage on hover, absolute count always.
- **SQL:**
  ```sql
  SELECT order29, COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND order29 IS NOT NULL GROUP BY order29
  ```
- **Notes:** Fixes bug: was 'No Data Available'; changed to pie chart per spec.

#### Demonstrations to Reduce Emissions

- **Sheet row:** 36
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `order32`
- **Categories:** Composting, Reduced Tillage
- **Logic:** Count each option selected; show percentage on hover, absolute count always.
- **SQL:**
  ```sql
  SELECT order32, COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND order32 IS NOT NULL GROUP BY order32
  ```
- **Notes:** Fixes bug: was 'No Data Available'; changed to pie chart per spec.

### Adoption of Practices

#### Number of Farmers Attended Demos

- **Sheet row:** 38
- **Chart type:** KPI Card
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Logic:** Total response count in Demo Farm Activity.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1'
  ```
- **Notes:** Working as per current logic — no change.

#### Number of Farmers Adopted Soil Health Practices

- **Sheet row:** 39
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `soil_health_practices`
- **Logic:** Count of responses that answered 'Please select the practices adopted under Soil Health'.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND soil_health_practices IS NOT NULL AND soil_health_practices <> ''
  ```
- **Notes:** Fixes bug: was wrongly displayed as a pie chart — corrected to a card.

#### Sustainable Input Usage

- **Sheet row:** 40
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `use_of_npm`
- **Logic:** Total count of responses to 'Use of NPM/IPM/RegenAg inputs' (Yes/No).
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND use_of_npm IS NOT NULL AND use_of_npm <> ''
  ```
- **Notes:** Fixes bug: was wrongly displayed as a pie chart — corrected to a card.

#### Usage of Regen Ag Inputs

- **Sheet row:** 41
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `yes_for_use_of_npm`
- **Skip-logic dependency:** `use_of_npm` = `1`
- **Categories:** On-farm Enriched Composting, Biological Concoctions
- **Logic:** Same as rap-hect-04 — surfaced again under Soil Health's Adoption of Practices sub-dashboard.
- **SQL:**
  ```sql
  SELECT yes_for_use_of_npm, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND use_of_npm='1' AND yes_for_use_of_npm IS NOT NULL AND yes_for_use_of_npm <> '' GROUP BY yes_for_use_of_npm
  ```
- **Notes:** Fixes bug: bar graph shown in error, no data returned — corrected to pie with proper skip-logic filter.

#### Methods of On-farm Enriched Composting

- **Sheet row:** 42
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `enriches_composting`
- **Categories:** Bio-digesters, Bio-char, Enzyme-tech, Heap/Pit Composting, None
- **Logic:** Same as rap-hect-05 — surfaced again under Soil Health's Adoption of Practices sub-dashboard.
- **SQL:**
  ```sql
  SELECT enriches_composting, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' GROUP BY enriches_composting
  ```
- **Notes:** Fixes bug: 'No Data Available' and a missing 'None' option.

#### Urea Alternatives Adopted

- **Sheet row:** 43
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `replace_urea`
- **Categories:** Neem Coated, Nano Urea, Liquid Urea, None
- **Logic:** Same as rap-hect-08 — surfaced again under Soil Health's Adoption of Practices sub-dashboard.
- **SQL:**
  ```sql
  SELECT replace_urea, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' GROUP BY replace_urea
  ```
- **Notes:** Fixes bug: 'No Data Available' and a missing 'None' option.

### Farmer Participation

#### Number of Farmers Adopting Any Practice

- **Sheet row:** 44
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source columns:** `cradle_pits`, `use_of_mulching`, `use_of_npm`, `rainwater_harvesting`, `use_of_ecopulpers`, `new_coffee_varities`
- **Logic:** Count a response once if it answered Yes to any of the visit's multiple activity/adoption questions.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND (cradle_pits='1' OR use_of_mulching='1' OR use_of_npm='1' OR rainwater_harvesting='1' OR use_of_ecopulpers='1' OR new_coffee_varities='1')
  ```
- **Notes:** ASSUMPTION: sheet says 'register the count if Yes for any activity — questions may vary as there are multiple activity questions in the form' without naming the exact column set. Implemented against the visit form's core Yes/No adoption toggles listed above; confirm the intended column list with the client before go-live.

### Lime Application

#### Soil Health Demo Participation

- **Sheet row:** 45
- **Chart type:** KPI Card
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `activity_type`
- **Logic:** Count of responses where Type of Activity = Soil Health.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND activity_type = 'Soil Health'
  ```
- **Notes:** Fixes bug: was showing zero — same root cause and fix as sh-demo-01.

## Water Management

### Water Use and Management

#### Activities Related to Water Use Efficiency

- **Sheet row:** 37
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `order30`
- **Categories:** Drip Irrigation, Rainwater Harvesting
- **Logic:** Count each option selected for water-use-efficiency activities.
- **SQL:**
  ```sql
  SELECT order30, COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND order30 IS NOT NULL GROUP BY order30
  ```
- **Notes:** Working as per current logic — no change.

#### Farmers Practicing Rainwater Harvesting

- **Sheet row:** 46
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `rainwater_harvesting`
- **Logic:** Count of responses answering Yes to Rainwater Harvesting.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND rainwater_harvesting='1'
  ```
- **Notes:** Working as per current logic — no change.

#### Water Conservation Practices Adopted

- **Sheet row:** 47
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `demonstrated_practices`
- **Logic:** Count of responses where 'Water' (Option ID 2) is selected in Observed Adoption of Demonstrated Practices.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('2', demonstrated_practices)
  ```
- **Notes:** Fixes bug: was rendered as a graph with 'No Data Available' — correct presentation is a single card.

#### Number of Adoptions of Different Water Conservation Practices

- **Sheet row:** 48
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `water_adopted_processes`
- **Categories:** Farm Pond, Trenches & Cradle Pits, Drip/Sprinkler
- **Logic:** Multi-select — each response's selected options counted individually toward each category.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('Farm Pond', water_adopted_processes); -- repeat per category
  ```
- **Notes:** Fixes bug: chart type corrected to pie; was 'No Data Available'.

#### Acreage of Land under Water Conservation Practices

- **Sheet row:** 49
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Categories:** Farm Pond, Trenches & Cradle Pits, Drip/Sprinkler
- **Logic:** Sum acreage per water-practice column and compare; blanks ignored.
- **SQL:**
  ```sql
  SELECT SUM(farm_pond_area) AS farm_pond, SUM(trenche_area) AS trenches, SUM(sprinkler_area) AS drip_sprinkler FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Was 'No Data Available'.

## Biodiversity Improvement

### Tree Diversity and Density

#### Activities Promoting Biodiversity (Demo)

- **Sheet row:** 50
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `order31`
- **Categories:** Native Tree Planting, Agroforestry Practices
- **Logic:** Count each option selected; show percentage on hover, absolute count always.
- **SQL:**
  ```sql
  SELECT order31, COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND order31 IS NOT NULL GROUP BY order31
  ```
- **Notes:** Fixes bug: 'No Data Available'; changed to pie chart per spec.

#### Number of Farmers Received Tree Seedlings

- **Sheet row:** 51
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `input_provided`
- **Logic:** Count of responses where 'Seedlings' selected in Inputs Provided During Visit.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('Seedlings', input_provided)
  ```
- **Notes:** Working as per current logic — no change.

### Shade and Canopy Management

#### Native Tree Planting in Demo Plots

- **Sheet row:** 52
- **Chart type:** KPI Card
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `activity_type`
- **Logic:** Count of responses where Type of Activity = Planting (option code 2).
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND activity_type = 'Planting'
  ```
- **Notes:** Fixes bug: was showing zero despite Planting responses existing — same root-cause class as sh-demo-01.

#### Farmers Adopting Practice on Own Coffee Farms

- **Sheet row:** 53
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `input_provided`
- **Logic:** Count of responses where 'Seedlings' selected in Inputs Provided During Visit.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('Seedlings', input_provided)
  ```
- **Notes:** Working as per current logic — no change. Duplicate KPI of bio-tree-02, surfaced under this sub-dashboard per the sheet.

### Bark Scrubbing

#### Activities Promoting Biodiversity

- **Sheet row:** 54
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `yes_for_use_of_npm`
- **Skip-logic dependency:** `use_of_npm` = `1`
- **Categories:** On-farm Enriched Composting, Biological Concoctions
- **Logic:** Same source/logic as rap-hect-04.
- **SQL:**
  ```sql
  SELECT yes_for_use_of_npm, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND use_of_npm='1' AND yes_for_use_of_npm IS NOT NULL AND yes_for_use_of_npm <> '' GROUP BY yes_for_use_of_npm
  ```
- **Notes:** SHEET NOTE: this row's Question/Logic and Revised Logic text is identical to 'Usage of Regen Ag Inputs' (rows 26/41/54) rather than describing a bark-scrubbing-specific question — the schema has no bark-scrubbing field. Implemented literally as specified in the sheet; flag to client that this looks like a copy/paste artifact and confirm the intended source question for 'Bark Scrubbing'.

### Adoption of Practices

#### Activities Promoting Biodiversity

- **Sheet row:** 55
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `biodiversity_practices`
- **Categories:** Native/Fruit Tree Seedlings Planted, Riparian Buffer Zones, NPM/IPM / Stopped Weedicide, Mixed Cropping
- **Logic:** Multi-select — each response's selected options counted individually toward each category.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('1', biodiversity_practices); -- repeat per category
  ```
- **Notes:** Fixes bug: category tag labels were tilted/wrapping oddly (render horizontally instead) and 'No Data Available' despite existing responses.

#### Number of Adoptions of Different Biodiversity Activities

- **Sheet row:** 56
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `biodiversity_practices`
- **Categories:** Native/Fruit Tree Seedlings Planted, Riparian Buffer Zones, NPM/IPM / Stopped Weedicide, Mixed Cropping
- **Logic:** Same source/logic as bio-adopt-01 — a second view of the same breakdown per the sheet.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('1', biodiversity_practices); -- repeat per category
  ```
- **Notes:** Working as per current logic — no change.

#### Acreage under Biodiversity Practices

- **Sheet row:** 57
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Categories:** Native/Fruit Tree Seedlings, Riparian Buffer Zones, NPM/IPM / Stopped Weedicide, Mixed Cropping
- **Logic:** Sum acreage per biodiversity-practice column and compare.
- **SQL:**
  ```sql
  SELECT SUM(fruit_tree_area) AS fruit_tree, SUM(riparian_area) AS riparian, SUM(weedicide_area) AS weedicide, SUM(mixed_crop_area) AS mixed_crop FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Working as per current logic — no change.

## Climate Change / GHG Mitigation

### Adoption of Practices

#### Activities to Reduce Emissions

- **Sheet row:** 58
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `order32`
- **Categories:** Composting, Reduced Tillage
- **Logic:** Count each option selected in Q49 of Individual Farmer Visit.
- **SQL:**
  ```sql
  SELECT order32, COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND order32 IS NOT NULL GROUP BY order32
  ```
- **Notes:** SHEET FLAG: form/table reference (order32) does not exist on individual_farmer_visit — it belongs to demo_farm_activity (see sh-demo-03). Marked 'NO DATA AVAILABLE' in the sheet, consistent with this mismatch. Implemented against demo_farm_activity.order32 (the only table that has this column) pending client confirmation.

#### Number of Adoptions of Different Emission-Reduction Activities

- **Sheet row:** 59
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `climate_practices`
- **Categories:** Two-tier Canopy Management, Split Dose Fertilizer Application, Pulp Waste Treatment
- **Logic:** Multi-select — each response's selected options counted individually toward each category.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('1', climate_practices); -- repeat per category
  ```
- **Notes:** Was 'NO DATA AVAILABLE'.

#### Acreage under Emission-Reduction Activities

- **Sheet row:** 60
- **Chart type:** Column Chart (Highcharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Categories:** Two-tier Canopy Management, Split Dose Fertilizer Application, Pulp Waste Treatment
- **Logic:** Sum acreage per emission-reduction practice column and compare.
- **SQL:**
  ```sql
  SELECT SUM(canopy_area) AS canopy, SUM(split_dose_area) AS split_dose, SUM(pulp_waste_area) AS pulp_waste FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Was 'NO DATA AVAILABLE'.

## Livelihood Diversification

### Intercropping with Fruit Trees and High-Value Biomass

#### Intercropping Plots

- **Sheet row:** 61
- **Chart type:** KPI Card
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `order33`
- **Logic:** Count of responses where Measures for Improving Income = Crop Diversification (option code 1).
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND order33 = 'Crop Diversification'
  ```
- **Notes:** Fixes bug: was showing zero despite Crop Diversification responses existing — same root-cause class as sh-demo-01.

#### Intercrops Grown with Coffee

- **Sheet row:** 62
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `farmer_master_form` (Farmer Master Form)
- **Source column:** `intercops_grown`
- **Categories:** Black Pepper, Cardamom, Fruit Trees, Areca Nut, Others
- **Logic:** Count each intercrop option selected.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM farmer_master_form WHERE isActive='1' AND FIND_IN_SET('Black Pepper', intercops_grown); -- repeat per category
  ```
- **Notes:** Was 'No Data Available'.

### Apiary for Pollination

#### Beehives Setup

- **Sheet row:** 63
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `nos_new_beehives`
- **Logic:** Sum of New Beehives Set Up.
- **SQL:**
  ```sql
  SELECT SUM(nos_new_beehives) AS value FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Working as per current logic — no change.

#### Farmers Generating Income Through Honey

- **Sheet row:** 64
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `other_income_sources`
- **Logic:** Count of responses where 'Honey' (Option ID 5) selected in Other Income Generating Activities (farm related).
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND FIND_IN_SET('5', other_income_sources)
  ```
- **Notes:** Fixes bug: was showing zero despite Honey responses existing — root cause was matching on the wrong option code.

### Adoption of Practices

#### Demonstration to Improve Income

- **Sheet row:** 65
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `demo_farm_activity` (Demo Farm Activity)
- **Source column:** `order33`
- **Categories:** Crop Diversification, Off-farm Activities, Apiary (Beekeeping), Aquaculture
- **Logic:** Count each Measures for Improving Income option; show absolute number always, percentage on hover.
- **SQL:**
  ```sql
  SELECT order33, COUNT(*) AS value FROM demo_farm_activity WHERE isActive='1' AND order33 IS NOT NULL GROUP BY order33
  ```
- **Notes:** Fixes bug: was 'No Data Available' despite existing responses.

#### Number of Adoptions under Livelihood Diversification

- **Sheet row:** 66
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `livelihood_practices`
- **Logic:** Total count of responses where 'Please select the practices adopted under Livelihood diversification' is answered.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND livelihood_practices IS NOT NULL AND livelihood_practices <> ''
  ```
- **Notes:** Fixes bug: source question was wrongly mapped — remapped to livelihood_practices as specified in the revised logic.

#### Acreage under Livelihood Diversification

- **Sheet row:** 67
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `total_livelihood_area`
- **Logic:** Sum of Total Acreage Livelihood Diversification across all responses.
- **SQL:**
  ```sql
  SELECT SUM(total_livelihood_area) AS value FROM individual_farmer_visit WHERE isActive='1'
  ```
- **Notes:** Fixes bug: was wrongly mapped and showed 'No Data Available'; changed from a graph to a top-of-page card.

## Others

### Others

#### Farmers Who Got Soil Samples Tested After Aug 2024

- **Sheet row:** 68
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `soil_test`
- **Logic:** Count of responses answering Yes to soil sample testing after August 2024.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND soil_test='1'
  ```
- **Notes:** Working as per current logic — no change.

#### Count of Beneficiaries Accessing Schemes

- **Sheet row:** 69
- **Chart type:** KPI Card
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `iccrl`
- **Logic:** Count of responses answering Yes to accessing Schemes/Subsidies/loans/grants through ICCRL.
- **SQL:**
  ```sql
  SELECT COUNT(*) AS value FROM individual_farmer_visit WHERE isActive='1' AND iccrl='1'
  ```
- **Notes:** Working as per current logic — no change.

#### Source of Scheme Access (ICCRL)

- **Sheet row:** 70
- **Chart type:** Pie Chart (ECharts)
- **Form(s) / table(s):** `individual_farmer_visit` (Individual Farmer Visit)
- **Source column:** `institutions_if_yes`
- **Categories:** Govt Dept Scheme, Bank, Microfinance, SHG, Others
- **Logic:** Count each institution option selected among Yes/ICCRL responses.
- **SQL:**
  ```sql
  SELECT COUNT(*) FROM individual_farmer_visit WHERE isActive='1' AND iccrl='1' AND FIND_IN_SET('Govt Dept Scheme', institutions_if_yes); -- repeat per category
  ```
- **Notes:** Was 'No Data Available' despite existing responses.
