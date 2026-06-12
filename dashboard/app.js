// Global variables to store application state
let jobData = [];
let filteredData = [];
let charts = {};

// Pagination state for Explorer
let currentPage = 1;
const rowsPerPage = 10;

// Selected skills for Calculator
let selectedSkills = new Set();

// ============================================================================
// DATA LOADING & PARSING
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    setupTabSwitching();
    setupFilters();
    setupExplorerControls();
    setupCalculatorControls();
});

async function loadData() {
    try {
        const response = await fetch('../dataset/india_job_market_2024_2026.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const text = await response.text();
        jobData = parseCSV(text);
        filteredData = [...jobData];
        
        // Populate filters and calculator role/exp options
        populateFilterDropdowns();
        populateCalculatorDropdowns();
        
        // Initial render
        updateDashboard();
        
        // Remove loading visual states
        document.getElementById('data-count-info').textContent = `Total Records: ${jobData.length.toLocaleString()}`;
    } catch (error) {
        console.error("Error initializing dashboard data:", error);
        document.getElementById('data-count-info').textContent = "Failed to load dataset.";
    }
}

/**
 * Custom robust CSV Parser to handle double-quoted values containing commas (like skills list).
 */
function parseCSV(text) {
    const lines = [];
    let row = [""];
    let insideQuote = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === '"') {
            if (insideQuote && nextChar === '"') {
                // Escaped double quote
                row[row.length - 1] += '"';
                i++;
            } else {
                insideQuote = !insideQuote;
            }
        } else if (char === ',' && !insideQuote) {
            row.push("");
        } else if ((char === '\r' || char === '\n') && !insideQuote) {
            if (char === '\r' && nextChar === '\n') {
                i++; // Skip LF if CRLF
            }
            lines.push(row);
            row = [""];
        } else {
            row[row.length - 1] += char;
        }
    }
    
    // Push the final row if not empty
    if (row.length > 1 || row[0] !== "") {
        lines.push(row);
    }
    
    if (lines.length < 2) return [];
    
    // Convert array of arrays to array of objects using headers
    const headers = lines[0].map(h => h.trim());
    const dataObjects = [];
    
    for (let i = 1; i < lines.length; i++) {
        const rowData = lines[i];
        if (rowData.length !== headers.length) continue; // Skip malformed rows
        
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            let val = rowData[j].trim();
            
            // Format column data types
            if (headers[j] === 'Salary_LPA') {
                obj[headers[j]] = parseFloat(val) || 0.0;
            } else if (headers[j] === 'Openings' || headers[j] === 'Applicants') {
                obj[headers[j]] = parseInt(val, 10) || 0;
            } else if (headers[j] === 'Company_Rating') {
                obj[headers[j]] = parseFloat(val) || 0.0;
            } else {
                obj[headers[j]] = val;
            }
        }
        dataObjects.push(obj);
    }
    
    return dataObjects;
}

// ============================================================================
// UI NAVIGATION & TAB CONTROLS
// ============================================================================

function setupTabSwitching() {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const targetTab = tab.getAttribute("data-tab");
            document.querySelectorAll(".tab-content").forEach(content => {
                content.classList.remove("active");
            });
            document.getElementById(targetTab).classList.add("active");
        });
    });
}

// ============================================================================
// FILTER LOGIC
// ============================================================================

function setupFilters() {
    const filterSelectors = [
        '#filter-title',
        '#filter-experience',
        '#filter-city',
        '#filter-workmode',
        '#filter-companytype',
        '#filter-industry'
    ];
    
    filterSelectors.forEach(selector => {
        document.querySelector(selector).addEventListener("change", applyFilters);
    });
    
    document.getElementById("reset-filters-btn").addEventListener("click", () => {
        filterSelectors.forEach(selector => {
            document.querySelector(selector).value = "";
        });
        applyFilters();
    });
}

