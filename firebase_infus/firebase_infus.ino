#include "DHT.h"
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

#define DHTPIN D4
#define DHTTYPE DHT22

#define FIREBASE_HOST "infus-1621a.firebaseio.com"
#define FIREBASE_AUTH "odLpzy03GpzEWcmxTt3dqXYdQ38GT1A5CmbT139H"
#define WIFI_SSID "HOME"
#define WIFI_PASSWORD "1234h0me"

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  dht.begin();
}

void loop() {
  delay(2000);
  
  DynamicJsonBuffer jsonBuffer;
  float temperature = dht.readTemperature();

  if(isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }


  // Push to Firebase
  JsonObject& temperatureObject = jsonBuffer.createObject();
  JsonObject& tempTime = temperatureObject.createNestedObject("timestamp");
  temperatureObject["value"] = temperature;
  tempTime[".sv"] = "timestamp";
  Firebase.push("temperature", temperatureObject);
  // handle error
  if (Firebase.failed()) {
      Serial.print("pushing /temperature failed:");
      Serial.println(Firebase.error());
      return;
  }
  
  Serial.println("Push success");
}
