<div align="center">

# House Type Prediction

**Predict the room type of an NYC rental listing from its location, price, and review activity.**

<p>
  <img src="https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white" alt="Python 3.9+">
  <img src="https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white" alt="FastAPI backend">
  <img src="https://img.shields.io/badge/scikit--learn-model-F7931E?logo=scikitlearn&logoColor=white" alt="scikit-learn model">
  <img src="https://img.shields.io/badge/HTML%2FCSS%2FJS-frontend-E34F26?logo=html5&logoColor=white" alt="HTML CSS JS frontend">
  <img src="https://img.shields.io/badge/Render-deployed-46E3B7?logo=render&logoColor=white" alt="Deployed on Render">
</p>

<a href="https://house-type-predictor.onrender.com">
  <img src="https://img.shields.io/badge/LIVE%20DEMO-house--type--predictor.onrender.com-3D6B5C?style=for-the-badge" alt="Live demo">
</a>

</div>

---

## Overview

Given the details of a listing, the trained model classifies what type of room is being offered and returns a confidence score for every class. The project is split into three parts:

1. **Model**: a scikit-learn pipeline trained on NYC listing data and saved with `joblib`.
2. **Backend**: a FastAPI service that validates input and serves predictions.
3. **Frontend**: a lightweight HTML, CSS, and JavaScript interface that talks to the API.

## Features

- Predicts room type with a full probability breakdown across all classes
- Strict input validation with clear error messages (latitude and longitude ranges, positive prices, valid night counts, and more)
- Clean, responsive interface with a confidence bar for each class
- **Autofill sample** button that loads realistic NYC listings for quick testing
- CORS enabled, so the frontend can be hosted separately from the API
- Interactive API docs generated automatically by FastAPI

## Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Model     | Python, scikit-learn, pandas, joblib            |
| Backend   | FastAPI, Pydantic, Uvicorn                      |
| Frontend  | HTML, CSS, vanilla JavaScript                   |
| Hosting   | Render                                          |

## Project Structure

```
house-type-prediction/
├── backend/        # FastAPI app that loads the model and serves predictions
├── frontend/       # index.html, style.css, script.js
├── model/          # Trained model artifact and training work
├── .gitignore
└── README.md
```

## How It Works

1. The user fills in the listing details in the frontend form.
2. `script.js` sends the values as JSON to the `/predict` endpoint.
3. FastAPI validates the payload against the `Features` schema.
4. The values are arranged into a single-row DataFrame in the exact column order the model was trained on.
5. The pipeline handles preprocessing (imputation, scaling, and one-hot encoding of categorical fields) and outputs a predicted class along with class probabilities.
6. The frontend displays the predicted room type and a confidence bar for each class.

## Getting Started

### Prerequisites

- Python 3.9 or newer
- pip

### 1. Clone the repository

```bash
git clone https://github.com/shrutisingh004/house-type-prediction.git
cd house-type-prediction
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> **Important:** install the same scikit-learn version that was used to train the model. Loading a pickle saved with a different version can fail or behave unexpectedly.

### 4. Start the backend

Run the server from the folder that contains `main.py` and the model file (`model.pkl`):

```bash
uvicorn main:app --reload --port 8000
```

Wait until you see `Application startup complete` in the terminal. The API is now available at `http://127.0.0.1:8000`, and interactive docs are at `http://127.0.0.1:8000/docs`.

### 5. Open the frontend

Open `frontend/index.html` in your browser. Make sure the API URL inside `script.js` points to your local server:

```js
const apiUrl = 'http://localhost:8000/predict';
```

The backend must stay running while you use the frontend.

## API Reference

### `GET /`

Health check.

**Response**
```json
"Welcome"
```

### `POST /predict`

Returns the predicted room type and class probabilities.

**Request body**
```json
{
  "latitude": 40.7081,
  "longitude": -73.9571,
  "price": 165,
  "minimum_nights": 3,
  "number_of_reviews": 112,
  "reviews_per_month": 3.4,
  "calculated_host_listings_count": 2,
  "availability_365": 95,
  "neighbourhood_group": "Brooklyn",
  "neighbourhood": "Williamsburg"
}
```

**Response**
```json
{
  "Predicted Room Type": "Private room",
  "Probability": [0.12, 0.85, 0.03]
}
```

The `Probability` array follows the same order as the model's classes.

**Example with curl**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"latitude":40.7081,"longitude":-73.9571,"price":165,"minimum_nights":3,"number_of_reviews":112,"reviews_per_month":3.4,"calculated_host_listings_count":2,"availability_365":95,"neighbourhood_group":"Brooklyn","neighbourhood":"Williamsburg"}'
```

## Input Fields

| Field                            | Type    | Rules                          | Description                         |
| -------------------------------- | ------- | ------------------------------ | ----------------------------------- |
| `latitude`                       | float   | between -90 and 90             | Latitude of the listing             |
| `longitude`                      | float   | between -180 and 180           | Longitude of the listing            |
| `price`                          | float   | greater than 0                 | Price per night                     |
| `minimum_nights`                 | int     | 1 to 365                       | Minimum nights required to book     |
| `number_of_reviews`              | int     | 0 or more                      | Total number of reviews             |
| `reviews_per_month`              | float   | 0 or more                      | Average reviews per month           |
| `calculated_host_listings_count` | int     | 0 or more                      | Number of listings by the host      |
| `availability_365`               | int     | 0 to 365                       | Days available out of the year      |
| `neighbourhood_group`            | string  | non-empty                      | Borough (for example, Brooklyn)     |
| `neighbourhood`                  | string  | non-empty                      | Neighbourhood name                  |

Requests that break these rules receive a `422 Unprocessable Entity` response describing what is wrong.

## Using the Frontend

1. Choose a borough and enter the neighbourhood.
2. Fill in coordinates, price, and the remaining listing details.
3. Click **Predict room type** to see the predicted class and confidence bars.
4. Not sure what to enter? Click **Autofill sample** to load a realistic example listing, then tweak the values and predict again.

## Deployment

The app is deployed on [Render](https://render.com).

- **Backend:** deployed as a Python web service running Uvicorn.
- **Frontend:** the `apiUrl` in `script.js` should point to the deployed backend, for example `https://house-type-predictor.onrender.com/predict`.
