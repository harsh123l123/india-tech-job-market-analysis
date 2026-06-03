# India Tech Job Market Analysis (2024-2026)

**Comprehensive data-driven insights into India's technology employment landscape** — explore salary trends, in-demand skills, top employers, and career opportunities across 2024-2026.

---

## 🚀 Quick Start

- **What's inside?** 500+ tech job records from India's leading companies (MNCs, Unicorns, Startups, PSUs)
- **Key insights:** Salary distribution by role/location/experience, top 15 in-demand skills, high-paying roles, and market trends
- **Format:** Interactive Jupyter notebook with 18+ visualizations (histograms, bar charts, pie charts, heatmaps)
- **Time to explore:** 15-20 minutes to run end-to-end; 5 minutes to scan key findings
- **Best for:** Job seekers, recruiters, HR analysts, data enthusiasts, career planners

---

## 📊 Key Findings at a Glance

| Finding | Insight |
|---------|---------|
| **Salary Range** | ₹1.1L – ₹50L+ LPA (Entry-level to Lead roles) |
| **Top Skill** | Python, followed by Java, SQL, REST APIs, Docker |
| **Most Applied Role** | Power BI Developer, Business Analyst, Python Developer |
| **Highest-Paying Role** | Lead/Senior Backend/Full Stack Engineers (₹40L+) |
| **Job Hotspot** | Remote roles dominate; Bangalore, Delhi, Mumbai lead on-site |
| **Top Employer Sectors** | IT (largest), EdTech, Banking & Finance, HealthTech |
| **Company Types** | MNCs (~40%), Unicorns (~30%), Startups (~20%), PSU/Govt (~10%) |
| **Experience Impact** | Senior (6-10 yrs) earn ~2.5x more than Fresher roles |

---

## 📁 Dataset Overview

**File:** `india_job_market_2024_2026.csv` (500+ records)

**Key Columns:**
- **Job Details:** Job_ID, Job_Title, Job_Type (Full-Time/Part-Time/Internship), Work_Mode (On-Site/Remote/Hybrid)
- **Organization:** Company, Company_Type (MNC/Unicorn/Startup/PSU), Industry, Company_Rating
- **Compensation & Location:** Salary_LPA, City, Location_Tier (Remote/Tier 1/Tier 2)
- **Requirements:** Experience_Level (Fresher/Junior/Mid/Senior/Lead), Skills_Required, Education_Required
- **Metrics:** Openings, Applicants, Date_Posted

**Data Period:** 2024-2026 | **Geographic Scope:** Pan-India (Remote + 20+ cities)

---

## 📂 Project Structure

```
india-tech-job-market-analysis-2024-2026.ipynb   # Main analysis notebook (18+ sections)
dataset/
├── india_job_market_2024_2026.csv                # Raw data (500+ records)
README.md                                         # This file
```

---

## ⚙️ Setup & Usage

### Requirements
- **Python 3.8+**
- **Jupyter Notebook** or **JupyterLab**
- **Key Libraries:** pandas, matplotlib, seaborn, numpy

### Installation

**Step 1: Clone or download this repository**
```bash
# If you have Git
git clone <repository-url>
cd "d:\DS & ML\job analyts"

# OR manually download and extract the files
```

**Step 2: Install dependencies**
```bash
# Using pip
pip install jupyter pandas matplotlib seaborn numpy

# OR if using conda
conda install jupyter pandas matplotlib seaborn numpy
```

**Step 3: Launch the notebook**
```bash
# Start Jupyter from the project directory
jupyter notebook india-tech-job-market-analysis-2024-2026.ipynb

# OR use JupyterLab (modern alternative)
jupyter lab india-tech-job-market-analysis-2024-2026.ipynb
```

**Step 4: Run all cells**
- In Jupyter, click **Kernel > Restart & Run All** or press `Ctrl+Shift+Enter`
- Charts and findings will render inline below each cell

---

## 📈 Visualizations Preview

The notebook includes 18+ publication-ready charts:

