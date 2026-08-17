// AUTO-GENERATED from shared/indicators.json — do not hand-edit.
const DASHBOARDS = [
  {
    "id": "overview",
    "label": "Overview"
  },
  {
    "id": "farmer-mobilization",
    "label": "Farmer Mobilization and Activity Demonstration"
  },
  {
    "id": "regen-practices",
    "label": "Regen Agricultural Practices"
  },
  {
    "id": "soil-health",
    "label": "Soil Health Management"
  },
  {
    "id": "water-management",
    "label": "Water Management"
  },
  {
    "id": "biodiversity",
    "label": "Biodiversity Improvement"
  },
  {
    "id": "climate-ghg",
    "label": "Climate Change / GHG Mitigation"
  },
  {
    "id": "livelihood",
    "label": "Livelihood Diversification"
  },
  {
    "id": "others",
    "label": "Others"
  }
];

const INDICATORS = [
  {
    "id": "ovw-01",
    "dashboard": "overview",
    "subDashboard": "Overview",
    "indicator": "Farmers Enrolled",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Total response count in Farmer Master Form.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 26162
    }
  },
  {
    "id": "ovw-02",
    "dashboard": "overview",
    "subDashboard": "Overview",
    "indicator": "Field Facilitators Registered",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Total response count in Field Facilitator Registration.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 118
    }
  },
  {
    "id": "ovw-03",
    "dashboard": "overview",
    "subDashboard": "Overview",
    "indicator": "FIG Registered",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Total response count in FIG Registration.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 462
    }
  },
  {
    "id": "ovw-04",
    "dashboard": "overview",
    "subDashboard": "Overview",
    "indicator": "Farmers Enrolled into FIG",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Total response count in Farmer FIG Enrollment.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 18940
    }
  },
  {
    "id": "ovw-05",
    "dashboard": "overview",
    "subDashboard": "Overview",
    "indicator": "Farmer Engagement and Adoption",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Composite bar comparing 7 funnel categories, one query per bar against the form named for that category.",
    "notes": "AMBIGUITY IN SHEET: the Revised Logic column (I6) leaves the 'Adopting 1+ Practice' source question blank, and reassigns 'Access to Inputs' to the same column (demonstrated_practices) that the original spec (F6) used for 'Adopting 1+ Practice' \u2014 likely a copy/paste duplication in the sheet. Implemented here as: 'Adopting 1+ Practice' = demonstrated_practices answered (matches original F6 intent), 'Access to Inputs' = input_provided answered (matches original F6 intent). Flag for client confirmation before go-live.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Enrolled",
          "value": 26162
        },
        {
          "label": "Trained",
          "value": 15480
        },
        {
          "label": "Adopting 1+ Practice",
          "value": 11290
        },
        {
          "label": "Access to Inputs",
          "value": 9870
        },
        {
          "label": "Receiving CKT Messages",
          "value": 8420
        },
        {
          "label": "Access to Financial Services",
          "value": 4310
        },
        {
          "label": "Done Soil Testing",
          "value": 3960
        }
      ]
    }
  },
  {
    "id": "ovw-06",
    "dashboard": "overview",
    "subDashboard": "Overview",
    "indicator": "Regenerative Practices Adoption Levels",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "For each response, count how many options were selected in Observed Adoption of Demonstrated Practices, then bucket the response into the matching bar (1..5 practices).",
    "notes": "Fixes bug: only 2 of 5 bars ('1 Practice' and '4+ Practices') were rendering; all 5 buckets must show.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "1 Practice",
          "value": 4210
        },
        {
          "label": "2 Practices",
          "value": 3180
        },
        {
          "label": "3 Practices",
          "value": 2340
        },
        {
          "label": "4 Practices",
          "value": 1180
        },
        {
          "label": "5 Practices",
          "value": 620
        }
      ]
    }
  },
  {
    "id": "ovw-07",
    "dashboard": "overview",
    "subDashboard": "Overview",
    "indicator": "Practice-wise Adoption of Regenerative Practices",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Multi-select field \u2014 one response selecting multiple practices counts individually toward each practice's bar.",
    "notes": "Was showing 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Soil Health",
          "value": 7940
        },
        {
          "label": "Water",
          "value": 5210
        },
        {
          "label": "Biodiversity",
          "value": 4380
        },
        {
          "label": "GHG Reduction",
          "value": 3020
        },
        {
          "label": "Livelihood",
          "value": 2610
        }
      ]
    }
  },
  {
    "id": "fm-enr-01",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Enrollment",
    "indicator": "Farmer Enrollment",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Total count of farmers enrolled.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 26162
    }
  },
  {
    "id": "fm-enr-02",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Enrollment",
    "indicator": "Age Group Distribution",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Bucket Age of Farmer into brackets; blank/null ages are dropped entirely (not counted in any bracket).",
    "notes": "Fixes bug: '>50 yrs' bar showed 14702 vs a manually verified 14674 \u2014 root cause was blank ages leaking into a bracket; fix is to exclude NULL ages via the WHERE clause before bucketing. ASSUMPTION: exact bracket cut points (25/35/50) are not specified in the sheet beyond the '>50' reference \u2014 confirm with client before go-live.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Below 25",
          "value": 1840
        },
        {
          "label": "25\u201335",
          "value": 4920
        },
        {
          "label": "36\u201350",
          "value": 4726
        },
        {
          "label": "Above 50",
          "value": 14674
        }
      ]
    }
  },
  {
    "id": "fm-enr-03",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Enrollment",
    "indicator": "Gender Distribution",
    "chartType": "donut",
    "chartLib": "echarts",
    "logic": "Count Male / Female / Other; blanks ignored. Only one 'Other' category should exist.",
    "notes": "Fixes bug: wrong totals + a duplicate 'Other' option displayed. Manually verified counts: Male 19327, Female 6834, Other 1.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Male",
          "value": 19327
        },
        {
          "label": "Female",
          "value": 6834
        },
        {
          "label": "Other",
          "value": 1
        }
      ]
    }
  },
  {
    "id": "fm-enr-04",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Enrollment",
    "indicator": "Landholding Size Distribution",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Bucket Total Farm Area into 3 brackets; blanks excluded entirely.",
    "notes": "Fixes bug: major count variance vs manual QA; last bracket changed from '5.1\u201310 ha' to '> 5 ha' (open-ended). Manually verified: \u22642ha 13244, 2.1\u20135ha 9675, >5ha 3157. UNIT FLAG: schema comment on total_farm_area says 'in acres' but the sheet labels brackets 'ha' with the same numeric cutoffs (2 / 5) the client used for manual verification \u2014 implemented literally against the raw column with no unit conversion to match the verified counts; confirm the true unit with the client.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "\u2264 2 ha",
          "value": 13244
        },
        {
          "label": "2.1\u20135 ha",
          "value": 9675
        },
        {
          "label": "> 5 ha",
          "value": 3157
        }
      ]
    }
  },
  {
    "id": "fm-enr-05",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Enrollment",
    "indicator": "Education Level Distribution",
    "chartType": "donut",
    "chartLib": "echarts",
    "logic": "Count each of the 5 defined education categories; every response must map into one of them. Show count per slice, percentage (of total including blanks) on hover.",
    "notes": "Fixes bug: an 'Unknown' bucket was absorbing responses that should map to the 5 defined categories; chart type changed pie \u2192 donut per spec, with hover showing % of total (incl. blanks).",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "No Formal Education",
          "value": 3120
        },
        {
          "label": "Primary",
          "value": 8640
        },
        {
          "label": "Secondary",
          "value": 7910
        },
        {
          "label": "Higher Secondary",
          "value": 4380
        },
        {
          "label": "Graduate & Post Graduate Above",
          "value": 2112
        }
      ]
    }
  },
  {
    "id": "fm-enr-06",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Enrollment",
    "indicator": "Area under Coffee Cultivation (Arabica / Robusta)",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Sum Coffee Area for Arabica across all responses vs sum Coffee Area for Robusta across all responses.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Arabica",
          "value": 41280
        },
        {
          "label": "Robusta",
          "value": 33460
        }
      ]
    }
  },
  {
    "id": "fm-trn-01",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Training",
    "indicator": "Average Time Duration",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Average of training session duration (minutes).",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 92
    }
  },
  {
    "id": "fm-trn-02",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Training",
    "indicator": "Number of Farmers Trained",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Sum of 'Number of Farmers Attended training' across all training sessions.",
    "notes": "Fixes bug: was showing an incorrect total (465) \u2014 root cause was aggregating per-session count instead of summing attendance across sessions.",
    "result": {
      "type": "kpi",
      "value": 15480
    }
  },
  {
    "id": "fm-trn-03",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Training",
    "indicator": "Topics Covered During Training Session",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Count how many training sessions covered each topic; a session covering multiple topics counts individually toward each.",
    "notes": "Fixes bug: 'No Data Available' + wrong categories displayed.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Soil",
          "value": 860
        },
        {
          "label": "Water",
          "value": 640
        },
        {
          "label": "Biodiversity",
          "value": 510
        },
        {
          "label": "GHG",
          "value": 430
        },
        {
          "label": "Livelihoods",
          "value": 380
        }
      ]
    }
  },
  {
    "id": "fm-trn-04",
    "dashboard": "farmer-mobilization",
    "subDashboard": "Farmer Training",
    "indicator": "Mode of Training Session",
    "chartType": "donut",
    "chartLib": "echarts",
    "logic": "Count each Type of Training Conducted.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "FFS",
          "value": 620
        },
        {
          "label": "Group Training",
          "value": 310
        },
        {
          "label": "Individual Visit",
          "value": 180
        }
      ]
    }
  },
  {
    "id": "fm-demo-01",
    "dashboard": "farmer-mobilization",
    "subDashboard": "RegenAg Activity Demonstration",
    "indicator": "Number of Farmers Attended Demos",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Sum of Number of Farmers Observed/Participated.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 9870
    }
  },
  {
    "id": "fm-demo-02",
    "dashboard": "farmer-mobilization",
    "subDashboard": "RegenAg Activity Demonstration",
    "indicator": "Demo Participation Under Different Activities",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Count of responses per Theme of Demonstration Conducted.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Series 1",
          "value": 2140
        },
        {
          "label": "Series 2",
          "value": 1820
        },
        {
          "label": "Series 3",
          "value": 1590
        },
        {
          "label": "Series 4",
          "value": 1310
        },
        {
          "label": "Series 5",
          "value": 980
        }
      ]
    }
  },
  {
    "id": "fm-demo-03",
    "dashboard": "farmer-mobilization",
    "subDashboard": "RegenAg Activity Demonstration",
    "indicator": "Total Area Adopted (acres)",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Sum acreage across all adopted-practice categories, divided by 2.471 (acres \u2192 hectares).",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 18240
    }
  },
  {
    "id": "fm-demo-04",
    "dashboard": "farmer-mobilization",
    "subDashboard": "RegenAg Activity Demonstration",
    "indicator": "Area Adopted Under Different Practices",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Compare summed acreage across the 5 practice categories. Show absolute number always, percentage on hover.",
    "notes": "SHEET CONFLICT: the Validations column (G22) asks for '5 Bars Comparison' while the Revised Logic column (I22) says 'display in a pie chart' \u2014 Revised Logic wins as the latest correction, implemented as pie. Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Soil Health",
          "value": 7420
        },
        {
          "label": "Water",
          "value": 3810
        },
        {
          "label": "Biodiversity",
          "value": 2960
        },
        {
          "label": "Climate Mitigation",
          "value": 2210
        },
        {
          "label": "Livelihood",
          "value": 1840
        }
      ]
    }
  },
  {
    "id": "rap-hect-01",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Total Land Under Sustainable Coffee Farming",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Same as 'Total Area Adopted' \u2014 sum acreage across all adopted-practice categories / 2.471.",
    "notes": "Working as per current logic \u2014 no change. Duplicate KPI of fm-demo-03, surfaced here for the Regen Practices dashboard's own headline card.",
    "result": {
      "type": "kpi",
      "value": 18240
    }
  },
  {
    "id": "rap-hect-02",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Conservation Practices Adopted",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Among responses that answered Yes to 'Riparian Barriers/Trenches/Cradle pits on plantation slopes', count which specific option was picked.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Riparian Barriers",
          "value": 1240
        },
        {
          "label": "Trenches",
          "value": 860
        },
        {
          "label": "Cradle Pits",
          "value": 1510
        },
        {
          "label": "Others",
          "value": 210
        }
      ]
    }
  },
  {
    "id": "rap-hect-03",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Irrigation Methods Used",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Multi-select \u2014 each option selected in a response counts individually toward that option's slice.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Rainfed",
          "value": 4210
        },
        {
          "label": "Sprinkler",
          "value": 3120
        },
        {
          "label": "Drip",
          "value": 2680
        },
        {
          "label": "Solar Pump",
          "value": 940
        },
        {
          "label": "Open Storage",
          "value": 1310
        }
      ]
    }
  },
  {
    "id": "rap-hect-04",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Usage of Regen Ag Inputs",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Only visible when 'Use of NPM/IPM/RegenAg inputs' = Yes (skip logic); count each option chosen. Ignore blanks.",
    "notes": "Fixes bug: was rendered as a bar graph and returned 'No Data Available' \u2014 correct chart type is pie; query above resolves the missing-data issue (the skip-logic dependency on use_of_npm='1' was not applied).",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "On-farm Enriched Composting",
          "value": 3860
        },
        {
          "label": "Biological Concoctions",
          "value": 2940
        }
      ]
    }
  },
  {
    "id": "rap-hect-05",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Methods of On-farm Enriched Composting",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each Method of On-farm Enriched Composting option selected.",
    "notes": "Fixes bug: 'No Data Available' and a missing 'None' option (only 4 of 5 were visible).",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Bio-digesters",
          "value": 1210
        },
        {
          "label": "Bio-char",
          "value": 940
        },
        {
          "label": "Enzyme-tech",
          "value": 610
        },
        {
          "label": "Heap/Pit Composting",
          "value": 1980
        },
        {
          "label": "None",
          "value": 2340
        }
      ]
    }
  },
  {
    "id": "rap-hect-06",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Rainwater Harvesting",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Among Yes responses to Rainwater Harvesting, count each method selected.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Cradle Pits",
          "value": 980
        },
        {
          "label": "Check Dams",
          "value": 1240
        },
        {
          "label": "Contour Bunding",
          "value": 860
        },
        {
          "label": "Open Storage",
          "value": 520
        }
      ]
    }
  },
  {
    "id": "rap-hect-07",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Post-harvest De-pulping",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Count each Post-harvest de-pulping method selected.",
    "notes": "Fixes bug: 'No Data Available' and a missing 'None' option (only 2 of 3 were visible).",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Conventional",
          "value": 6210
        },
        {
          "label": "Ecopulper",
          "value": 4980
        },
        {
          "label": "None",
          "value": 2340
        }
      ]
    }
  },
  {
    "id": "rap-hect-08",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Urea Alternatives Adopted",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Count each urea-alternative option selected.",
    "notes": "Fixes bug: 'No Data Available' and a missing 'None' option (only 3 of 4 were visible).",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Neem Coated",
          "value": 2840
        },
        {
          "label": "Nano Urea",
          "value": 1960
        },
        {
          "label": "Liquid Urea",
          "value": 1120
        },
        {
          "label": "None",
          "value": 8460
        }
      ]
    }
  },
  {
    "id": "rap-hect-09",
    "dashboard": "regen-practices",
    "subDashboard": "Hectares under Regenerative Agriculture",
    "indicator": "Integrated Pest Management",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Count each IPM option selected.",
    "notes": "Fixes bug: 'No Data Available' and a missing 'None' option (only 3 of 4 were visible).",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Eco-friendly Methods",
          "value": 1840
        },
        {
          "label": "Biological Methods",
          "value": 2210
        },
        {
          "label": "Pheromone Traps",
          "value": 960
        },
        {
          "label": "None",
          "value": 7120
        }
      ]
    }
  },
  {
    "id": "rap-nutr-01",
    "dashboard": "regen-practices",
    "subDashboard": "Nutrient Management and Regen Ag Inputs",
    "indicator": "Inputs Provided During the Visit",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Count each input type selected during the visit.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Seedlings",
          "value": 3210
        },
        {
          "label": "Biochar",
          "value": 1840
        },
        {
          "label": "Fertilizers",
          "value": 2960
        },
        {
          "label": "Bio Traps",
          "value": 1120
        },
        {
          "label": "Cover Crop Seeds",
          "value": 1680
        },
        {
          "label": "Others",
          "value": 640
        }
      ]
    }
  },
  {
    "id": "rap-nutr-02",
    "dashboard": "regen-practices",
    "subDashboard": "Nutrient Management and Regen Ag Inputs",
    "indicator": "Quantity of Inputs Distributed",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Sum of Input Quantity Distributed across all responses.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "kpi",
      "value": 48620
    }
  },
  {
    "id": "sh-demo-01",
    "dashboard": "soil-health",
    "subDashboard": "Demonstration on Soil Health Practices",
    "indicator": "Demonstrations Conducted for Soil Health Practices",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses where Type of Activity = Soil Health.",
    "notes": "Fixes bug: was showing zero despite Soil Health responses existing \u2014 root cause was matching on the wrong option code/value.",
    "result": {
      "type": "kpi",
      "value": 640
    }
  },
  {
    "id": "sh-demo-02",
    "dashboard": "soil-health",
    "subDashboard": "Demonstration on Soil Health Practices",
    "indicator": "Activities Conducted for Improving Soil Health",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each option selected; show percentage on hover, absolute count always.",
    "notes": "Fixes bug: was 'No Data Available'; changed to pie chart per spec.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Cover Cropping",
          "value": 420
        },
        {
          "label": "Alternative Fertilization",
          "value": 180
        }
      ]
    }
  },
  {
    "id": "sh-demo-03",
    "dashboard": "soil-health",
    "subDashboard": "Demonstration on Soil Health Practices",
    "indicator": "Demonstrations to Reduce Emissions",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each option selected; show percentage on hover, absolute count always.",
    "notes": "Fixes bug: was 'No Data Available'; changed to pie chart per spec.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Composting",
          "value": 360
        },
        {
          "label": "Reduced Tillage",
          "value": 210
        }
      ]
    }
  },
  {
    "id": "wm-01",
    "dashboard": "water-management",
    "subDashboard": "Water Use and Management",
    "indicator": "Activities Related to Water Use Efficiency",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each option selected for water-use-efficiency activities.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Drip Irrigation",
          "value": 480
        },
        {
          "label": "Rainwater Harvesting",
          "value": 310
        }
      ]
    }
  },
  {
    "id": "wm-02",
    "dashboard": "water-management",
    "subDashboard": "Water Use and Management",
    "indicator": "Farmers Practicing Rainwater Harvesting",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses answering Yes to Rainwater Harvesting.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 3600
    }
  },
  {
    "id": "wm-03",
    "dashboard": "water-management",
    "subDashboard": "Water Use and Management",
    "indicator": "Water Conservation Practices Adopted",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses where 'Water' (Option ID 2) is selected in Observed Adoption of Demonstrated Practices.",
    "notes": "Fixes bug: was rendered as a graph with 'No Data Available' \u2014 correct presentation is a single card.",
    "result": {
      "type": "kpi",
      "value": 5210
    }
  },
  {
    "id": "wm-04",
    "dashboard": "water-management",
    "subDashboard": "Water Use and Management",
    "indicator": "Number of Adoptions of Different Water Conservation Practices",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Multi-select \u2014 each response's selected options counted individually toward each category.",
    "notes": "Fixes bug: chart type corrected to pie; was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Farm Pond",
          "value": 2140
        },
        {
          "label": "Trenches & Cradle Pits",
          "value": 1680
        },
        {
          "label": "Drip/Sprinkler",
          "value": 2960
        }
      ]
    }
  },
  {
    "id": "wm-05",
    "dashboard": "water-management",
    "subDashboard": "Water Use and Management",
    "indicator": "Acreage of Land under Water Conservation Practices",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Sum acreage per water-practice column and compare; blanks ignored.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Farm Pond",
          "value": 4820
        },
        {
          "label": "Trenches & Cradle Pits",
          "value": 3610
        },
        {
          "label": "Drip/Sprinkler",
          "value": 5240
        }
      ]
    }
  },
  {
    "id": "sh-adopt-01",
    "dashboard": "soil-health",
    "subDashboard": "Adoption of Practices",
    "indicator": "Number of Farmers Attended Demos",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Total response count in Demo Farm Activity.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 2840
    }
  },
  {
    "id": "sh-adopt-02",
    "dashboard": "soil-health",
    "subDashboard": "Adoption of Practices",
    "indicator": "Number of Farmers Adopted Soil Health Practices",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses that answered 'Please select the practices adopted under Soil Health'.",
    "notes": "Fixes bug: was wrongly displayed as a pie chart \u2014 corrected to a card.",
    "result": {
      "type": "kpi",
      "value": 8420
    }
  },
  {
    "id": "sh-adopt-03",
    "dashboard": "soil-health",
    "subDashboard": "Adoption of Practices",
    "indicator": "Sustainable Input Usage",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Total count of responses to 'Use of NPM/IPM/RegenAg inputs' (Yes/No).",
    "notes": "Fixes bug: was wrongly displayed as a pie chart \u2014 corrected to a card.",
    "result": {
      "type": "kpi",
      "value": 9640
    }
  },
  {
    "id": "sh-adopt-04",
    "dashboard": "soil-health",
    "subDashboard": "Adoption of Practices",
    "indicator": "Usage of Regen Ag Inputs",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Same as rap-hect-04 \u2014 surfaced again under Soil Health's Adoption of Practices sub-dashboard.",
    "notes": "Fixes bug: bar graph shown in error, no data returned \u2014 corrected to pie with proper skip-logic filter.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "On-farm Enriched Composting",
          "value": 3860
        },
        {
          "label": "Biological Concoctions",
          "value": 2940
        }
      ]
    }
  },
  {
    "id": "sh-adopt-05",
    "dashboard": "soil-health",
    "subDashboard": "Adoption of Practices",
    "indicator": "Methods of On-farm Enriched Composting",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Same as rap-hect-05 \u2014 surfaced again under Soil Health's Adoption of Practices sub-dashboard.",
    "notes": "Fixes bug: 'No Data Available' and a missing 'None' option.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Bio-digesters",
          "value": 1210
        },
        {
          "label": "Bio-char",
          "value": 940
        },
        {
          "label": "Enzyme-tech",
          "value": 610
        },
        {
          "label": "Heap/Pit Composting",
          "value": 1980
        },
        {
          "label": "None",
          "value": 2340
        }
      ]
    }
  },
  {
    "id": "sh-adopt-06",
    "dashboard": "soil-health",
    "subDashboard": "Adoption of Practices",
    "indicator": "Urea Alternatives Adopted",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Same as rap-hect-08 \u2014 surfaced again under Soil Health's Adoption of Practices sub-dashboard.",
    "notes": "Fixes bug: 'No Data Available' and a missing 'None' option.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Neem Coated",
          "value": 2840
        },
        {
          "label": "Nano Urea",
          "value": 1960
        },
        {
          "label": "Liquid Urea",
          "value": 1120
        },
        {
          "label": "None",
          "value": 8460
        }
      ]
    }
  },
  {
    "id": "sh-part-01",
    "dashboard": "soil-health",
    "subDashboard": "Farmer Participation",
    "indicator": "Number of Farmers Adopting Any Practice",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count a response once if it answered Yes to any of the visit's multiple activity/adoption questions.",
    "notes": "ASSUMPTION: sheet says 'register the count if Yes for any activity \u2014 questions may vary as there are multiple activity questions in the form' without naming the exact column set. Implemented against the visit form's core Yes/No adoption toggles listed above; confirm the intended column list with the client before go-live.",
    "result": {
      "type": "kpi",
      "value": 12480
    }
  },
  {
    "id": "sh-lime-01",
    "dashboard": "soil-health",
    "subDashboard": "Lime Application",
    "indicator": "Soil Health Demo Participation",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses where Type of Activity = Soil Health.",
    "notes": "Fixes bug: was showing zero \u2014 same root cause and fix as sh-demo-01.",
    "result": {
      "type": "kpi",
      "value": 640
    }
  },
  {
    "id": "bio-tree-01",
    "dashboard": "biodiversity",
    "subDashboard": "Tree Diversity and Density",
    "indicator": "Activities Promoting Biodiversity (Demo)",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each option selected; show percentage on hover, absolute count always.",
    "notes": "Fixes bug: 'No Data Available'; changed to pie chart per spec.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Native Tree Planting",
          "value": 310
        },
        {
          "label": "Agroforestry Practices",
          "value": 190
        }
      ]
    }
  },
  {
    "id": "bio-tree-02",
    "dashboard": "biodiversity",
    "subDashboard": "Tree Diversity and Density",
    "indicator": "Number of Farmers Received Tree Seedlings",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses where 'Seedlings' selected in Inputs Provided During Visit.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 3210
    }
  },
  {
    "id": "bio-shade-01",
    "dashboard": "biodiversity",
    "subDashboard": "Shade and Canopy Management",
    "indicator": "Native Tree Planting in Demo Plots",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses where Type of Activity = Planting (option code 2).",
    "notes": "Fixes bug: was showing zero despite Planting responses existing \u2014 same root-cause class as sh-demo-01.",
    "result": {
      "type": "kpi",
      "value": 480
    }
  },
  {
    "id": "bio-shade-02",
    "dashboard": "biodiversity",
    "subDashboard": "Shade and Canopy Management",
    "indicator": "Farmers Adopting Practice on Own Coffee Farms",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses where 'Seedlings' selected in Inputs Provided During Visit.",
    "notes": "Working as per current logic \u2014 no change. Duplicate KPI of bio-tree-02, surfaced under this sub-dashboard per the sheet.",
    "result": {
      "type": "kpi",
      "value": 3210
    }
  },
  {
    "id": "bio-bark-01",
    "dashboard": "biodiversity",
    "subDashboard": "Bark Scrubbing",
    "indicator": "Activities Promoting Biodiversity",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Same source/logic as rap-hect-04.",
    "notes": "SHEET NOTE: this row's Question/Logic and Revised Logic text is identical to 'Usage of Regen Ag Inputs' (rows 26/41/54) rather than describing a bark-scrubbing-specific question \u2014 the schema has no bark-scrubbing field. Implemented literally as specified in the sheet; flag to client that this looks like a copy/paste artifact and confirm the intended source question for 'Bark Scrubbing'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "On-farm Enriched Composting",
          "value": 3860
        },
        {
          "label": "Biological Concoctions",
          "value": 2940
        }
      ]
    }
  },
  {
    "id": "bio-adopt-01",
    "dashboard": "biodiversity",
    "subDashboard": "Adoption of Practices",
    "indicator": "Activities Promoting Biodiversity",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Multi-select \u2014 each response's selected options counted individually toward each category.",
    "notes": "Fixes bug: category tag labels were tilted/wrapping oddly (render horizontally instead) and 'No Data Available' despite existing responses.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Native/Fruit Tree Seedlings Planted",
          "value": 2840
        },
        {
          "label": "Riparian Buffer Zones",
          "value": 1960
        },
        {
          "label": "NPM/IPM / Stopped Weedicide",
          "value": 2310
        },
        {
          "label": "Mixed Cropping",
          "value": 1480
        }
      ]
    }
  },
  {
    "id": "bio-adopt-02",
    "dashboard": "biodiversity",
    "subDashboard": "Adoption of Practices",
    "indicator": "Number of Adoptions of Different Biodiversity Activities",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Same source/logic as bio-adopt-01 \u2014 a second view of the same breakdown per the sheet.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Native/Fruit Tree Seedlings Planted",
          "value": 2840
        },
        {
          "label": "Riparian Buffer Zones",
          "value": 1960
        },
        {
          "label": "NPM/IPM / Stopped Weedicide",
          "value": 2310
        },
        {
          "label": "Mixed Cropping",
          "value": 1480
        }
      ]
    }
  },
  {
    "id": "bio-adopt-03",
    "dashboard": "biodiversity",
    "subDashboard": "Adoption of Practices",
    "indicator": "Acreage under Biodiversity Practices",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Sum acreage per biodiversity-practice column and compare.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Native/Fruit Tree Seedlings",
          "value": 3210
        },
        {
          "label": "Riparian Buffer Zones",
          "value": 2140
        },
        {
          "label": "NPM/IPM / Stopped Weedicide",
          "value": 2680
        },
        {
          "label": "Mixed Cropping",
          "value": 1590
        }
      ]
    }
  },
  {
    "id": "cli-adopt-01",
    "dashboard": "climate-ghg",
    "subDashboard": "Adoption of Practices",
    "indicator": "Activities to Reduce Emissions",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each option selected in Q49 of Individual Farmer Visit.",
    "notes": "SHEET FLAG: form/table reference (order32) does not exist on individual_farmer_visit \u2014 it belongs to demo_farm_activity (see sh-demo-03). Marked 'NO DATA AVAILABLE' in the sheet, consistent with this mismatch. Implemented against demo_farm_activity.order32 (the only table that has this column) pending client confirmation.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Composting",
          "value": 360
        },
        {
          "label": "Reduced Tillage",
          "value": 210
        }
      ]
    }
  },
  {
    "id": "cli-adopt-02",
    "dashboard": "climate-ghg",
    "subDashboard": "Adoption of Practices",
    "indicator": "Number of Adoptions of Different Emission-Reduction Activities",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Multi-select \u2014 each response's selected options counted individually toward each category.",
    "notes": "Was 'NO DATA AVAILABLE'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Two-tier Canopy Management",
          "value": 2140
        },
        {
          "label": "Split Dose Fertilizer Application",
          "value": 1680
        },
        {
          "label": "Pulp Waste Treatment",
          "value": 1310
        }
      ]
    }
  },
  {
    "id": "cli-adopt-03",
    "dashboard": "climate-ghg",
    "subDashboard": "Adoption of Practices",
    "indicator": "Acreage under Emission-Reduction Activities",
    "chartType": "column",
    "chartLib": "highcharts",
    "logic": "Sum acreage per emission-reduction practice column and compare.",
    "notes": "Was 'NO DATA AVAILABLE'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Two-tier Canopy Management",
          "value": 2640
        },
        {
          "label": "Split Dose Fertilizer Application",
          "value": 1980
        },
        {
          "label": "Pulp Waste Treatment",
          "value": 1420
        }
      ]
    }
  },
  {
    "id": "live-inter-01",
    "dashboard": "livelihood",
    "subDashboard": "Intercropping with Fruit Trees and High-Value Biomass",
    "indicator": "Intercropping Plots",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses where Measures for Improving Income = Crop Diversification (option code 1).",
    "notes": "Fixes bug: was showing zero despite Crop Diversification responses existing \u2014 same root-cause class as sh-demo-01.",
    "result": {
      "type": "kpi",
      "value": 380
    }
  },
  {
    "id": "live-inter-02",
    "dashboard": "livelihood",
    "subDashboard": "Intercropping with Fruit Trees and High-Value Biomass",
    "indicator": "Intercrops Grown with Coffee",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each intercrop option selected.",
    "notes": "Was 'No Data Available'.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Black Pepper",
          "value": 9840
        },
        {
          "label": "Cardamom",
          "value": 4210
        },
        {
          "label": "Fruit Trees",
          "value": 2680
        },
        {
          "label": "Areca Nut",
          "value": 1960
        },
        {
          "label": "Others",
          "value": 890
        }
      ]
    }
  },
  {
    "id": "live-api-01",
    "dashboard": "livelihood",
    "subDashboard": "Apiary for Pollination",
    "indicator": "Beehives Setup",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Sum of New Beehives Set Up.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 940
    }
  },
  {
    "id": "live-api-02",
    "dashboard": "livelihood",
    "subDashboard": "Apiary for Pollination",
    "indicator": "Farmers Generating Income Through Honey",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses where 'Honey' (Option ID 5) selected in Other Income Generating Activities (farm related).",
    "notes": "Fixes bug: was showing zero despite Honey responses existing \u2014 root cause was matching on the wrong option code.",
    "result": {
      "type": "kpi",
      "value": 520
    }
  },
  {
    "id": "live-adopt-01",
    "dashboard": "livelihood",
    "subDashboard": "Adoption of Practices",
    "indicator": "Demonstration to Improve Income",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each Measures for Improving Income option; show absolute number always, percentage on hover.",
    "notes": "Fixes bug: was 'No Data Available' despite existing responses.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Crop Diversification",
          "value": 380
        },
        {
          "label": "Off-farm Activities",
          "value": 210
        },
        {
          "label": "Apiary (Beekeeping)",
          "value": 160
        },
        {
          "label": "Aquaculture",
          "value": 90
        }
      ]
    }
  },
  {
    "id": "live-adopt-02",
    "dashboard": "livelihood",
    "subDashboard": "Adoption of Practices",
    "indicator": "Number of Adoptions under Livelihood Diversification",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Total count of responses where 'Please select the practices adopted under Livelihood diversification' is answered.",
    "notes": "Fixes bug: source question was wrongly mapped \u2014 remapped to livelihood_practices as specified in the revised logic.",
    "result": {
      "type": "kpi",
      "value": 4680
    }
  },
  {
    "id": "live-adopt-03",
    "dashboard": "livelihood",
    "subDashboard": "Adoption of Practices",
    "indicator": "Acreage under Livelihood Diversification",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Sum of Total Acreage Livelihood Diversification across all responses.",
    "notes": "Fixes bug: was wrongly mapped and showed 'No Data Available'; changed from a graph to a top-of-page card.",
    "result": {
      "type": "kpi",
      "value": 6240
    }
  },
  {
    "id": "oth-01",
    "dashboard": "others",
    "subDashboard": "Others",
    "indicator": "Farmers Who Got Soil Samples Tested After Aug 2024",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses answering Yes to soil sample testing after August 2024.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 3960
    }
  },
  {
    "id": "oth-02",
    "dashboard": "others",
    "subDashboard": "Others",
    "indicator": "Count of Beneficiaries Accessing Schemes",
    "chartType": "kpi",
    "chartLib": "none",
    "logic": "Count of responses answering Yes to accessing Schemes/Subsidies/loans/grants through ICCRL.",
    "notes": "Working as per current logic \u2014 no change.",
    "result": {
      "type": "kpi",
      "value": 4310
    }
  },
  {
    "id": "oth-03",
    "dashboard": "others",
    "subDashboard": "Others",
    "indicator": "Source of Scheme Access (ICCRL)",
    "chartType": "pie",
    "chartLib": "echarts",
    "logic": "Count each institution option selected among Yes/ICCRL responses.",
    "notes": "Was 'No Data Available' despite existing responses.",
    "result": {
      "type": "series",
      "series": [
        {
          "label": "Govt Dept Scheme",
          "value": 1840
        },
        {
          "label": "Bank",
          "value": 1120
        },
        {
          "label": "Microfinance",
          "value": 640
        },
        {
          "label": "SHG",
          "value": 480
        },
        {
          "label": "Others",
          "value": 230
        }
      ]
    }
  }
];
