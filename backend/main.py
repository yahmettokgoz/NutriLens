from fastapi import FastAPI

# Uygulamayı oluşturuyoruz
app = FastAPI()

# Ana sayfaya (root) istek gelince çalışacak fonksiyon
@app.get("/")
def read_root():
    return {"message": "NutriLens Backend Hazır ve Çalışıyor! 🚀"}