import pandas as pd
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. Initialization ---
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# --- 2. Load Model and Data ---
MODEL_PATH = 'insurance_premium_model.pkl'
DATA_PATH = 'Medicalpremium.csv' # Make sure this CSV file is in the same folder

try:
    model = joblib.load(MODEL_PATH)
    print(f"* Model loaded successfully from {MODEL_PATH}")
    
    # Load the raw data for analysis
    raw_data = pd.read_csv(DATA_PATH)
    print(f"* Raw data loaded successfully from {DATA_PATH}")
    
except FileNotFoundError as e:
    print(f"Error: Missing file. Make sure '{e.filename}' is in the correct directory.")
    model = None
    raw_data = None
except Exception as e:
    print(f"Error loading model or data: {e}")
    model = None
    raw_data = None


# --- 3. Analysis Function ---
def get_age_group_analysis(df, user_age):
    """
    Analyzes the premium prices for a 5-year age group centered around the user's age.
    """
    try:
        # Define a 5-year age window (e.g., age 45 -> 43-47)
        age_min = user_age - 3
        age_max = user_age + 3
        
        # Filter the DataFrame for the age group
        age_group_df = df[(df['Age'] >= age_min) & (df['Age'] <= age_max)]
        
        if age_group_df.empty:
            # Fallback if no data (e.g., edge of dataset)
            return {
                "age_range": f"{age_min}-{age_max}",
                "min_premium": None,
                "avg_premium": None,
                "max_premium": None,
                "count": 0
            }

        # Calculate statistics
        stats = age_group_df['PremiumPrice'].agg(['min', 'mean', 'max', 'count']).to_dict()

        return {
            "age_range": f"{age_min}-{age_max}",
            "min_premium": round(stats['min'], 2),
            "avg_premium": round(stats['mean'], 2),
            "max_premium": round(stats['max'], 2),
            "count": int(stats['count'])
        }

    except Exception as e:
        print(f"Error during analysis: {e}")
        return None

# --- 4. Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None or raw_data is None:
        return jsonify({'error': 'Server is not ready, model or data not loaded.'}), 500

    try:
        data = request.get_json()
        
        # Extract features for the model
        user_age = int(data['age'])
        bmi = float(data['bmi'])
        transplants = int(data['anyTransplants'])
        surgeries = int(data['numberOfMajorSurgeries'])
        
        # --- a) Make Prediction ---
        features = np.array([[user_age, bmi, transplants, surgeries]])
        prediction = model.predict(features)[0]
        predicted_premium = round(prediction, 2)
        
        # --- b) Perform Analysis ---
        analysis = get_age_group_analysis(raw_data, user_age)
        
        if analysis is None:
            return jsonify({'error': 'Analysis failed.'}), 500
            
        # --- c) Return Combined Response ---
        return jsonify({
            'predicted_premium': predicted_premium,
            'age_group_analysis': analysis
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': f'An error occurred: {e}'}), 400

# --- 5. Run the App ---
if __name__ == '__main__':
    # Use port 5001 to avoid conflict with Node.js
    app.run(port=5001, debug=True)
