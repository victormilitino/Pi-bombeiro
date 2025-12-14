from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# ============================
# Carregar modelo
# ============================

def carregar_modelo():
    if not os.path.exists("model.pkl"):
        raise FileNotFoundError("model.pkl não encontrado. Treine o modelo primeiro.")

    with open("model.pkl", "rb") as f:
        data = pickle.load(f)
        modelo = data["pipeline"]
        label_encoder = data["label_encoder"]
    return modelo, label_encoder

modelo, label_encoder = carregar_modelo()

# ============================
# Endpoint de predição
# ============================

@app.route("/api/predizer", methods=["POST"])
def predizer():
    dados = request.get_json()

    if not dados or not all(k in dados for k in ("local", "hora", "dia_semana")):
        return jsonify({"erro": "JSON inválido. Esperado: local, hora, dia_semana"}), 400

    try:
        df = pd.DataFrame([dados])
        y_prob = modelo.predict_proba(df)[0]
        y_pred_encoded = modelo.predict(df)[0]
        y_pred = label_encoder.inverse_transform([y_pred_encoded])[0]

        classes = label_encoder.classes_

        return jsonify({
            "classe_predita": y_pred,
            "probabilidades": {
                classe: float(prob) for classe, prob in zip(classes, y_prob)
            }
        }), 200

    except Exception as e:
        return jsonify({"erro": f"Erro ao fazer predição: {str(e)}"}), 500

# ============================
# Rodar servidor
# ============================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