function populateFilterDropdowns() {
    const uniqueTitles = getUniqueSortedValues('Job_Title');
    const uniqueExps = getUniqueSortedValues('Experience_Level');
    const uniqueCities = getUniqueSortedValues('City');
    const uniqueWorkModes = getUniqueSortedValues('Work_Mode');
    const uniqueCompanyTypes = getUniqueSortedValues('Company_Type');
    const uniqueIndustries = getUniqueSortedValues('Industry');
    
    populateSelect('#filter-title', uniqueTitles);
    populateSelect('#filter-experience', uniqueExps);
    populateSelect('#filter-city', uniqueCities);
    populateSelect('#filter-workmode', uniqueWorkModes);
    populateSelect('#filter-companytype', uniqueCompanyTypes);
    populateSelect('#filter-industry', uniqueIndustries);
}

function getUniqueSortedValues(columnName) {
    const values = jobData.map(item => item[columnName]).filter(v => v);
    return [...new Set(values)].sort();
}

function populateSelect(selector, list) {
    const select = document.querySelector(selector);
    // Keep first "All" option
    const firstOption = select.options[0];
    select.innerHTML = "";
    select.appendChild(firstOption);
    
    list.forEach(val => {
        const option = document.createElement("option");
        option.value = val;
        option.textContent = val;
        select.appendChild(option);
    });
}

function applyFilters() {
    const title = document.getElementById("filter-title").value;
    const exp = document.getElementById("filter-experience").value;
    const city = document.getElementById("filter-city").value;
    const workmode = document.getElementById("filter-workmode").value;
    const companytype = document.getElementById("filter-companytype").value;
    const industry = document.getElementById("filter-industry").value;
    
    filteredData = jobData.filter(item => {
        return (!title || item.Job_Title === title) &&
               (!exp || item.Experience_Level === exp) &&
               (!city || item.City === city) &&
               (!workmode || item.Work_Mode === workmode) &&
               (!companytype || item.Company_Type === companytype) &&
               (!industry || item.Industry === industry);
    });
    
    updateDashboard();
}

// ============================================================================
// DASHBOARD UPDATE ENGINE
// ============================================================================

function updateDashboard() {
    calculateKPIs();
    renderCharts();
    
    // Reset Job Table to page 1 with new filtered data
    currentPage = 1;
    renderJobTable();
    
    // Update footer info
    document.getElementById('data-count-info').textContent = `Filtered: ${filteredData.length.toLocaleString()} of ${jobData.length.toLocaleString()}`;
}

function calculateKPIs() {
    const totalJobs = filteredData.length;
    
    if (totalJobs === 0) {
        document.getElementById("kpi-total-jobs").textContent = "0";
        document.getElementById("kpi-median-salary").textContent = "₹0L";
        document.getElementById("kpi-avg-rating").textContent = "0.0";
        document.getElementById("kpi-avg-applicants").textContent = "0";
        return;
    }
    
    // Total jobs
    document.getElementById("kpi-total-jobs").textContent = totalJobs.toLocaleString();
    
    // Median Salary
    const salaries = filteredData.map(item => item.Salary_LPA).sort((a, b) => a - b);
    const midIndex = Math.floor(salaries.length / 2);
    const medianSalary = salaries.length % 2 !== 0 
        ? salaries[midIndex] 
        : (salaries[midIndex - 1] + salaries[midIndex]) / 2;
    document.getElementById("kpi-median-salary").textContent = `₹${medianSalary.toFixed(1)}L`;
    
    // Avg Company Rating
    const totalRating = filteredData.reduce((sum, item) => sum + item.Company_Rating, 0);
    const avgRating = totalRating / totalJobs;
    document.getElementById("kpi-avg-rating").textContent = avgRating.toFixed(1);
    
    // Avg Applicants
    const totalApplicants = filteredData.reduce((sum, item) => sum + item.Applicants, 0);
    const avgApplicants = Math.round(totalApplicants / totalJobs);
    document.getElementById("kpi-avg-applicants").textContent = avgApplicants.toLocaleString();
}

// ============================================================================
// CHART CONTROLLER
// ============================================================================

function renderCharts() {
    renderSalaryDistributionChart();
    renderExperienceSalaryChart();
    renderTopSkillsChart();
    renderWorkModeShareChart();
    renderCompanyTypeShareChart();
    renderCityHubsChart();
}

