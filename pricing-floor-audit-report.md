# WE Offers — GB Minimum-Floor Pricing Audit

Read-only Apps Script payload timestamp: 2026-11-08T18:17:55.636Z.
Source rows normalized: 10 regular plans, 8 offer rows, 12 enabled Custom Pricing rules.
Prebooking toggles: start day 1=true; start day 16=true.
All monetary values are EGP; monthly rates and package prices come from the normalized live response.

| Package | GB | Minutes | Scenario | Duration | Month days | Source | GB/min unit rates | Monthly reference | Monthly GB price | Raw minutes price | Capped minutes component | Billable days | Proportional GB/price | Final GB component | GB floor | Raw combined price | Final price |
|---|---:|---:|---|---:|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| GB-only custom | 10 | 0 | Current Nov 2026 | 10 | 30 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 17 | 90.67 | 130.00 | 130.00 | 130.00 | 130.00 |
| GB-only custom | 10 | 0 | Next Dec 2026 · start 1 | 10 | 31 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 17 | 87.74 | 130.00 | 130.00 | 130.00 | 130.00 |
| GB-only custom | 10 | 0 | Next Dec 2026 · start 16 | 10 | 31 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 17 | 87.74 | 130.00 | 130.00 | 130.00 | 130.00 |
| GB-only custom | 10 | 0 | Current Nov 2026 | 16 | 30 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 23 | 122.67 | 130.00 | 130.00 | 130.00 | 130.00 |
| GB-only custom | 10 | 0 | Next Dec 2026 · start 1 | 16 | 31 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 23 | 118.71 | 130.00 | 130.00 | 130.00 | 130.00 |
| GB-only custom | 10 | 0 | Next Dec 2026 · start 16 | 16 | 31 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 23 | 118.71 | 130.00 | 130.00 | 130.00 | 130.00 |
| GB-only custom | 10 | 0 | Current Nov 2026 | 20 | 30 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 27 | 144.00 | 144.00 | 130.00 | 144.00 | 145.00 |
| GB-only custom | 10 | 0 | Next Dec 2026 · start 1 | 20 | 31 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 27 | 139.35 | 139.35 | 130.00 | 139.35 | 140.00 |
| GB-only custom | 10 | 0 | Next Dec 2026 · start 16 | 20 | 31 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 27 | 139.35 | 139.35 | 130.00 | 139.35 | 140.00 |
| GB-only custom | 10 | 0 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 30 | 160.00 | 160.00 | 130.00 | 160.00 | 160.00 |
| GB-only custom | 10 | 0 | Next Dec 2026 · start 1 | 25 | 31 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 31 | 160.00 | 160.00 | 130.00 | 160.00 | 160.00 |
| GB-only custom | 10 | 0 | Next Dec 2026 · start 16 | 25 | 31 | Custom pricing | GB 16 | 160.00 | 160.00 | — | — | 31 | 160.00 | 160.00 | 130.00 | 160.00 | 160.00 |
| GB-only custom | 30 | 0 | Current Nov 2026 | 13 | 30 | Custom pricing | GB 12.5 | 375.00 | 375.00 | — | — | 20 | 250.00 | 250.00 | 250.00 | 250.00 | 250.00 |
| GB-only custom | 30 | 0 | Next Dec 2026 · start 1 | 13 | 31 | Custom pricing | GB 12.5 | 375.00 | 375.00 | — | — | 20 | 241.94 | 250.00 | 250.00 | 250.00 | 250.00 |
| GB-only custom | 30 | 0 | Next Dec 2026 · start 16 | 13 | 31 | Custom pricing | GB 12.5 | 375.00 | 375.00 | — | — | 20 | 241.94 | 250.00 | 250.00 | 250.00 | 250.00 |
| GB-only custom | 30 | 0 | Current Nov 2026 | 14 | 30 | Custom pricing | GB 12.5 | 375.00 | 375.00 | — | — | 21 | 262.50 | 262.50 | 250.00 | 262.50 | 265.00 |
| GB-only custom | 30 | 0 | Next Dec 2026 · start 1 | 14 | 31 | Custom pricing | GB 12.5 | 375.00 | 375.00 | — | — | 21 | 254.03 | 254.03 | 250.00 | 254.03 | 255.00 |
| GB-only custom | 30 | 0 | Next Dec 2026 · start 16 | 14 | 31 | Custom pricing | GB 12.5 | 375.00 | 375.00 | — | — | 21 | 254.03 | 254.03 | 250.00 | 254.03 | 255.00 |
| GB-only custom | 50 | 0 | Current Nov 2026 | 10 | 30 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 17 | 332.92 | 450.00 | 450.00 | 450.00 | 450.00 |
| GB-only custom | 50 | 0 | Next Dec 2026 · start 1 | 10 | 31 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 17 | 322.18 | 450.00 | 450.00 | 450.00 | 450.00 |
| GB-only custom | 50 | 0 | Next Dec 2026 · start 16 | 10 | 31 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 17 | 322.18 | 450.00 | 450.00 | 450.00 | 450.00 |
| GB-only custom | 50 | 0 | Current Nov 2026 | 16 | 30 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 23 | 450.42 | 450.42 | 450.00 | 450.42 | 455.00 |
| GB-only custom | 50 | 0 | Next Dec 2026 · start 1 | 16 | 31 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 23 | 435.89 | 450.00 | 450.00 | 450.00 | 450.00 |
| GB-only custom | 50 | 0 | Next Dec 2026 · start 16 | 16 | 31 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 23 | 435.89 | 450.00 | 450.00 | 450.00 | 450.00 |
| GB-only custom | 50 | 0 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 30 | 587.50 | 587.50 | 450.00 | 587.50 | 590.00 |
| GB-only custom | 50 | 0 | Next Dec 2026 · start 1 | 25 | 31 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 31 | 587.50 | 587.50 | 450.00 | 587.50 | 590.00 |
| GB-only custom | 50 | 0 | Next Dec 2026 · start 16 | 25 | 31 | Custom pricing | GB 11.75 | 587.50 | 587.50 | — | — | 31 | 587.50 | 587.50 | 450.00 | 587.50 | 590.00 |
| GB-only custom | 65 | 0 | Current Nov 2026 | 10 | 30 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 17 | 425.43 | 525.00 | 525.00 | 525.00 | 525.00 |
| GB-only custom | 65 | 0 | Next Dec 2026 · start 1 | 10 | 31 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 17 | 411.70 | 525.00 | 525.00 | 525.00 | 525.00 |
| GB-only custom | 65 | 0 | Next Dec 2026 · start 16 | 10 | 31 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 17 | 411.70 | 525.00 | 525.00 | 525.00 | 525.00 |
| GB-only custom | 65 | 0 | Current Nov 2026 | 16 | 30 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 23 | 575.58 | 575.58 | 525.00 | 575.58 | 580.00 |
| GB-only custom | 65 | 0 | Next Dec 2026 · start 1 | 16 | 31 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 23 | 557.01 | 557.01 | 525.00 | 557.01 | 560.00 |
| GB-only custom | 65 | 0 | Next Dec 2026 · start 16 | 16 | 31 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 23 | 557.01 | 557.01 | 525.00 | 557.01 | 560.00 |
| GB-only custom | 65 | 0 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 30 | 750.75 | 750.75 | 525.00 | 750.75 | 755.00 |
| GB-only custom | 65 | 0 | Next Dec 2026 · start 1 | 25 | 31 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 31 | 750.75 | 750.75 | 525.00 | 750.75 | 755.00 |
| GB-only custom | 65 | 0 | Next Dec 2026 · start 16 | 25 | 31 | Custom pricing | GB 11.55 | 750.75 | 750.75 | — | — | 31 | 750.75 | 750.75 | 525.00 | 750.75 | 755.00 |
| Combined | 10 | 100 | Current Nov 2026 | 1 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 8 | 34.67 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 2 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 9 | 39.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 6 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 13 | 56.33 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 7 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 14 | 60.67 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 8 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 15 | 65.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 9 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 16 | 69.33 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 10 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 17 | 73.67 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 11 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 18 | 78.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 15 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 22 | 95.33 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 16 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 23 | 99.67 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 20 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 27 | 117.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 30 | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 30 | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 30 | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 1 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 8 | 33.55 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 2 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 9 | 37.74 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 6 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 13 | 54.52 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 7 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 14 | 58.71 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 8 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 15 | 62.90 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 9 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 16 | 67.10 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 10 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 17 | 71.29 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 11 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 18 | 75.48 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 15 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 22 | 92.26 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 16 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 23 | 96.45 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 20 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 27 | 113.23 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 23 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 30 | 125.81 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 24 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 31 | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | 25 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 31 | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 1 | Full month | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | — | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 1 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 8 | 33.55 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 2 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 9 | 37.74 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 6 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 13 | 54.52 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 7 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 14 | 58.71 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 8 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 15 | 62.90 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 9 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 16 | 67.10 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 10 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 17 | 71.29 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 11 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 18 | 75.48 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 15 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 22 | 92.26 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 16 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 23 | 96.45 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 20 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 27 | 113.23 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 23 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 30 | 125.81 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 24 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 31 | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | 25 | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | 31 | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 100 | Next Dec 2026 · start 16 | Full month | 31 | Custom pricing | GB 13 / min 0.06 | 136.00 | 130.00 | 6.00 | 6.00 | — | 130.00 | 130.00 | 130.00 | 136.00 | 140.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 1 | 30 | Active offer match | — | 190.00 | — | — | — | 8 | 50.67 | — | — | 50.67 | 55.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 2 | 30 | Active offer match | — | 190.00 | — | — | — | 9 | 57.00 | — | — | 57.00 | 60.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 6 | 30 | Active offer match | — | 190.00 | — | — | — | 13 | 82.33 | — | — | 82.33 | 85.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 7 | 30 | Active offer match | — | 190.00 | — | — | — | 14 | 88.67 | — | — | 88.67 | 90.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 8 | 30 | Active offer match | — | 190.00 | — | — | — | 15 | 95.00 | — | — | 95.00 | 95.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 9 | 30 | Active offer match | — | 190.00 | — | — | — | 16 | 101.33 | — | — | 101.33 | 105.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 10 | 30 | Active offer match | — | 190.00 | — | — | — | 17 | 107.67 | — | — | 107.67 | 110.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 11 | 30 | Active offer match | — | 190.00 | — | — | — | 18 | 114.00 | — | — | 114.00 | 115.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 15 | 30 | Active offer match | — | 190.00 | — | — | — | 22 | 139.33 | — | — | 139.33 | 140.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 16 | 30 | Active offer match | — | 190.00 | — | — | — | 23 | 145.67 | — | — | 145.67 | 150.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 20 | 30 | Active offer match | — | 190.00 | — | — | — | 27 | 171.00 | — | — | 171.00 | 175.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 23 | 30 | Active offer match | — | 190.00 | — | — | — | 30 | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 23 | 30 | Active offer match | — | 190.00 | — | — | — | 30 | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 10 | 1100 | Current Nov 2026 | 23 | 30 | Active offer match | — | 190.00 | — | — | — | 30 | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 1 | 31 | Active offer match | — | 190.00 | — | — | — | 8 | 49.03 | — | — | 49.03 | 50.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 2 | 31 | Active offer match | — | 190.00 | — | — | — | 9 | 55.16 | — | — | 55.16 | 60.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 6 | 31 | Active offer match | — | 190.00 | — | — | — | 13 | 79.68 | — | — | 79.68 | 80.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 7 | 31 | Active offer match | — | 190.00 | — | — | — | 14 | 85.81 | — | — | 85.81 | 90.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 8 | 31 | Active offer match | — | 190.00 | — | — | — | 15 | 91.94 | — | — | 91.94 | 95.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 9 | 31 | Active offer match | — | 190.00 | — | — | — | 16 | 98.06 | — | — | 98.06 | 100.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 10 | 31 | Active offer match | — | 190.00 | — | — | — | 17 | 104.19 | — | — | 104.19 | 105.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 11 | 31 | Active offer match | — | 190.00 | — | — | — | 18 | 110.32 | — | — | 110.32 | 115.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 15 | 31 | Active offer match | — | 190.00 | — | — | — | 22 | 134.84 | — | — | 134.84 | 135.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 16 | 31 | Active offer match | — | 190.00 | — | — | — | 23 | 140.97 | — | — | 140.97 | 145.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 20 | 31 | Active offer match | — | 190.00 | — | — | — | 27 | 165.48 | — | — | 165.48 | 170.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 23 | 31 | Active offer match | — | 190.00 | — | — | — | 30 | 183.87 | — | — | 183.87 | 185.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 24 | 31 | Active offer match | — | 190.00 | — | — | — | 31 | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | 25 | 31 | Active offer match | — | 190.00 | — | — | — | 31 | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 1 | Full month | 31 | Active offer match | — | 190.00 | — | — | — | — | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 1 | 31 | Active offer match | — | 190.00 | — | — | — | 8 | 49.03 | — | — | 49.03 | 50.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 2 | 31 | Active offer match | — | 190.00 | — | — | — | 9 | 55.16 | — | — | 55.16 | 60.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 6 | 31 | Active offer match | — | 190.00 | — | — | — | 13 | 79.68 | — | — | 79.68 | 80.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 7 | 31 | Active offer match | — | 190.00 | — | — | — | 14 | 85.81 | — | — | 85.81 | 90.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 8 | 31 | Active offer match | — | 190.00 | — | — | — | 15 | 91.94 | — | — | 91.94 | 95.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 9 | 31 | Active offer match | — | 190.00 | — | — | — | 16 | 98.06 | — | — | 98.06 | 100.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 10 | 31 | Active offer match | — | 190.00 | — | — | — | 17 | 104.19 | — | — | 104.19 | 105.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 11 | 31 | Active offer match | — | 190.00 | — | — | — | 18 | 110.32 | — | — | 110.32 | 115.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 15 | 31 | Active offer match | — | 190.00 | — | — | — | 22 | 134.84 | — | — | 134.84 | 135.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 16 | 31 | Active offer match | — | 190.00 | — | — | — | 23 | 140.97 | — | — | 140.97 | 145.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 20 | 31 | Active offer match | — | 190.00 | — | — | — | 27 | 165.48 | — | — | 165.48 | 170.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 23 | 31 | Active offer match | — | 190.00 | — | — | — | 30 | 183.87 | — | — | 183.87 | 185.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 24 | 31 | Active offer match | — | 190.00 | — | — | — | 31 | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | 25 | 31 | Active offer match | — | 190.00 | — | — | — | 31 | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 10 | 1100 | Next Dec 2026 · start 16 | Full month | 31 | Active offer match | — | 190.00 | — | — | — | — | 190.00 | — | — | 190.00 | 190.00 |
| Combined | 30 | 500 | Current Nov 2026 | 1 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 8 | 80.80 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 2 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 9 | 90.90 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 6 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 13 | 131.30 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 7 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 14 | 141.40 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 8 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 15 | 151.50 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 9 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 16 | 161.60 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 10 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 17 | 171.70 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 11 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 18 | 181.80 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 15 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 22 | 222.20 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 16 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 23 | 232.30 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Current Nov 2026 | 20 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 27 | 272.70 | 272.70 | 250.00 | 302.70 | 305.00 |
| Combined | 30 | 500 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 30 | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 30 | 500 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 30 | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 30 | 500 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 30 | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 1 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 8 | 78.19 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 2 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 9 | 87.97 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 6 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 13 | 127.06 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 7 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 14 | 136.84 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 8 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 15 | 146.61 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 9 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 16 | 156.39 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 10 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 17 | 166.16 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 11 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 18 | 175.94 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 15 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 22 | 215.03 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 16 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 23 | 224.81 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 20 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 27 | 263.90 | 263.90 | 250.00 | 293.90 | 295.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 23 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 30 | 293.23 | 293.23 | 250.00 | 323.23 | 325.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 24 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 31 | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | 25 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 31 | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 1 | Full month | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | — | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 1 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 8 | 78.19 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 2 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 9 | 87.97 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 6 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 13 | 127.06 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 7 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 14 | 136.84 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 8 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 15 | 146.61 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 9 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 16 | 156.39 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 10 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 17 | 166.16 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 11 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 18 | 175.94 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 15 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 22 | 215.03 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 16 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 23 | 224.81 | 250.00 | 250.00 | 280.00 | 280.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 20 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 27 | 263.90 | 263.90 | 250.00 | 293.90 | 295.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 23 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 30 | 293.23 | 293.23 | 250.00 | 323.23 | 325.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 24 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 31 | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | 25 | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | 31 | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 30 | 500 | Next Dec 2026 · start 16 | Full month | 31 | Custom pricing | GB 10.1 / min 0.06 | 333.00 | 303.00 | 30.00 | 30.00 | — | 303.00 | 303.00 | 250.00 | 333.00 | 335.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 1 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 8 | 133.33 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 2 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 9 | 150.00 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 6 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 13 | 216.67 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 7 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 14 | 233.33 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 8 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 15 | 250.00 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 9 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 16 | 266.67 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 10 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 17 | 283.33 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 11 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 18 | 300.00 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 15 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 22 | 366.67 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 16 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 23 | 383.33 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 20 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 27 | 450.00 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 30 | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 30 | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 50 | 1000 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 30 | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 1 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 8 | 129.03 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 2 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 9 | 145.16 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 6 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 13 | 209.68 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 7 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 14 | 225.81 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 8 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 15 | 241.94 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 9 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 16 | 258.06 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 10 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 17 | 274.19 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 11 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 18 | 290.32 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 15 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 22 | 354.84 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 16 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 23 | 370.97 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 20 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 27 | 435.48 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 23 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 30 | 483.87 | 483.87 | 450.00 | 533.87 | 535.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 24 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 31 | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | 25 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 31 | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 1 | Full month | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | — | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 1 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 8 | 129.03 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 2 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 9 | 145.16 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 6 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 13 | 209.68 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 7 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 14 | 225.81 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 8 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 15 | 241.94 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 9 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 16 | 258.06 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 10 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 17 | 274.19 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 11 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 18 | 290.32 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 15 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 22 | 354.84 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 16 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 23 | 370.97 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 20 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 27 | 435.48 | 450.00 | 450.00 | 500.00 | 500.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 23 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 30 | 483.87 | 483.87 | 450.00 | 533.87 | 535.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 24 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 31 | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | 25 | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | 31 | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 50 | 1000 | Next Dec 2026 · start 16 | Full month | 31 | Custom pricing | GB 10 / min 0.05 | 550.00 | 500.00 | 50.00 | 50.00 | — | 500.00 | 500.00 | 450.00 | 550.00 | 550.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 1 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 8 | 58.67 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 2 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 9 | 66.00 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 6 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 13 | 95.33 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 7 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 14 | 102.67 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 8 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 15 | 110.00 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 9 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 16 | 117.33 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 10 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 17 | 124.67 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 11 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 18 | 132.00 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 15 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 22 | 161.33 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 16 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 23 | 168.67 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 20 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 27 | 198.00 | 198.00 | 180.00 | 283.00 | 285.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 30 | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 30 | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Combined | 20 | 1700 | Current Nov 2026 | 23 | 30 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 30 | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 1 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 8 | 56.77 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 2 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 9 | 63.87 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 6 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 13 | 92.26 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 7 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 14 | 99.35 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 8 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 15 | 106.45 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 9 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 16 | 113.55 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 10 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 17 | 120.65 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 11 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 18 | 127.74 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 15 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 22 | 156.13 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 16 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 23 | 163.23 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 20 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 27 | 191.61 | 191.61 | 180.00 | 276.61 | 280.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 23 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 30 | 212.90 | 212.90 | 180.00 | 297.90 | 300.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 24 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 31 | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | 25 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 31 | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 1 | Full month | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | — | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 1 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 8 | 56.77 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 2 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 9 | 63.87 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 6 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 13 | 92.26 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 7 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 14 | 99.35 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 8 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 15 | 106.45 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 9 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 16 | 113.55 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 10 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 17 | 120.65 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 11 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 18 | 127.74 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 15 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 22 | 156.13 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 16 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 23 | 163.23 | 180.00 | 180.00 | 265.00 | 265.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 20 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 27 | 191.61 | 191.61 | 180.00 | 276.61 | 280.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 23 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 30 | 212.90 | 212.90 | 180.00 | 297.90 | 300.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 24 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 31 | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | 25 | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | 31 | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Combined | 20 | 1700 | Next Dec 2026 · start 16 | Full month | 31 | Custom pricing | GB 11 / min 0.05 | 305.00 | 220.00 | 85.00 | 85.00 | — | 220.00 | 220.00 | 180.00 | 305.00 | 305.00 |
| Minutes-only | 0 | 100 | Rate-only; duration-independent | 1 | 30 | Custom pricing | min 0.105 | 10.50 | — | 10.50 | — | — | — | — | — | 10.50 | 15.00 |
| Minutes-only | 0 | 100 | Rate-only; duration-independent | 6 | 30 | Custom pricing | min 0.105 | 10.50 | — | 10.50 | — | — | — | — | — | 10.50 | 15.00 |
| Minutes-only | 0 | 100 | Rate-only; duration-independent | 7 | 30 | Custom pricing | min 0.105 | 10.50 | — | 10.50 | — | — | — | — | — | 10.50 | 15.00 |
| Minutes-only | 0 | 100 | Rate-only; duration-independent | 9 | 30 | Custom pricing | min 0.105 | 10.50 | — | 10.50 | — | — | — | — | — | 10.50 | 15.00 |
| Minutes-only | 0 | 100 | Rate-only; duration-independent | 10 | 30 | Custom pricing | min 0.105 | 10.50 | — | 10.50 | — | — | — | — | — | 10.50 | 15.00 |
| Minutes-only | 0 | 100 | Rate-only; duration-independent | 16 | 30 | Custom pricing | min 0.105 | 10.50 | — | 10.50 | — | — | — | — | — | 10.50 | 15.00 |
| Minutes-only | 0 | 100 | Rate-only; duration-independent | 25 | 30 | Custom pricing | min 0.105 | 10.50 | — | 10.50 | — | — | — | — | — | 10.50 | 15.00 |
| Minutes-only | 0 | 500 | Rate-only; duration-independent | 1 | 30 | Custom pricing | min 0.105 | 52.50 | — | 52.50 | — | — | — | — | — | 52.50 | 55.00 |
| Minutes-only | 0 | 500 | Rate-only; duration-independent | 6 | 30 | Custom pricing | min 0.105 | 52.50 | — | 52.50 | — | — | — | — | — | 52.50 | 55.00 |
| Minutes-only | 0 | 500 | Rate-only; duration-independent | 7 | 30 | Custom pricing | min 0.105 | 52.50 | — | 52.50 | — | — | — | — | — | 52.50 | 55.00 |
| Minutes-only | 0 | 500 | Rate-only; duration-independent | 9 | 30 | Custom pricing | min 0.105 | 52.50 | — | 52.50 | — | — | — | — | — | 52.50 | 55.00 |
| Minutes-only | 0 | 500 | Rate-only; duration-independent | 10 | 30 | Custom pricing | min 0.105 | 52.50 | — | 52.50 | — | — | — | — | — | 52.50 | 55.00 |
| Minutes-only | 0 | 500 | Rate-only; duration-independent | 16 | 30 | Custom pricing | min 0.105 | 52.50 | — | 52.50 | — | — | — | — | — | 52.50 | 55.00 |
| Minutes-only | 0 | 500 | Rate-only; duration-independent | 25 | 30 | Custom pricing | min 0.105 | 52.50 | — | 52.50 | — | — | — | — | — | 52.50 | 55.00 |
| Minutes-only | 0 | 1000 | Rate-only; duration-independent | 1 | 30 | Custom pricing | min 0.105 | 105.00 | — | 105.00 | — | — | — | — | — | 105.00 | 105.00 |
| Minutes-only | 0 | 1000 | Rate-only; duration-independent | 6 | 30 | Custom pricing | min 0.105 | 105.00 | — | 105.00 | — | — | — | — | — | 105.00 | 105.00 |
| Minutes-only | 0 | 1000 | Rate-only; duration-independent | 7 | 30 | Custom pricing | min 0.105 | 105.00 | — | 105.00 | — | — | — | — | — | 105.00 | 105.00 |
| Minutes-only | 0 | 1000 | Rate-only; duration-independent | 9 | 30 | Custom pricing | min 0.105 | 105.00 | — | 105.00 | — | — | — | — | — | 105.00 | 105.00 |
| Minutes-only | 0 | 1000 | Rate-only; duration-independent | 10 | 30 | Custom pricing | min 0.105 | 105.00 | — | 105.00 | — | — | — | — | — | 105.00 | 105.00 |
| Minutes-only | 0 | 1000 | Rate-only; duration-independent | 16 | 30 | Custom pricing | min 0.105 | 105.00 | — | 105.00 | — | — | — | — | — | 105.00 | 105.00 |
| Minutes-only | 0 | 1000 | Rate-only; duration-independent | 25 | 30 | Custom pricing | min 0.105 | 105.00 | — | 105.00 | — | — | — | — | — | 105.00 | 105.00 |
| Minutes-only | 0 | 1500 | Rate-only; duration-independent | 1 | 30 | Custom pricing | min 0.105 | 157.50 | — | 157.50 | — | — | — | — | — | 157.50 | 160.00 |
| Minutes-only | 0 | 1500 | Rate-only; duration-independent | 6 | 30 | Custom pricing | min 0.105 | 157.50 | — | 157.50 | — | — | — | — | — | 157.50 | 160.00 |
| Minutes-only | 0 | 1500 | Rate-only; duration-independent | 7 | 30 | Custom pricing | min 0.105 | 157.50 | — | 157.50 | — | — | — | — | — | 157.50 | 160.00 |
| Minutes-only | 0 | 1500 | Rate-only; duration-independent | 9 | 30 | Custom pricing | min 0.105 | 157.50 | — | 157.50 | — | — | — | — | — | 157.50 | 160.00 |
| Minutes-only | 0 | 1500 | Rate-only; duration-independent | 10 | 30 | Custom pricing | min 0.105 | 157.50 | — | 157.50 | — | — | — | — | — | 157.50 | 160.00 |
| Minutes-only | 0 | 1500 | Rate-only; duration-independent | 16 | 30 | Custom pricing | min 0.105 | 157.50 | — | 157.50 | — | — | — | — | — | 157.50 | 160.00 |
| Minutes-only | 0 | 1500 | Rate-only; duration-independent | 25 | 30 | Custom pricing | min 0.105 | 157.50 | — | 157.50 | — | — | — | — | — | 157.50 | 160.00 |
| Minutes-only | 0 | 2000 | Rate-only; duration-independent | 1 | 30 | Custom pricing | min 0.105 | 210.00 | — | 210.00 | — | — | — | — | — | 210.00 | 210.00 |
| Minutes-only | 0 | 2000 | Rate-only; duration-independent | 6 | 30 | Custom pricing | min 0.105 | 210.00 | — | 210.00 | — | — | — | — | — | 210.00 | 210.00 |
| Minutes-only | 0 | 2000 | Rate-only; duration-independent | 7 | 30 | Custom pricing | min 0.105 | 210.00 | — | 210.00 | — | — | — | — | — | 210.00 | 210.00 |
| Minutes-only | 0 | 2000 | Rate-only; duration-independent | 9 | 30 | Custom pricing | min 0.105 | 210.00 | — | 210.00 | — | — | — | — | — | 210.00 | 210.00 |
| Minutes-only | 0 | 2000 | Rate-only; duration-independent | 10 | 30 | Custom pricing | min 0.105 | 210.00 | — | 210.00 | — | — | — | — | — | 210.00 | 210.00 |
| Minutes-only | 0 | 2000 | Rate-only; duration-independent | 16 | 30 | Custom pricing | min 0.105 | 210.00 | — | 210.00 | — | — | — | — | — | 210.00 | 210.00 |
| Minutes-only | 0 | 2000 | Rate-only; duration-independent | 25 | 30 | Custom pricing | min 0.105 | 210.00 | — | 210.00 | — | — | — | — | — | 210.00 | 210.00 |
| Combined minute component raw=50 | 10 | 833.3333333333334 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 180.00 | 130.00 | 50.00 | 50.00 | — | 130.00 | 130.00 | 130.00 | 180.00 | 180.00 |
| Combined minute component raw=50.1 | 10 | 835 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 180.10 | 130.00 | 50.10 | 50.10 | — | 130.00 | 130.00 | 130.00 | 180.10 | 185.00 |
| Combined minute component raw=50.7 | 10 | 845.0000000000001 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 180.70 | 130.00 | 50.70 | 50.70 | — | 130.00 | 130.00 | 130.00 | 180.70 | 185.00 |
| Combined minute component raw=54.9 | 10 | 915 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 184.90 | 130.00 | 54.90 | 54.90 | — | 130.00 | 130.00 | 130.00 | 184.90 | 185.00 |
| Combined minute component raw=55 | 10 | 916.6666666666667 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 185.00 | 130.00 | 55.00 | 55.00 | — | 130.00 | 130.00 | 130.00 | 185.00 | 185.00 |
| Combined minute component raw=56 | 10 | 933.3333333333334 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 186.00 | 130.00 | 56.00 | 56.00 | — | 130.00 | 130.00 | 130.00 | 186.00 | 190.00 |
| Combined minute component raw=83 | 10 | 1383.3333333333335 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 213.00 | 130.00 | 83.00 | 83.00 | — | 130.00 | 130.00 | 130.00 | 213.00 | 215.00 |
| Combined minute component raw=119 | 10 | 1983.3333333333335 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 249.00 | 130.00 | 119.00 | 119.00 | — | 130.00 | 130.00 | 130.00 | 249.00 | 250.00 |
| Combined minute component raw=120 | 10 | 2000 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 250.00 | 130.00 | 120.00 | 120.00 | — | 130.00 | 130.00 | 130.00 | 250.00 | 250.00 |
| Combined minute component raw=120.1 | 10 | 2001.6666666666667 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 250.00 | 130.00 | 120.10 | 120.00 | — | 130.00 | 130.00 | 130.00 | 250.00 | 250.00 |
| Combined minute component raw=150 | 10 | 2500 | Component boundary · full month | Full month | 30 | Custom pricing | GB 13 / min 0.06 | 250.00 | 130.00 | 150.00 | 120.00 | — | 130.00 | 130.00 | 130.00 | 250.00 | 250.00 |

