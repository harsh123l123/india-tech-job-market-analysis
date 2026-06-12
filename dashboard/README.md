# India Tech Job Market Dashboard Website

This is a premium, client-side interactive visualization dashboard showing tech job market insights across India for the years 2024–2026. It loads data dynamically from the central dataset and provides an elegant dark-theme glassmorphism user interface.

---

## 🌟 Key Features

1. **Executive Summary Analytics**:
   - Dynamic counter KPI metrics (active openings, median salary in LPA, average company rating, competition level).
   - Six interactive **Chart.js** visualizations including:
     - *Salary Distribution*: Track market salary spreads.
     - *Experience vs. Salary*: See salary growth from Fresher to Lead positions.
     - *Top Skills*: Bar charts detailing the top 10 most in-demand technologies.
     - *Work Mode & Company Type Share*: Doughnut breakdowns.
     - *City Hubs*: Dual-axis openings volume vs. median salary comparison.
2. **Career Path Estimator (Salary & Skill Calculator)**:
   - Select your target role and seniority.
   - Select your current skills from a searchable checkbox catalog.
   - Calculates estimated market salary LPA and range.
   - highlights **Skill Gaps** (skills you don't possess that have the highest salary premiums for that role, e.g., `+ ₹2.4L LPA`).
   - Identifies active hiring employers matching your profile.
3. **Job Postings Explorer**:
   - Clean data table listing postings.
   - Filters on 6 different dimensions (title, experience, city, work mode, company type, industry) update the entire dashboard in real-time.
   - Instant search bar and custom sorting (salary, date posted, rating, applicants).
   - Pagination control (10 items per page).
   - Details modal on click with full description and tags.

---

## 📂 Folder Structure

```
dashboard/
├── index.html     # Dashboard layout skeleton
├── style.css      # Dark mode styling (variables, glassmorphic cards, responsive rules)
├── app.js         # CSV parsing, state filtering, Chart.js managers, calculator algorithms
└── README.md      # This file
```

---

## 🚀 How to Run the Website

Because the website fetches the dataset CSV file (`../dataset/india_job_market_2024_2026.csv`) dynamically, it needs to be served using a local HTTP server (browser security policies block local file fetching otherwise).

### Step 1: Open Terminal in Project Root
Navigate to the root folder:
```bash
cd "d:\DS & ML\job analyts"
```

### Step 2: Start Local HTTP Server
Run **one** of the following commands:

* **Using Python (Recommended & Built-in)**:
  ```bash
  python -m http.server 8000
  ```
* **Using Node.js (live-server)**:
  ```bash
  npx live-server --port=8000
  ```

### Step 3: Open Browser
Go to:
**[http://localhost:8000/dashboard/index.html](http://localhost:8000/dashboard/index.html)**

The site will automatically load, parse the CSV dataset, and display the dashboard instantly.

---

## 📝 Technologies Used
- **Structure**: Semantic HTML5
- **Styling**: Modern Vanilla CSS3 Grid, Flexbox, & Variables (No external CSS frameworks required)
- **Charts**: Chart.js CDN (interactive, high-performance HTML5 Canvas)
- **Icons**: FontAwesome Web Icons
- **Data Parser**: Custom lightweight Javascript CSV tokenizer