function destroyChartIfExists(chartName) {
    if (charts[chartName]) {
        charts[chartName].destroy();
    }
}

function renderSalaryDistributionChart() {
    destroyChartIfExists('salaryDist');
    
    const ctx = document.getElementById('chart-salary-dist').getContext('2d');
    
    // Calculate bins: 0-5, 5-10, 10-15, ..., 50+
    const binSize = 5;
    const maxSalary = 50;
    const bins = Array.from({length: maxSalary / binSize + 1}, (_, i) => i * binSize);
    const counts = Array(bins.length).fill(0);
    
    filteredData.forEach(item => {
        const sal = item.Salary_LPA;
        const binIdx = Math.min(Math.floor(sal / binSize), bins.length - 1);
        counts[binIdx]++;
    });
    
    const labels = bins.map((b, i) => {
        if (i === bins.length - 1) return `₹${b}L+`;
        return `₹${b}-${bins[i+1]}L`;
    });
    
    // Gradient styling
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 242, 254, 0.45)');
    gradient.addColorStop(1, 'rgba(79, 172, 254, 0.05)');
    
    charts.salaryDist = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Openings',
                data: counts,
                fill: true,
                backgroundColor: gradient,
                borderColor: '#00f2fe',
                borderWidth: 2,
                pointBackgroundColor: '#00f2fe',
                pointHoverRadius: 6,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#13192f',
                    titleColor: '#fff',
                    bodyColor: '#e5e7eb',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af', font: { size: 9 } }
                }
            }
        }
    });
}

function renderExperienceSalaryChart() {
    destroyChartIfExists('expSalary');
    
    const ctx = document.getElementById('chart-exp-salary').getContext('2d');
    
    // Group salaries by Experience level
    const expGroups = {};
    filteredData.forEach(item => {
        const exp = item.Experience_Level;
        if (!expGroups[exp]) expGroups[exp] = [];
        expGroups[exp].push(item.Salary_LPA);
    });
    
    // Set explicit sorted order
    const expOrder = ['Fresher (0-1 yr)', 'Junior (1-3 yrs)', 'Mid (3-6 yrs)', 'Senior (6-10 yrs)', 'Lead (10+ yrs)'];
    const labels = [];
    const medians = [];
    
    expOrder.forEach(exp => {
        if (expGroups[exp] && expGroups[exp].length > 0) {
            labels.push(exp.split(' ')[0]); // Get just 'Fresher', 'Junior', etc.
            const list = expGroups[exp].sort((a,b) => a - b);
            const mid = Math.floor(list.length / 2);
            const med = list.length % 2 !== 0 ? list[mid] : (list[mid-1] + list[mid]) / 2;
            medians.push(parseFloat(med.toFixed(1)));
        }
    });
    
    charts.expSalary = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: medians,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.65)',
                    'rgba(16, 185, 129, 0.65)',
                    'rgba(245, 158, 11, 0.65)',
                    'rgba(139, 92, 246, 0.65)',
                    'rgba(239, 68, 68, 0.65)'
                ],
                borderColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'
                ],
                borderWidth: 1.5,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `Median Salary: ₹${ctx.parsed.y}L LPA`
                    },
                    backgroundColor: '#13192f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' },
                    title: { display: true, text: 'Salary LPA', color: '#9ca3af', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

function renderTopSkillsChart() {
    destroyChartIfExists('topSkills');
    
    const ctx = document.getElementById('chart-top-skills').getContext('2d');
    
    // Explode comma-separated skills and count occurrences
    const skillCounts = {};
    filteredData.forEach(item => {
        if (!item.Skills_Required) return;
        const list = item.Skills_Required.split(',').map(s => s.trim());
        list.forEach(skill => {
            if (skill) skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
    });
    
    const sortedSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
        
    const labels = sortedSkills.map(s => s[0]);
    const counts = sortedSkills.map(s => s[1]);
    
    charts.topSkills = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: 'rgba(127, 0, 255, 0.5)',
                borderColor: '#e100ff',
                borderWidth: 1.5,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#13192f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af', font: { size: 10 } }
                }
            }
        }
    });
}

