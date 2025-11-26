from fastapi import FastAPI, UploadFile, File
import shutil
import os

app = FastAPI()

# Resimlerin kaydedileceği klasör
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "NutriLens Backend Calisiyor!"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # 1. Dosyayı kaydet
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    print(f" ---> RESIM GELDI VE KAYDEDILDI: {file.filename}")
    
    # 2. Cevap dön
    return {"message": "Resim başarıyla alındı!", "dosya": file.filename}