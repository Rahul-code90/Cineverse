from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/predict/demand', methods=['GET'])
def predict_demand():
    # Simulate demand prediction logic
    # Assume 1-10 scale for demand score, and an occupancy percentage
    demand_score = round(random.uniform(4.0, 9.8), 1)
    occupancy = int(demand_score * 10) + random.randint(-5, 5)
    occupancy = min(100, max(0, occupancy))
    
    return jsonify({
        "status": "success",
        "prediction": {
            "demandScore": demand_score,
            "expectedOccupancy": occupancy,
            "trend": "rising" if demand_score > 7 else "stable"
        }
    })

@app.route('/predict/revenue', methods=['GET'])
def predict_revenue():
    # Simulate a monthly revenue expectation array based on "ML" historical inputs
    # E.g., for the next 6 months
    base_revenue = 500000
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    forecast = []
    
    for i in range(12):
        trend_factor = 1.0 + (i * 0.05) # Growth over the year
        fluctuation = random.uniform(0.85, 1.15)
        monthly_val = int(base_revenue * trend_factor * fluctuation)
        forecast.append({"month": months[i], "revenue": monthly_val})
        
    return jsonify({
        "status": "success",
        "data": forecast
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "ML Service is running"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
