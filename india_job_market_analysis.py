"""
India Tech Job Market Analysis (2024-2026)

This module provides comprehensive analysis and visualization of the Indian tech job market
including salary trends, skills demand, company insights, and geographic distribution.

Author: Data Analysis Team
Date: 2024-2026
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path


# ============================================================================
# CONFIGURATION
# ============================================================================

# Set up visualization style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 10


# ============================================================================
# DATA LOADING
# ============================================================================

def load_data(file_path: str) -> pd.DataFrame:
    try:
        df = pd.read_csv(file_path)
        print(f"Data loaded successfully. Shape: {df.shape}")
        return df
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        raise


def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    df['Date_Posted'] = pd.to_datetime(df['Date_Posted'])
    df['Year'] = df['Date_Posted'].dt.year
    df['Month'] = df['Date_Posted'].dt.strftime('%b')
    return df


def explore_data(df: pd.DataFrame) -> None:
    print("\n" + "="*70)
    print("DATA EXPLORATION")
    print("="*70)
    
    print("\nDataset Info:")
    df.info()
    
    print("\nStatistical Summary:")
    print(df.describe())
    
    print(f"\nDuplicates: {df.duplicated().sum()}")
    print("\nUnique Values per Column:")
    print(df.nunique())


# ============================================================================
# SALARY ANALYSIS
# ============================================================================

def analyze_salary_distribution(df: pd.DataFrame) -> None:
    print("\nSalary Statistics Summary:")
    print(df['Salary_LPA'].describe())
    
    plt.figure(figsize=(10, 5))
    sns.histplot(data=df, x='Salary_LPA', kde=True, color='blue', bins=30)
    plt.title("Tech Salaries Distribution in India", fontsize=14, fontweight='bold')
    plt.xlabel("Salary (LPA)", fontsize=12)
    plt.ylabel("Job Openings", fontsize=12)
    plt.tight_layout()
    plt.show()


def analyze_salary_by_job_title(df: pd.DataFrame, top_n: int = 15) -> None:
    top_salaries = df.groupby('Job_Title')['Salary_LPA'].median().sort_values(ascending=False).head(top_n).reset_index()
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_salaries, x='Salary_LPA', y='Job_Title', hue='Job_Title', palette='Oranges_r', legend=False)
    plt.title(f'Top {top_n} Highest Paying Jobs by Median Salary (LPA)')
    plt.xlabel('Median Salary (LPA)')
    plt.ylabel('Job Title')
    plt.tight_layout()
    plt.show()


def analyze_salary_by_company(df: pd.DataFrame, top_n: int = 15) -> None:
    top_company_salaries = df.groupby('Company')['Salary_LPA'].median().sort_values(ascending=False).head(top_n).reset_index()
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_company_salaries, x='Salary_LPA', y='Company', hue='Company', palette='YlOrRd_r', legend=False)
    plt.title(f'Top {top_n} Highest Paying Companies by Median Salary (LPA)')
    plt.xlabel('Median Salary (LPA)')
    plt.ylabel('Company Name')
    plt.tight_layout()
    plt.show()


def analyze_salary_by_experience(df: pd.DataFrame) -> None:
    exp_salaries = df.groupby('Experience_Level')['Salary_LPA'].median().sort_values().reset_index()
    
    plt.figure(figsize=(8, 5))
    sns.barplot(data=exp_salaries, x='Experience_Level', y='Salary_LPA', hue='Experience_Level', palette='coolwarm', legend=False)
    plt.title('Median Salary (LPA) by Experience Level', fontsize=14, fontweight='bold')
    plt.xlabel('Experience Level', fontsize=12)
    plt.ylabel('Median Salary (LPA)', fontsize=12)
    plt.tight_layout()
    plt.show()


def analyze_salary_by_education(df: pd.DataFrame) -> None:
    edu_salaries = df.groupby('Education_Required')['Salary_LPA'].median().sort_values(ascending=False).reset_index()
    
    plt.figure(figsize=(10, 4))
    sns.barplot(data=edu_salaries, x='Salary_LPA', y='Education_Required', hue='Education_Required', palette='vlag', legend=False)
    plt.title('Median Salary (LPA) by Education Level')
    plt.xlabel('Median Salary (LPA)')
    plt.ylabel('Degree Required')
    plt.tight_layout()
    plt.show()


def analyze_salary_by_work_mode(df: pd.DataFrame) -> None:
    work_mode_salaries = df.groupby('Work_Mode')['Salary_LPA'].median().sort_values(ascending=False).reset_index()
    
    plt.figure(figsize=(7, 4))
    sns.barplot(data=work_mode_salaries, x='Work_Mode', y='Salary_LPA', hue='Work_Mode', palette='Set2', legend=False)
    plt.title('Median Salary (LPA) by Work Mode', fontsize=14, fontweight='bold')
    plt.xlabel('Work Mode', fontsize=12)
    plt.ylabel('Median Salary (LPA)', fontsize=12)
    plt.tight_layout()
    plt.show()


def analyze_salary_by_city(df: pd.DataFrame, top_n: int = 15) -> None:
    top_city_salaries = df.groupby('City')['Salary_LPA'].median().sort_values(ascending=False).head(top_n).reset_index()
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_city_salaries, x='Salary_LPA', y='City', hue='City', palette='Oranges_r', legend=False)
    plt.title(f'Top {top_n} Highest Paying Cities by Median Salary (LPA)')
    plt.xlabel('Median Salary (LPA)')
    plt.ylabel('City')
    plt.tight_layout()
    plt.show()


# ============================================================================
# HIRING TRENDS & DEMAND
# ============================================================================

def analyze_hiring_by_year_and_month(df: pd.DataFrame) -> None:
    plt.figure(figsize=(7, 4))
    sns.countplot(data=df, x='Year', hue='Year', palette='Blues', legend=False)
    plt.title('Jobs Posted by Year')
    plt.tight_layout()
    plt.show()
    
    plt.figure(figsize=(9, 4))
    month_order = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    sns.countplot(data=df, x='Month', order=month_order, hue='Month', palette='Purples', legend=False)
    plt.title('Jobs Posted by Month')
    plt.tight_layout()
    plt.show()


def analyze_top_job_titles(df: pd.DataFrame, top_n: int = 15) -> None:
    top_applicants = df.groupby('Job_Title')['Applicants'].sum().sort_values(ascending=False).head(top_n).reset_index()
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_applicants, x='Applicants', y='Job_Title', hue='Job_Title', palette='Blues_r', legend=False)
    plt.title(f'Top {top_n} Most Popular Jobs')
    plt.xlabel('Applicants')
    plt.ylabel('Job Title')
    plt.tight_layout()
    plt.show()


def analyze_education_demand(df: pd.DataFrame) -> None:
    edu_counts = df['Education_Required'].value_counts().reset_index()
    edu_counts.columns = ['Education_Required', 'Job_Count']
    
    plt.figure(figsize=(10, 4))
    sns.barplot(data=edu_counts, x='Job_Count', y='Education_Required', hue='Education_Required', palette='pastel', legend=False)
    plt.title('Hiring Demand by Education Level')
    plt.xlabel('Number of Job Openings')
    plt.ylabel('Degree Required')
    plt.tight_layout()
    plt.show()


def analyze_top_cities(df: pd.DataFrame, top_n: int = 15) -> None:
    top_hiring_cities = df['City'].value_counts().head(top_n).reset_index()
    top_hiring_cities.columns = ['City', 'Job_Count']
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_hiring_cities, x='Job_Count', y='City', hue='City', palette='Blues_r', legend=False)
    plt.title(f'Top {top_n} Cities by Total Job Postings')
    plt.xlabel('Number of Job Openings')
    plt.ylabel('City')
    plt.tight_layout()
    plt.show()


# ============================================================================
# COMPANY ANALYSIS
# ============================================================================

def analyze_top_companies(df: pd.DataFrame, top_n: int = 15) -> None:
    top_hiring_companies = df['Company'].value_counts().head(top_n).reset_index()
    top_hiring_companies.columns = ['Company', 'Job_Count']
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_hiring_companies, x='Job_Count', y='Company', hue='Company', palette='GnBu_r', legend=False)
    plt.title(f'Top {top_n} Companies by Total Job Postings')
    plt.xlabel('Number of Job Openings')
    plt.ylabel('Company Name')
    plt.tight_layout()
    plt.show()


def analyze_company_types(df: pd.DataFrame) -> None:
    company_counts = df['Company_Type'].value_counts()
    
    plt.figure(figsize=(6, 6))
    plt.pie(company_counts, labels=company_counts.index, autopct='%1.1f%%', startangle=140)
    plt.title('Percentage Share of Company Types')
    plt.tight_layout()
    plt.show()


def analyze_companies_by_city(df: pd.DataFrame, top_n: int = 15) -> None:
    city_companies = df.groupby('City')['Company'].nunique().sort_values(ascending=False).head(top_n).reset_index()
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=city_companies, x='Company', y='City', hue='City', palette='mako', legend=False)
    plt.title(f'Top {top_n} Cities by Number of Unique Companies Hiring', fontsize=14, fontweight='bold')
    plt.xlabel('Count of Unique Companies', fontsize=12)
    plt.ylabel('City', fontsize=12)
    plt.tight_layout()
    plt.show()


# ============================================================================
# INDUSTRY ANALYSIS
# ============================================================================

def analyze_top_industries(df: pd.DataFrame) -> None:
    top_hiring_industries = df['Industry'].value_counts().reset_index()
    top_hiring_industries.columns = ['Industry', 'Job_Count']
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_hiring_industries, x='Job_Count', y='Industry', hue='Industry', palette='crest', legend=False)
    plt.title('Top Industries by Total Job Postings')
    plt.xlabel('Number of Job Openings')
    plt.ylabel('Industry')
    plt.tight_layout()
    plt.show()


def analyze_industry_salaries(df: pd.DataFrame) -> None:
    top_industry_salaries = df.groupby('Industry')['Salary_LPA'].median().sort_values(ascending=False).reset_index()
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_industry_salaries, x='Salary_LPA', y='Industry', hue='Industry', palette='flare', legend=False)
    plt.title('Top Industries by Median Salary (LPA)')
    plt.xlabel('Median Salary (LPA)')
    plt.ylabel('Industry')
    plt.tight_layout()
    plt.show()


# ============================================================================
# SKILLS ANALYSIS
# ============================================================================

def analyze_top_skills(df: pd.DataFrame, top_n: int = 15) -> None:
    df_exploded = df.assign(Skill=df['Skills_Required'].str.split(',')).explode('Skill')
    df_exploded['Skill'] = df_exploded['Skill'].str.strip()
    
    top_skills_count = df_exploded['Skill'].value_counts().head(top_n).reset_index()
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_skills_count, x='count', y='Skill', hue='Skill', palette='mako', legend=False)
    plt.title(f'Top {top_n} Most In-Demand Skills (Job Count)')
    plt.xlabel('Number of Job Postings Asking for This Skill')
    plt.ylabel('Skill')
    plt.tight_layout()
    plt.show()


def analyze_high_paying_skills(df: pd.DataFrame, top_n: int = 15, min_count: int = 50) -> None:
    df_exploded = df.assign(Skill=df['Skills_Required'].str.split(',')).explode('Skill')
    df_exploded['Skill'] = df_exploded['Skill'].str.strip()
    
    skill_salaries = df_exploded.groupby('Skill')['Salary_LPA'].agg(['count', 'median']).reset_index()
    popular_skills = skill_salaries[skill_salaries['count'] >= min_count]
    top_paying_skills = popular_skills.sort_values(by='median', ascending=False).head(top_n)
    
    plt.figure(figsize=(10, 5))
    sns.barplot(data=top_paying_skills, x='median', y='Skill', hue='Skill', palette='rocket', legend=False)
    plt.title(f'Top {top_n} Highest Paying Skills by Median Salary (LPA)')
    plt.xlabel('Median Salary (LPA)')
    plt.ylabel('Skill')
    plt.tight_layout()
    plt.show()


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main() -> None:
    print("="*70)
    print("INDIA TECH JOB MARKET ANALYSIS (2024-2026)")
    print("="*70)
    
    
    # Load and preprocess data
    file_path = 'dataset/india_job_market_2024_2026.csv'
    df = load_data(file_path)
    df = preprocess_data(df)
    
    # Explore data
    explore_data(df)
    
    # SALARY ANALYSIS
    print("\n" + "="*70)
    print("SALARY ANALYSIS")
    print("="*70)
    analyze_salary_distribution(df)
    analyze_salary_by_job_title(df)
    analyze_salary_by_company(df)
    analyze_salary_by_experience(df)
    analyze_salary_by_education(df)
    analyze_salary_by_work_mode(df)
    analyze_salary_by_city(df)
    
    # HIRING TRENDS & DEMAND
    print("\n" + "="*70)
    print("HIRING TRENDS & DEMAND")
    print("="*70)
    analyze_hiring_by_year_and_month(df)
    analyze_top_job_titles(df)
    analyze_education_demand(df)
    analyze_top_cities(df)
    
    # COMPANY ANALYSIS
    print("\n" + "="*70)
    print("COMPANY ANALYSIS")
    print("="*70)
    analyze_top_companies(df)
    analyze_company_types(df)
    analyze_companies_by_city(df)
    
    # INDUSTRY ANALYSIS
    print("\n" + "="*70)
    print("INDUSTRY ANALYSIS")
    print("="*70)
    analyze_top_industries(df)
    analyze_industry_salaries(df)
    
    # SKILLS ANALYSIS
    print("\n" + "="*70)
    print("SKILLS ANALYSIS")
    print("="*70)
    analyze_top_skills(df)
    analyze_high_paying_skills(df)
    
    print("\n" + "="*70)
    print("ANALYSIS COMPLETE")
    print("="*70)


if __name__ == "__main__":
    main()
