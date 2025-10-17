from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

# --- 1. Initialize the Flask Application ---
# Create an instance of the Flask class. This is the core of our web application.
app = Flask(__name__)

# --- 2. Configure Cross-Origin Resource Sharing (CORS) ---
# This is essential for allowing our frontend (and Node.js backend) to send requests
# to this Flask server, which will be running on a different port.
CORS(app)

# --- 3. Load the Trained Machine Learning Model ---
# We load the model once when the server starts to be efficient.
# This avoids reloading the model on every single prediction request.
model_path = 'insurance_premium_model.pkl'
try:
    model = joblib.load(model_path)
    print(f"Model loaded successfully from {model_path}")
except FileNotFoundError:
    print(f"Error: Model file not found at {model_path}. Please ensure the model file is in the correct directory.")
    # Exit if the model can't be found, as the app is useless without it.
    exit()
except Exception as e:
    print(f"An error occurred while loading the model: {e}")
    exit()

# --- 4. Define the Prediction API Endpoint ---
# We create a route '/predict' that accepts POST requests.
# The web application will send user data to this endpoint.
@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives user input as JSON, uses the loaded model to make a prediction,
    and returns the prediction as JSON.
    """
    try:
        # Get the JSON data sent from the client (Node.js server)
        data = request.get_json()

        # --- Data Validation and Extraction ---
        # Extract the features from the JSON data in the correct order that the model expects.
        # It's crucial that this order matches the order of features during model training.
        age = float(data['age'])
        bmi = float(data['bmi'])
        any_transplants = int(data['anyTransplants'])
        num_surgeries = int(data['numberOfMajorSurgeries'])

        # --- Create Feature Array for Prediction ---
        # The model expects a 2D array as input, so we create a NumPy array
        # of shape (1, 4) representing a single prediction request.
        features = np.array([[age, bmi, any_transplants, num_surgeries]])

        # --- Make a Prediction ---
        # Use the loaded model's .predict() method to get the premium price.
        prediction = model.predict(features)

        # --- Format and Return the Response ---
        # The prediction is a NumPy array, so we extract the single value from it.
        # We then return it in a JSON object for easy parsing by the client.
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

# --- 5. Run the Flask Server ---
# This block ensures that the server runs only when the script is executed directly
# (not when imported as a module). '0.0.0.0' makes the server accessible on your local network.
if __name__ == '__main__':
    # Use Gunicorn for production, but for development, the Flask server is fine.
    # The default port is 5000.
    app.run(host='0.0.0.0', port=5000, debug=True)
