#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#define ON_Board_LED 2

const char* ssid = "YourWifi";
const char* password = "YourPassword";

HTTPClient http;
WiFiClient client;

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  Serial.println("");

  pinMode(ON_Board_LED, OUTPUT);
  digitalWrite(ON_Board_LED, HIGH);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    digitalWrite(ON_Board_LED, LOW);
    delay(250);
    digitalWrite(ON_Board_LED, HIGH);
    delay(250);
  }
  digitalWrite(ON_Board_LED, HIGH);
  Serial.println("");
  Serial.print("Successfully connected to : ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (Serial.available() > 0) {
    String cardData = Serial.readStringUntil('\n');
    cardData.trim();

    if (WiFi.status() == WL_CONNECTED) {
      String url = "http://LocalIP:3000/project/backend/uid";
      String postData = "UIDresult=" + cardData;

      http.begin(client, url);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      int httpCode = http.POST(postData);
      String payload = http.getString();

      Serial.println(cardData);
      Serial.println(httpCode);
      Serial.println(payload);

      http.end();
    }
    delay(1000);
  }
}
