from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation import get_recommendations
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "ML Recommendation Service is running"})

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400
            
        # In a real app, we would fetch the user-item interaction matrix from MongoDB here.
        # For demonstration, we'll pass the user_id to our KNN model wrapper.
        recommended_products = get_recommendations(user_id)
        
        return jsonify({
            "user_id": user_id,
            "recommendations": recommended_products
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