1. **Salary Distribution** — Histogram + KDE curve showing market salary ranges
2. **Temporal Trends** — Monthly/yearly job posting patterns (seasonality analysis)
3. **Top 15 Job Titles** — By applicant count (most competitive roles)
4. **Highest-Paying Roles** — Top 15 by median salary
5. **Top Employers** — Companies ranked by hiring volume
6. **Industry Breakdown** — IT, EdTech, Banking, HealthTech demand
7. **In-Demand Skills** — Top 15 technical skills by frequency
8. **High-Paying Skills** — Skills correlated with premium salaries
9. **Experience vs. Salary** — Progression from Fresher → Lead
10. **Geographic Heatmap** — Salary and job density by city
11. **Company Type Distribution** — MNC vs. Startup vs. Unicorn vs. PSU
12. **Work Mode Trends** — On-Site vs. Remote vs. Hybrid salary comparison
13. **Education Requirements** — B.Tech, M.Tech, MCA demand analysis

---

## 💼 For Career Seekers

**How to use this analysis for your job search:**

1. **Benchmark your salary** — Check median salary for your target role, experience level, and location
2. **Identify skill gaps** — See which skills command highest salaries in your preferred domain
3. **Find job hotspots** — Explore which cities, companies, and industries are hiring most
4. **Choose work mode wisely** — Compare on-site, remote, and hybrid salary premiums
5. **Plan career progression** — Understand typical salary growth from Fresher → Senior → Lead
6. **Filter by company type** — See if MNCs, Startups, or Unicorns align with your career goals

**Pro tip:** Download the CSV and filter by your preferred location, experience level, and skills to identify realistic salary targets.

---

## 🔬 For Data Analysts & Researchers

**Technical approach & reproducibility:**

- **Data Source:** Primary market data from 2024-2026 (see `Date_Posted` for temporal coverage)
- **Cleaning:** Handled missing values, standardized salary formats, parsed comma-separated skills
- **Analysis Methods:**
  - Descriptive statistics (mean, median, percentiles) for salary distributions
  - Frequency analysis for skill and role popularity
  - Group-by aggregations (by experience, location, company type, industry)
  - Time series analysis for trend detection
  - Filtering and ranking for top-N analyses
- **Visualization:** matplotlib/seaborn for publication-quality charts
- **Reproducibility:** All analyses are cell-by-cell; run in order or selectively based on your interest
- **Extensibility:** Notebook structure allows easy addition of custom analyses (e.g., predictive modeling, clustering, correlation analysis)

---

## 📋 About the Data

**Data Characteristics:**
- **Records:** 500+ job listings
- **Time Period:** January 2024 – December 2026
- **Companies:** ~100 organizations across MNCs, Startups, Unicorns, PSU/Govt sectors
- **Job Categories:** 30+ distinct job titles spanning frontend, backend, data, DevOps, QA, and leadership roles
- **Applicant Pool:** Highly competitive (60–1,600+ applicants per role)
- **Geographic Coverage:** Remote-first, with strong presence in Tier 1 (metros: Bangalore, Delhi, Mumbai, Pune, Hyderabad) and Tier 2 cities

**Data Quality:**
- Salary data is in Lakhs Per Annum (LPA), standardized for consistency
- Missing values are minimal; skill and education data may have multi-valued entries (comma-separated)
- Company ratings are on a 2.0–4.3 scale (5-point equivalent)

**Limitations:**
- Data represents snapshot of 2024-2026 market; trends may have evolved
- Salary ranges reflect market salaries at posting time (not actual accepted offers)
- Applicant counts do not necessarily reflect hire rates; use for relative comparison only
- Coverage focuses on major tech hubs and publicly listed companies; smaller regional/private firms may be underrepresented

---

## 🤝 Contributing & Feedback

Have ideas to enhance this analysis? Found insights worth adding?

- **Add new analyses** — Fork this notebook and create pull requests with your insights
- **Report issues** — Flag data quality concerns or suggest new visualization types
- **Share findings** — Use this dataset for your own research; please cite as "India Tech Job Market 2024-2026"

---

## 📄 License

This project is open for educational and research purposes. Please credit the data source when sharing findings.

---

## 🔗 Quick Links

- **Start analyzing:** Run the notebook to generate all 18+ charts and insights
- **Filter the CSV:** Use any spreadsheet tool (Excel, Google Sheets) or Python/R for custom queries
- **Share findings:** Export charts directly from Jupyter for presentations or reports

---

**Last Updated:** June 2026 | **Data Coverage:** 2024-2026

Happy exploring! 🎯
#   i n d i a - t e c h - j o b - m a r k e t - a n a l y s i s  
 