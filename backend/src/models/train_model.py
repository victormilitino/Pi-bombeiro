import pandas as pd
from xgboost import XGBClassifier
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from datetime import datetime
import pickle

# ============================
# 1. Carregar dados
# ============================

df = pd.read_csv("ocorrencias.csv")  
# Esperado: colunas -> local, timestamp, tipo

# ============================
# 2. Extrair features de tempo
# ============================

def extrair_features(row):
    dt = datetime.fromisoformat(row["timestamp"])
    return pd.Series({
        "hora": dt.hour,
        "dia_semana": dt.weekday()
    })

tempo = df.apply(extrair_features, axis=1)
df = pd.concat([df, tempo], axis=1)

# ============================
# 3. Separar X e y
# ============================

X = df[["local", "hora", "dia_semana"]]
y = df["tipo"]

# ============================
# 4. Encode do alvo
# ============================

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# ============================
# 5. Pré-processamento
# ============================

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["local"]),
        ("num", "passthrough", ["hora", "dia_semana"])
    ]
)

# ============================
# 6. Pipeline com XGBoost
# ============================

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", XGBClassifier(
        use_label_encoder=False,
        eval_metric="mlogloss",
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1
    ))
])

# ============================
# 7. Treinar
# ============================

pipeline.fit(X, y_encoded)

# ============================
# 8. Salvar modelo
# ============================

with open("model.pkl", "wb") as f:
    pickle.dump({
        "pipeline": pipeline,
        "label_encoder": label_encoder
    }, f)

print("✅ Modelo treinado e salvo em model.pkl")