function renderWorkModeShareChart() {
    destroyChartIfExists('workModeShare');
    
    const ctx = document.getElementById('chart-workmode-share').getContext('2d');
    
    const modeCounts = {};
    filteredData.forEach(item => {
        const mode = item.Work_Mode || 'Unknown';
        modeCounts[mode] = (modeCounts[mode] || 0) + 1;
    });
    
    charts.workModeShare = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(modeCounts),
            datasets: [{
                data: Object.values(modeCounts),
                backgroundColor: [
                    'rgba(0, 242, 254, 0.65)',
                    'rgba(139, 92, 246, 0.65)',
                    'rgba(245, 158, 11, 0.65)'
                ],
                borderColor: '#0c1020',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#f3f4f6', font: { size: 10 }, boxWidth: 12 }
                },
                tooltip: {
                    backgroundColor: '#13192f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            cutout: '65%'
        }
    });
}

// Company share
function renderCompanyTypeShareChart() {
    destroyChartIfExists('companyTypeShare');
    
    const ctx = document.getElementById('chart-companytype-share').getContext('2d');
    
    const typeCounts = {};
    filteredData.forEach(item => {
        const type = item.Company_Type || 'Other';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    charts.companyTypeShare = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.65)',
                    'rgba(16, 185, 129, 0.65)',
                    'rgba(239, 68, 68, 0.65)',
                    'rgba(156, 163, 175, 0.65)'
                ],
                borderColor: '#0c1020',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#f3f4f6', font: { size: 10 }, boxWidth: 12 }
                },
                tooltip: {
                    backgroundColor: '#13192f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            cutout: '65%'
        }
    });
}

function renderCityHubsChart() {
    destroyChartIfExists('cityHubs');
    
    const ctx = document.getElementById('chart-city-hubs').getContext('2d');
    
    // Group jobs by City
    const cityGroups = {};
    filteredData.forEach(item => {
        const city = item.City;
        if (!cityGroups[city]) cityGroups[city] = { count: 0, salaries: [] };
        cityGroups[city].count++;
        cityGroups[city].salaries.push(item.Salary_LPA);
    });
    
    // Calculate details and get top 8 cities by listing count
    const sortedCities = Object.entries(cityGroups)
        .map(([city, data]) => {
            const list = data.salaries.sort((a,b) => a - b);
            const mid = Math.floor(list.length / 2);
            const med = list.length % 2 !== 0 ? list[mid] : (list[mid-1] + list[mid]) / 2;
            return {
                city,
                count: data.count,
                medianSalary: parseFloat(med.toFixed(1))
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
        
    const labels = sortedCities.map(c => c.city);
    const counts = sortedCities.map(c => c.count);
    const medians = sortedCities.map(c => c.medianSalary);
    
    charts.cityHubs = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Job Openings',
                    data: counts,
                    backgroundColor: 'rgba(79, 172, 254, 0.65)',
                    borderColor: '#4facfe',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Median Salary (LPA)',
                    data: medians,
                    backgroundColor: 'rgba(16, 185, 129, 0.65)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    backgroundColor: '#13192f',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' },
                    title: { display: true, text: 'Openings', color: '#9ca3af' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false }, // Only show grid lines for left axis
                    ticks: { color: '#9ca3af' },
                    title: { display: true, text: 'Median Salary (LPA)', color: '#9ca3af' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af', font: { size: 9 } }
                }
            }
        }
    });
}

// ============================================================================
// TAB 3: JOB EXPLORER TABLE
// ============================================================================

