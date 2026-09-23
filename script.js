const form = document.getElementById('predict-form');
const goBtn = document.getElementById('go-btn');
const fillBtn = document.getElementById('fill-btn');
const resultArea = document.getElementById('result-area');

const SAMPLES = [
  { neighbourhood_group: 'Manhattan', neighbourhood: 'Harlem', latitude: 40.8116, longitude: -73.9465,
    price: 89, minimum_nights: 2, number_of_reviews: 45, reviews_per_month: 1.8,
    calculated_host_listings_count: 1, availability_365: 210 },
  { neighbourhood_group: 'Brooklyn', neighbourhood: 'Williamsburg', latitude: 40.7081, longitude: -73.9571,
    price: 165, minimum_nights: 3, number_of_reviews: 112, reviews_per_month: 3.4,
    calculated_host_listings_count: 2, availability_365: 95 },
  { neighbourhood_group: 'Queens', neighbourhood: 'Astoria', latitude: 40.7643, longitude: -73.9235,
    price: 72, minimum_nights: 1, number_of_reviews: 28, reviews_per_month: 0.9,
    calculated_host_listings_count: 1, availability_365: 300 },
  { neighbourhood_group: 'Manhattan', neighbourhood: 'Midtown', latitude: 40.7549, longitude: -73.9840,
    price: 310, minimum_nights: 1, number_of_reviews: 6, reviews_per_month: 0.4,
    calculated_host_listings_count: 15, availability_365: 340 },
  { neighbourhood_group: 'Bronx', neighbourhood: 'Riverdale', latitude: 40.8912, longitude: -73.9128,
    price: 55, minimum_nights: 4, number_of_reviews: 9, reviews_per_month: 0.6,
    calculated_host_listings_count: 1, availability_365: 60 },
  { neighbourhood_group: 'Staten Island', neighbourhood: 'St. George', latitude: 40.6437, longitude: -74.0787,
    price: 48, minimum_nights: 2, number_of_reviews: 14, reviews_per_month: 1.1,
    calculated_host_listings_count: 1, availability_365: 180 }
];

fillBtn.addEventListener('click', () => {
  const sample = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
  Object.entries(sample).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el) el.value = value;
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    latitude: parseFloat(document.getElementById('latitude').value),
    longitude: parseFloat(document.getElementById('longitude').value),
    price: parseFloat(document.getElementById('price').value),
    minimum_nights: parseInt(document.getElementById('minimum_nights').value, 10),
    number_of_reviews: parseInt(document.getElementById('number_of_reviews').value, 10),
    reviews_per_month: parseFloat(document.getElementById('reviews_per_month').value),
    calculated_host_listings_count: parseInt(document.getElementById('calculated_host_listings_count').value, 10),
    availability_365: parseInt(document.getElementById('availability_365').value, 10),
    neighbourhood_group: document.getElementById('neighbourhood_group').value,
    neighbourhood: document.getElementById('neighbourhood').value
  };

  const apiUrl = 'http://localhost:8000/predict';

  goBtn.disabled = true;
  goBtn.textContent = 'Predicting…';

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server responded ${res.status}: ${errText}`);
    }

    const data = await res.json();
    renderResult(data);

  } catch (err) {
    renderError(err.message);
  } finally {
    goBtn.disabled = false;
    goBtn.textContent = 'Predict room type';
  }
});

function renderResult(data) {
  const type = data['Predicted Room Type'];
  const probs = data['Probability'] || [];

  // best-effort class labels; falls back to index if model classes are unknown
  const commonLabels = ['Entire home/apt', 'Private room', 'Shared room', 'Hotel room'];
  const labels = probs.length === commonLabels.length ? commonLabels : probs.map((_, i) => `Class ${i}`);

  let barsHtml = '';
  probs.forEach((p, i) => {
    const pct = (p * 100).toFixed(1);
    barsHtml += `
      <div class="bar-item">
        <div class="bar-row">
          <span class="bar-label">${labels[i]}</span>
          <span class="bar-pct">${pct}%</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  });

  resultArea.innerHTML = `
    <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--ink-soft);">PREDICTED TYPE</div>
    <div class="result-type">${type}</div>
    <div class="bars">${barsHtml}</div>
  `;
}

function renderError(message) {
  resultArea.innerHTML = `
    <div class="error-box">
      Couldn't reach the prediction API.<br>${message}
    </div>`;
}