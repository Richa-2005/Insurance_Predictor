from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

model_path = 'insurance_premium_model.pkl'
try:
    model = joblib.load(model_path)
    print(f"Model loaded successfully from {model_path}")
except FileNotFoundError:
    print(f"Error: Model file not found at {model_path}. Please ensure the model file is in the correct directory.")
    exit()
except Exception as e:
    print(f"An error occurred while loading the model: {e}")
    exit()

@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives user input as JSON, uses the loaded model to make a prediction,
    and returns the prediction as JSON.
    """
    try:
        
        data = request.get_json()
        age = float(data['age'])
        bmi = float(data['bmi'])
        any_transplants = int(data['anyTransplants'])
        num_surgeries = int(data['numberOfMajorSurgeries'])

        
        features = np.array([[age, bmi, any_transplants, num_surgeries]])
        prediction = model.predict(features)

        response = {'predicted_premium': round(prediction[0], 2)}
        return jsonify(response)

    except KeyError as e:
        # Handle cases where the incoming JSON is missing a required key.
        return jsonify({'error': f'Missing key in request: {str(e)}'}), 400
    except (ValueError, TypeError) as e:
        # Handle cases where the data types are incorrect (e.g., sending text instead of a number).
        return jsonify({'error': f'Invalid data type in request: {str(e)}'}), 400
    except Exception as e:
        # A general catch-all for any other unexpected errors.
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
   
    app.run(host='0.0.0.0', port=5001, debug=True)