function setupExplorerControls() {
    document.getElementById("job-search").addEventListener("input", () => {
        currentPage = 1;
        renderJobTable();
    });
    
    document.getElementById("table-sort-by").addEventListener("change", () => {
        currentPage = 1;
        renderJobTable();
    });
    
    document.getElementById("prev-page-btn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderJobTable();
        }
    });
    
    document.getElementById("next-page-btn").addEventListener("click", () => {
        const total = getSearchedSortedData().length;
        if (currentPage < Math.ceil(total / rowsPerPage)) {
            currentPage++;
            renderJobTable();
        }
    });
    
    // Modal controls
    document.getElementById("close-modal-btn").addEventListener("click", closeModal);
    document.getElementById("job-detail-modal").addEventListener("click", (e) => {
        if (e.target.id === "job-detail-modal") closeModal();
    });
    
    document.getElementById("modal-apply-btn").addEventListener("click", () => {
        alert("Application simulated successfully! Your profile has been sent to the recruiter.");
        closeModal();
    });
}

/**
 * Filters the active filteredData array based on search bar text, and sorts it.
 */
function getSearchedSortedData() {
    const searchText = document.getElementById("job-search").value.toLowerCase().trim();
    let data = [...filteredData];
    
    if (searchText) {
        data = data.filter(item => {
            return item.Job_Title.toLowerCase().includes(searchText) ||
                   item.Company.toLowerCase().includes(searchText) ||
                   (item.Skills_Required && item.Skills_Required.toLowerCase().includes(searchText)) ||
                   item.City.toLowerCase().includes(searchText) ||
                   item.Industry.toLowerCase().includes(searchText);
        });
    }
    
    const sortByVal = document.getElementById("table-sort-by").value;
    const [column, order] = sortByVal.split('-');
    
    data.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        
        if (column === 'Date_Posted') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
        }
        
        if (typeof valA === 'string') {
            return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            return order === 'asc' ? valA - valB : valB - valA;
        }
    });
    
    return data;
}

function renderJobTable() {
    const data = getSearchedSortedData();
    const tableBody = document.getElementById("job-table-body");
    tableBody.innerHTML = "";
    
    const totalRecords = data.length;
    
    if (totalRecords === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-muted);">No matching job postings found. Try adjustments to your filters or search keywords.</td></tr>`;
        document.getElementById("pagination-info").textContent = "Showing 0 to 0 of 0 entries";
        document.getElementById("prev-page-btn").disabled = true;
        document.getElementById("next-page-btn").disabled = true;
        document.getElementById("pagination-pages").innerHTML = "";
        return;
    }
    
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = Math.min(startIdx + rowsPerPage, totalRecords);
    const paginatedItems = data.slice(startIdx, endIdx);
    
    paginatedItems.forEach(job => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="title-col">${job.Job_Title}</td>
            <td>${job.Company}</td>
            <td>${job.Industry}</td>
            <td>${job.City}</td>
            <td>${job.Work_Mode}</td>
            <td class="salary-col">₹${job.Salary_LPA.toFixed(1)}L</td>
            <td>${job.Experience_Level.split(' ')[0]}</td>
            <td class="action-cell">
                <button class="view-btn" data-id="${job.Job_ID}">Details</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    // Attach event listeners to details button
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const jobId = btn.getAttribute("data-id");
            openJobModal(jobId);
        });
    });
    
    // Update Pagination UI
    document.getElementById("pagination-info").textContent = `Showing ${startIdx + 1} to ${endIdx} of ${totalRecords} entries`;
    document.getElementById("prev-page-btn").disabled = currentPage === 1;
    
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    document.getElementById("next-page-btn").disabled = currentPage === totalPages;
    
    renderPaginationButtons(totalPages);
}

function renderPaginationButtons(totalPages) {
    const pagesContainer = document.getElementById("pagination-pages");
    pagesContainer.innerHTML = "";
    
    // Display maximum 5 page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.classList.add("page-num");
        if (i === currentPage) btn.classList.add("active");
        btn.textContent = i;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderJobTable();
        });
        pagesContainer.appendChild(btn);
    }
}

