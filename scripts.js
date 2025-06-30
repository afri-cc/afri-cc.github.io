
      // Global variables for charts
      let charts = {};

      // Load data from JSON file
      async function loadData() {
          try {
              const response = await fetch('./contribution.json');
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              console.log('Loaded data:', data); // Debug log
              return data;
          } catch (error) {
              console.error('Error loading data:', error);
              // Fallback to sample data if JSON file is not available
              return getSampleData();
          }
      }

      

      // Initialize the dashboard
      async function initializeDashboard() {
          const data = await loadData();
          updateSummaryStats(data);
          updateProductivityStats(data);
          createCharts(data);
          createLeaderboard(data);
          createCountryCards(data);
      }

      function updateSummaryStats(data) {
          const stats = data.summary_stats;
          const elements = {
              'totalCountries': stats.total_countries,
              'totalLanguages': stats.total_languages,
              'totalUrls': stats.total_urls.toLocaleString(),
              'totalContributors': stats.total_unique_contributors,
              'avgUrlsPerCountry': stats.avg_urls_per_country
          };
          
          for (const [id, value] of Object.entries(elements)) {
              const element = document.getElementById(id);
              if (element) {
                  element.textContent = value;
              } else {
                  console.warn(`Element with id '${id}' not found`);
              }
          }
      }

      function updateProductivityStats(data) {
          if (!data.productivity_analysis || !data.productivity_analysis.tier_counts) {
              console.warn('Productivity analysis data not found');
              return;
          }
          
          const tiers = data.productivity_analysis.tier_counts;
          const elements = {
              'superContributors': tiers.super_contributors || 0,
              'highContributors': tiers.high_contributors || 0,
              'mediumContributors': tiers.medium_contributors || 0,
              'casualContributors': tiers.casual_contributors || 0
          };
          
          for (const [id, value] of Object.entries(elements)) {
              const element = document.getElementById(id);
              if (element) {
                  element.textContent = value;
              }
          }
      }

      function createCharts(data) {
          createCountriesChart(data);
          createLanguagesChart(data);
          createContributorsChart(data);
          createCoverageChart(data);
          createLanguageDistributionChart(data);
          createWidespreadLanguagesChart(data);
          createLanguagePresenceChart(data);
      }

      function createCountriesChart(data) {
          const ctx = document.getElementById('countriesChart');
          if (!ctx) return;
          
          const countries = data.countries.slice(0, 10); // Top 10 countries
          
          if (charts.countriesChart) {
              charts.countriesChart.destroy();
          }
          
          charts.countriesChart = new Chart(ctx.getContext('2d'), {
              type: 'bar',
              data: {
                  labels: countries.map(c => c.name),
                  datasets: [{
                      label: 'URLs',
                      data: countries.map(c => c.total_urls),
                      backgroundColor: 'rgba(102, 126, 234, 0.8)',
                      borderColor: 'rgba(102, 126, 234, 1)',
                      borderWidth: 2,
                      borderRadius: 8
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          display: false
                      }
                  },
                  scales: {
                      y: {
                          beginAtZero: true,
                          grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                          }
                      },
                      x: {
                          grid: {
                              display: false
                          }
                      }
                  }
              }
          });
      }

      function createLanguagesChart(data) {
          const ctx = document.getElementById('languagesChart');
          if (!ctx) return;
          
          // Handle both array format [[name, count]] and object format
          let languages = [];
          if (data.language_distribution && data.language_distribution.by_url_count) {
              languages = data.language_distribution.by_url_count.slice(0, 8);
          }
          
          if (charts.languagesChart) {
              charts.languagesChart.destroy();
          }
          
          charts.languagesChart = new Chart(ctx.getContext('2d'), {
              type: 'doughnut',
              data: {
                  labels: languages.map(l => Array.isArray(l) ? l[0] : l.name),
                  datasets: [{
                      data: languages.map(l => Array.isArray(l) ? l[1] : l.count),
                      backgroundColor: [
                          '#667eea', '#764ba2', '#f093fb', '#f5576c',
                          '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                      ],
                      borderWidth: 3,
                      borderColor: '#ffffff'
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          position: 'bottom',
                          labels: {
                              padding: 20,
                              usePointStyle: true
                          }
                      }
                  }
              }
          });
      }

      function showSection(section) {
          // Hide all sections
          document.getElementById('overview-section').style.display = 'none';
          document.getElementById('countries-section').style.display = 'none';
          document.getElementById('coverage-section').style.display = 'none';
          
          // Show selected section
          document.getElementById(section + '-section').style.display = 'block';
          
          // Update button states
          document.querySelectorAll('.toggle-btn').forEach(btn => {
              btn.classList.remove('active');
          });
          event.target.classList.add('active');
      }

      function createContributorsChart(data) {
          const ctx = document.getElementById('contributorsChart');
          if (!ctx) return;
          
          const countries = data.countries.slice(0, 10);
          
          if (charts.contributorsChart) {
              charts.contributorsChart.destroy();
          }
          
          charts.contributorsChart = new Chart(ctx.getContext('2d'), {
              type: 'bar',
              data: {
                  labels: countries.map(c => c.name),
                  datasets: [{
                      label: 'Contributors',
                      data: countries.map(c => c.total_contributors),
                      backgroundColor: 'rgba(244, 67, 54, 0.8)',
                      borderColor: 'rgba(244, 67, 54, 1)',
                      borderWidth: 2,
                      borderRadius: 8
                  }]
              },
              options: {
                  indexAxis: 'y', // This makes it horizontal
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          display: false
                      }
                  },
                  scales: {
                      x: {
                          beginAtZero: true,
                          grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                          }
                      },
                      y: {
                          grid: {
                              display: false
                          }
                      }
                  }
              }
          });
      }

      function createCoverageChart(data) {
          const ctx = document.getElementById('coverageChart');
          if (!ctx) return;
          
          let coverage = [];
          if (data.coverage_analysis && data.coverage_analysis.languages_by_country_count) {
              coverage = data.coverage_analysis.languages_by_country_count.slice(0, 8);
          }
          
          if (charts.coverageChart) {
              charts.coverageChart.destroy();
          }
          
          charts.coverageChart = new Chart(ctx.getContext('2d'), {
              type: 'polarArea',
              data: {
                  labels: coverage.map(l => Array.isArray(l) ? l[0] : l.language),
                  datasets: [{
                      label: 'Countries',
                      data: coverage.map(l => Array.isArray(l) ? l[1] : l.count),
                      backgroundColor: [
                          'rgba(102, 126, 234, 0.7)',
                          'rgba(118, 75, 162, 0.7)',
                          'rgba(240, 147, 251, 0.7)',
                          'rgba(245, 87, 108, 0.7)',
                          'rgba(79, 172, 254, 0.7)',
                          'rgba(0, 242, 254, 0.7)',
                          'rgba(67, 233, 123, 0.7)',
                          'rgba(56, 249, 215, 0.7)'
                      ],
                      borderColor: [
                          '#667eea', '#764ba2', '#f093fb', '#f5576c',
                          '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                      ],
                      borderWidth: 2
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          position: 'bottom',
                          labels: {
                              padding: 15,
                              usePointStyle: true
                          }
                      }
                  },
                  scales: {
                      r: {
                          beginAtZero: true,
                          grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                          }
                      }
                  }
              }
          });
      }

      function createLanguageDistributionChart(data) {
          const ctx = document.getElementById('languageDistributionChart');
          if (!ctx) return;
          
          // Process data for stacked bar chart
          const countries = data.countries.slice(0, 8);
          const allLanguages = new Set();
          
          countries.forEach(country => {
              if (country.languages) {
                  country.languages.forEach(lang => {
                      allLanguages.add(lang.name);
                  });
              }
          });
          
          const languageArray = Array.from(allLanguages);
          const datasets = languageArray.map((lang, index) => {
              const colors = [
                  '#667eea', '#764ba2', '#f093fb', '#f5576c',
                  '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
                  '#fa709a', '#fee140', '#a8edea', '#fed6e3'
              ];
              
              return {
                  label: lang,
                  data: countries.map(country => {
                      if (!country.languages) return 0;
                      const langData = country.languages.find(l => l.name === lang);
                      return langData ? langData.url_count : 0;
                  }),
                  backgroundColor: colors[index % colors.length],
                  borderWidth: 1,
                  borderColor: '#ffffff'
              };
          });
          
          if (charts.languageDistributionChart) {
              charts.languageDistributionChart.destroy();
          }
          
          charts.languageDistributionChart = new Chart(ctx.getContext('2d'), {
              type: 'bar',
              data: {
                  labels: countries.map(c => c.name),
                  datasets: datasets
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      x: {
                          stacked: true,
                          grid: {
                              display: false
                          }
                      },
                      y: {
                          stacked: true,
                          beginAtZero: true,
                          grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                          }
                      }
                  },
                  plugins: {
                      legend: {
                          position: 'bottom',
                          labels: {
                              padding: 15,
                              usePointStyle: true
                          }
                      }
                  }
              }
          });
      }

      function createWidespreadLanguagesChart(data) {
          const ctx = document.getElementById('widespreadLanguagesChart');
          if (!ctx) return;
          
          let languages = [];
          if (data.coverage_analysis && data.coverage_analysis.languages_by_country_count) {
              languages = data.coverage_analysis.languages_by_country_count.slice(0, 10);
          }
          
          if (charts.widespreadLanguagesChart) {
              charts.widespreadLanguagesChart.destroy();
          }
          
          charts.widespreadLanguagesChart = new Chart(ctx.getContext('2d'), {
              type: 'bar',
              data: {
                  labels: languages.map(l => Array.isArray(l) ? l[0] : l.language),
                  datasets: [{
                      label: 'Countries',
                      data: languages.map(l => Array.isArray(l) ? l[1] : l.count),
                      backgroundColor: 'rgba(67, 233, 123, 0.8)',
                      borderColor: 'rgba(67, 233, 123, 1)',
                      borderWidth: 2,
                      borderRadius: 8
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          display: false
                      }
                  },
                  scales: {
                      y: {
                          beginAtZero: true,
                          grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                          }
                      },
                      x: {
                          grid: {
                              display: false
                          }
                      }
                  }
              }
          });
      }

      function createLanguagePresenceChart(data) {
          const ctx = document.getElementById('languagePresenceChart');
          if (!ctx) return;
          
          let languages = [];
          if (data.coverage_analysis && data.coverage_analysis.languages_by_country_count) {
              languages = data.coverage_analysis.languages_by_country_count;
          }
          
          if (charts.languagePresenceChart) {
              charts.languagePresenceChart.destroy();
          }
          
          charts.languagePresenceChart = new Chart(ctx.getContext('2d'), {
              type: 'line',
              data: {
                  labels: languages.map(l => Array.isArray(l) ? l[0] : l.language),
                  datasets: [{
                      label: 'Country Presence',
                      data: languages.map(l => Array.isArray(l) ? l[1] : l.count),
                      borderColor: '#667eea',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: '#667eea',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointRadius: 6
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          display: false
                      }
                  },
                  scales: {
                      y: {
                          beginAtZero: true,
                          grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                          }
                      },
                      x: {
                          grid: {
                              display: false
                          }
                      }
                  }
              }
          });
      }

      function createLeaderboard(data) {
          const leaderboard = document.getElementById('globalLeaderboard');
          
          // Check if leaderboard element exists
          if (!leaderboard) {
              console.error('Leaderboard element not found');
              return;
          }
          
          // Check if data exists and has the expected structure
          if (!data.top_contributors_global || !Array.isArray(data.top_contributors_global)) {
              console.error('Invalid leaderboard data structure');
              leaderboard.innerHTML = '<div class="contributor-item">No contributor data available</div>';
              return;
          }
          
          const contributors = data.top_contributors_global.slice(0, 10);
          
          leaderboard.innerHTML = contributors.map((contributor, index) => {
              // Handle both array format [name, count] and object format
              const name = Array.isArray(contributor) ? contributor[0] : contributor.name;
              const count = Array.isArray(contributor) ? contributor[1] : contributor.count;
              
              return `
                  <div class="contributor-item">
                      <div class="contributor-rank">#${index + 1}</div>
                      <div class="contributor-count">${count || 0}</div>
                      <div class="contributor-name">${name || 'Unknown'}</div>
                  </div>
              `;
          }).join('');
      }

      function createCountryCards(data) {
          const countryGrid = document.getElementById('countryGrid');
          if (!countryGrid) return;
          
          countryGrid.innerHTML = data.countries.map(country => `
              <div class="country-card">
                  <div class="country-header">
                      <div class="country-name">${country.name}</div>
                  </div>
                  <div class="country-stats">
                      <div class="country-stat">
                          <div class="country-stat-number">${country.total_urls.toLocaleString()}</div>
                          <div class="country-stat-label">URLs</div>
                      </div>
                      <div class="country-stat">
                          <div class="country-stat-number">${country.total_contributors}</div>
                          <div class="country-stat-label">Contributors</div>
                      </div>
                      <div class="country-stat">
                          <div class="country-stat-number">${country.languages ? country.languages.length : 0}</div>
                          <div class="country-stat-label">Languages</div>
                      </div>
                  </div>
                  <div class="country-languages">
                      ${country.languages ? country.languages.slice(0, 3).map(lang => `
                          <div class="language-tag">
                              <span class="language-name">${lang.name}</span>
                              <span class="language-count">${lang.url_count}</span>
                          </div>
                      `).join('') : ''}
                      ${country.languages && country.languages.length > 3 ? `
                          <div class="language-tag more">+${country.languages.length - 3} more</div>
                      ` : ''}
                  </div>
                  <div class="country-top-contributors">
                      <div class="contributors-title">Top Contributors:</div>
                      ${country.top_contributors ? country.top_contributors.slice(0, 3).map(([name, count]) => `
                          <div class="top-contributor">
                              <span class="contributor-count">${count}</span>
                              <span class="contributor-name">${name}</span>
                          </div>
                      `).join('') : ''}
                  </div>
              </div>
          `).join('');
      }

      // Utility function to format numbers
      function formatNumber(num) {
          return num.toLocaleString();
      }

      // Utility function to truncate text
      function truncateText(text, maxLength) {
          if (text.length <= maxLength) return text;
          return text.substring(0, maxLength) + '...';
      }

      // Add event listeners for responsive behavior
      function addEventListeners() {
          // Add resize listener to handle chart responsiveness
          window.addEventListener('resize', () => {
              Object.values(charts).forEach(chart => {
                  if (chart && typeof chart.resize === 'function') {
                      chart.resize();
                  }
              });
          });
          
          // Add click handlers for country cards (optional)
          document.addEventListener('click', (e) => {
              if (e.target.closest('.country-card')) {
                  const countryCard = e.target.closest('.country-card');
                  const countryName = countryCard.querySelector('.country-name').textContent;
                  console.log(`Clicked on country: ${countryName}`);
                  // Add any additional functionality for country card clicks
              }
          });
      }

      // Initialize everything when DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
          initializeDashboard();
          addEventListeners();
      });

      // Export functions for potential external use
      window.dashboardAPI = {
          loadData,
          initializeDashboard,
          updateSummaryStats,
          createCharts,
          formatNumber,
          truncateText
      };