import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState(false);

  // SENİN IP ADRESİN BURAYA GÖMÜLDÜ
  const SERVER_URL = "http://192.168.1.58:8000/analyze";

  if (!permission) return <View />;
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Kamerayı kullanmak için izin verin.</Text>
        <Button onPress={requestPermission} title="İzin Ver" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      setLoading(true);
      console.log("Fotoğraf çekiliyor...");
      
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
          exif: false,
        });

        if (photo?.uri) {
          console.log('Sunucuya gönderiliyor:', SERVER_URL);
          
          const formData = new FormData();
          // @ts-ignore
          formData.append('file', {
            uri: photo.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
          });

          const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const result = await response.json();
          console.log("Backend Cevabı:", result);
          Alert.alert("BAŞARILI! 🎉", "Fotoğraf backend klasörüne kaydedildi.");
        }
      } catch (error) {
        console.log("HATA:", error);
        Alert.alert("HATA ❌", "Sunucuya bağlanılamadı.\n" + SERVER_URL + "\nLütfen bilgisayarın IP'sini ve sunucunun açık olduğunu kontrol et.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>{loading ? "⏳" : "📸 ÇEK"}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  message: { textAlign: 'center', paddingBottom: 10, color: 'black' },
  camera: { flex: 1 },
  buttonContainer: { flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64 },
  button: { flex: 1, alignSelf: 'flex-end', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10 },
  text: { fontSize: 24, fontWeight: 'bold', color: 'black' },
});