function openJobModal(jobId) {
    const job = jobData.find(item => item.Job_ID === jobId);
    if (!job) return;
    
    document.getElementById("modal-company-type").textContent = job.Company_Type;
    document.getElementById("modal-job-title").textContent = job.Job_Title;
    document.getElementById("modal-company-name").innerHTML = `<i class="fa-solid fa-building"></i> ${job.Company}`;
    document.getElementById("modal-rating").innerHTML = `<i class="fa-solid fa-star"></i> ${job.Company_Rating.toFixed(1)}`;
    document.getElementById("modal-industry").innerHTML = `<i class="fa-solid fa-industry"></i> ${job.Industry}`;
    
    document.getElementById("modal-salary").textContent = `₹${job.Salary_LPA.toFixed(1)} LPA`;
    document.getElementById("modal-experience").textContent = job.Experience_Level;
    document.getElementById("modal-work-mode").textContent = `${job.Work_Mode} (${job.City})`;
    document.getElementById("modal-job-type").textContent = job.Job_Type;
    document.getElementById("modal-applicants").textContent = `${job.Applicants.toLocaleString()} Applicants`;
    document.getElementById("modal-openings").textContent = `${job.Openings} Openings`;
    document.getElementById("modal-education").textContent = job.Education_Required;
    document.getElementById("modal-date").textContent = job.Date_Posted;
    
    // Skills tags
    const skillsContainer = document.getElementById("modal-skills-tags");
    skillsContainer.innerHTML = "";
    if (job.Skills_Required) {
        const skillsList = job.Skills_Required.split(',').map(s => s.trim());
        skillsList.forEach(skill => {
            if (skill) {
                const tag = document.createElement("span");
                tag.classList.add("modal-skills-tag");
                tag.textContent = skill;
                skillsContainer.appendChild(tag);
            }
        });
    }
    
    document.getElementById("job-detail-modal").classList.add("active");
}

function closeModal() {
    document.getElementById("job-detail-modal").classList.remove("active");
}

// ============================================================================
// TAB 2: SALARY & SKILL CALCULATOR
// ============================================================================

function setupCalculatorControls() {
    document.getElementById("calculate-btn").addEventListener("click", runSalaryEstimator);
    
    // Setup skills searchable checkbox dropdown
    const searchInput = document.getElementById("skills-search-input");
    const dropdownList = document.getElementById("skills-dropdown-list");
    
    searchInput.addEventListener("focus", () => {
        dropdownList.classList.add("active");
        filterSkillsDropdown();
    });
    
    document.addEventListener("click", (e) => {
        const container = document.querySelector(".skills-search-container");
        if (!container.contains(e.target)) {
            dropdownList.classList.remove("active");
        }
    });
    
    searchInput.addEventListener("input", filterSkillsDropdown);
}

function populateCalculatorDropdowns() {
    const uniqueTitles = getUniqueSortedValues('Job_Title');
    const uniqueExps = getUniqueSortedValues('Experience_Level');
    
    populateSelect('#calc-role', uniqueTitles);
    populateSelect('#calc-exp', uniqueExps);
    
    // Collect all unique skills in the dataset
    const skillsSet = new Set();
    jobData.forEach(item => {
        if (item.Skills_Required) {
            item.Skills_Required.split(',').forEach(s => {
                const clean = s.trim();
                if (clean) skillsSet.add(clean);
            });
        }
    });
    
    const sortedSkills = [...skillsSet].sort();
    
    // Populate checklist dropdown
    const dropdown = document.getElementById("skills-dropdown-list");
    dropdown.innerHTML = "";
    
    sortedSkills.forEach(skill => {
        const item = document.createElement("div");
        item.classList.add("skills-dropdown-item");
        item.innerHTML = `
            <input type="checkbox" id="check-skill-${skill.replace(/\s+/g, '-')}" value="${skill}">
            <label for="check-skill-${skill.replace(/\s+/g, '-')}">${skill}</label>
        `;
        dropdown.appendChild(item);
        
        // Handle checkbox change
        const checkbox = item.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                selectedSkills.add(skill);
            } else {
                selectedSkills.delete(skill);
            }
            renderSelectedSkillTags();
        });
    });
}

