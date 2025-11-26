from fastapi import FastAPI, UploadFile, File
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import uuid

# 1. .env dosyasını yükle
load_dotenv()

app = FastAPI()

# 2. Şifreleri güvenli şekilde çek
# Eğer dosyada bulamazsa hata vermesin diye kontrol ediyoruz
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("HATA: .env dosyası bulunamadı veya içi boş!")

# Supabase bağlantısı
supabase: Client = create_client(url, key)

@app.get("/")
def read_root():
    return {"message": "Backend Güvenli Modda Çalışıyor!"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    print(f"Resim geldi: {file.filename}")
    
    file_content = await file.read()
    file_path = f"{uuid.uuid4()}.jpg"
    
    try:
        supabase.storage.from_("meal-images").upload(
            path=file_path,
            file=file_content,
            file_options={"content-type": "image/jpeg"}
        )
        
        public_url = supabase.storage.from_("meal-images").get_public_url(file_path)
        print(f"Yüklendi: {public_url}")
        
        return {"message": "Başarılı!", "link": public_url}
        
    except Exception as e:
        print(f"HATA: {e}")
        return {"error": str(e)}