## Audit notes

- GB-only and combined packages with at least 10 GB use the shared GB-based floor after +7-day proration; 1–9 GB have no floor.
- Custom combined packages prorate the GB component by MIN(selected days + 7, actual month days), apply the GB floor to that component only, add MIN(raw dynamic minutes price, 120), and round the resulting total upward to 5 EGP once. Neither component is rounded separately.
- Exact offer/regular matches keep the displayed monthly price as the reference; their components are not recalculated from Custom Pricing. Exact combined matches prorate that package reference for custom durations and are not component-floored.
- Active offer match precedes regular plan match; unmatched packages use Custom Pricing. GB-only matched/custom packages retain the GB floor because the whole package is the GB component.
- Full month uses the full matched/custom monthly reference and does not add seven days; custom GB-only and custom combined GB components retain the floor.
- The illustrative component arithmetic 140.4 + 59.2 = 199.6 → 200 is also tested directly, without rounding either component first.
- Minutes-only packages remain minute-rate × quantity with existing final-price behavior, duration-independent, and have no GB floor or 120 EGP cap.
- Current-month requests are bounded by remaining calendar days; next-month options use the selected enabled start day and the next month’s calendar length.
- Short-duration GB limit remains 20 GB for 1–7 days and is enforced through the existing shared custom input handler and render-time clamp.
- No Sheet rows or Apps Script settings were edited.

Audit table rows: 302.