function filterSkillsDropdown() {
    const searchVal = document.getElementById("skills-search-input").value.toLowerCase();
    const items = document.querySelectorAll(".skills-dropdown-item");
    
    items.forEach(item => {
        const label = item.querySelector("label").textContent.toLowerCase();
        if (label.includes(searchVal)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function renderSelectedSkillTags() {
    const tagsContainer = document.getElementById("selected-skills-tags");
    tagsContainer.innerHTML = "";
    
    if (selectedSkills.size === 0) {
        tagsContainer.innerHTML = `<span class="no-skills-msg">No skills selected yet.</span>`;
        return;
    }
    
    selectedSkills.forEach(skill => {
        const tag = document.createElement("span");
        tag.classList.add("skill-tag");
        tag.innerHTML = `
            ${skill} <i class="fa-solid fa-circle-xmark" data-skill="${skill}"></i>
        `;
        tagsContainer.appendChild(tag);
        
        // Remove skill tag functionality
        tag.querySelector("i").addEventListener("click", () => {
            selectedSkills.delete(skill);
            
            // Uncheck in dropdown list
            const checkboxId = `check-skill-${skill.replace(/\s+/g, '-')}`;
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) checkbox.checked = false;
            
            renderSelectedSkillTags();
        });
    });
}

function runSalaryEstimator() {
    const role = document.getElementById("calc-role").value;
    const exp = document.getElementById("calc-exp").value;
    
    if (!role || !exp) {
        alert("Please select a target Job Title and Experience Level first.");
        return;
    }
    
    // Show loading state / hide result containers
    document.getElementById("calc-result-placeholder").classList.add("hidden");
    const resultContainer = document.getElementById("calc-result-container");
    resultContainer.classList.remove("hidden");
    
    // Filter matching listings in the dataset
    const matchedJobs = jobData.filter(job => job.Job_Title === role && job.Experience_Level === exp);
    
    let salaryEstimate = 0.0;
    let minSalary = 0.0;
    let maxSalary = 0.0;
    let averageRating = 0.0;
    let avgApplicants = 0;
    
    if (matchedJobs.length > 0) {
        const salaries = matchedJobs.map(j => j.Salary_LPA).sort((a,b) => a - b);
        const mid = Math.floor(salaries.length / 2);
        salaryEstimate = salaries.length % 2 !== 0 ? salaries[mid] : (salaries[mid-1] + salaries[mid]) / 2;
        minSalary = salaries[0];
        maxSalary = salaries[salaries.length - 1];
        
        averageRating = matchedJobs.reduce((sum, j) => sum + j.Company_Rating, 0) / matchedJobs.length;
        avgApplicants = matchedJobs.reduce((sum, j) => sum + j.Applicants, 0) / matchedJobs.length;
    } else {
        // Fallback: search just by role
        const roleJobs = jobData.filter(job => job.Job_Title === role);
        if (roleJobs.length > 0) {
            const salaries = roleJobs.map(j => j.Salary_LPA).sort((a,b) => a - b);
            const mid = Math.floor(salaries.length / 2);
            salaryEstimate = salaries.length % 2 !== 0 ? salaries[mid] : (salaries[mid-1] + salaries[mid]) / 2;
            minSalary = salaries[0];
            maxSalary = salaries[salaries.length - 1];
            averageRating = roleJobs.reduce((sum, j) => sum + j.Company_Rating, 0) / roleJobs.length;
            avgApplicants = roleJobs.reduce((sum, j) => sum + j.Applicants, 0) / roleJobs.length;
        } else {
            alert("No sufficient data found for that combination. Resetting calculations.");
            return;
        }
    }
    
    // Render salary outputs
    document.getElementById("calc-est-salary").innerHTML = `₹${salaryEstimate.toFixed(1)} <span class="lpa-unit">LPA</span>`;
    document.getElementById("calc-est-range").textContent = `Market range: ₹${minSalary.toFixed(1)} - ₹${maxSalary.toFixed(1)} LPA`;
    
    // Calculate Demand status rating
    const ratingStarsContainer = document.getElementById("calc-market-rating-stars");
    ratingStarsContainer.innerHTML = "";
    
    let demandRating = 3; // default
    let demandLabel = "Moderate Competition";
    
    if (avgApplicants > 600) {
        demandRating = 5;
        demandLabel = "Extreme Competition (Very Popular)";
    } else if (avgApplicants > 300) {
        demandRating = 4;
        demandLabel = "High Competition";
    } else if (avgApplicants < 100) {
        demandRating = 2;
        demandLabel = "Low Competition (High Hiring Intent)";
    }
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("i");
        if (i <= demandRating) {
            star.classList.add("fa-solid", "fa-star");
        } else {
            star.classList.add("fa-regular", "fa-star");
        }
        ratingStarsContainer.appendChild(star);
    }
    document.getElementById("calc-market-demand").textContent = `Market Status: ${demandLabel}`;
    
    // Calculate Skill Gaps
    // Look at skills required in matchedJobs that are not selected by the user
    const skillGapCounts = {};
    const skillSalaries = {}; // Track average salary premium when skill is present
    
    // Find all matching jobs for the role (to get a good statistical size, fallback to just role if needed)
    const skillSourceJobs = matchedJobs.length > 5 ? matchedJobs : jobData.filter(job => job.Job_Title === role);
    
    skillSourceJobs.forEach(job => {
        if (!job.Skills_Required) return;
        const skillsList = job.Skills_Required.split(',').map(s => s.trim());
        skillsList.forEach(skill => {
            if (skill && !selectedSkills.has(skill)) {
                skillGapCounts[skill] = (skillGapCounts[skill] || 0) + 1;
                if (!skillSalaries[skill]) skillSalaries[skill] = [];
                skillSalaries[skill].push(job.Salary_LPA);
            }
        });
    });
    
    const gapsContainer = document.getElementById("calc-skill-gaps");
    gapsContainer.innerHTML = "";
    
    const sortedGaps = Object.entries(skillGapCounts)
        .map(([skill, count]) => {
            const list = skillSalaries[skill].sort((a,b) => a-b);
            const med = list[Math.floor(list.length/2)];
            // premium is the difference between skill median and base estimator salary
            const premium = med - salaryEstimate;
            return { skill, count, premium };
        })
        .filter(item => item.premium > 0.5) // Only display skills carrying a positive premium
        .sort((a, b) => b.premium - a.premium)
        .slice(0, 5);
        
    if (sortedGaps.length === 0) {
        gapsContainer.innerHTML = `
            <div class="no-gaps-card">
                <i class="fa-solid fa-circle-check" style="color: var(--accent-green); font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <p>Perfect Fit! You possess all primary high-paying skills listing requirements for this role.</p>
            </div>
        `;
    } else {
        sortedGaps.forEach(gap => {
            const item = document.createElement("div");
            item.classList.add("skill-gap-item");
            item.innerHTML = `
                <span class="gap-name">${gap.skill}</span>
                <span class="gap-premium">+ ₹${gap.premium.toFixed(1)}L LPA</span>
            `;
            gapsContainer.appendChild(item);
        });
    }
    
    // Calculate Top Matching Employers
    const employersContainer = document.getElementById("calc-top-employers");
    employersContainer.innerHTML = "";
    
    const matchingCompanies = {};
    skillSourceJobs.forEach(job => {
        const comp = job.Company;
        if (!matchingCompanies[comp]) {
            matchingCompanies[comp] = {
                name: comp,
                rating: job.Company_Rating,
                count: 0
            };
        }
        matchingCompanies[comp].count += job.Openings;
    });
    
    const sortedComps = Object.values(matchingCompanies)
        .sort((a,b) => b.count - a.count || b.rating - a.rating)
        .slice(0, 4);
        
    if (sortedComps.length === 0) {
        employersContainer.innerHTML = `<p class="no-matches-msg">No current hiring listings match your criteria.</p>`;
    } else {
        sortedComps.forEach(comp => {
            const card = document.createElement("div");
            card.classList.add("match-company-card");
            card.innerHTML = `
                <h4>${comp.name}</h4>
                <div class="comp-rating"><i class="fa-solid fa-star"></i> ${comp.rating.toFixed(1)}</div>
                <div class="comp-openings">${comp.count} active roles</div>
            `;
            employersContainer.appendChild(card);
        });
    }
}
