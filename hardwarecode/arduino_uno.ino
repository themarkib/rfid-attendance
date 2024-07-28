#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9
#define BUZZER_PIN 8 // Pin where the buzzer is connected

MFRC522 mfrc522(SS_PIN, RST_PIN);

// Define known UIDs (example UIDs, replace with actual ones)
byte knownUIDs[][4] = {
  {0xA1,0x14,0x6D,0x1B},
{0x33,0x77,0x1D,0x0A}
};
const int numKnownUIDs = sizeof(knownUIDs) / sizeof(knownUIDs[0]);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
  pinMode(BUZZER_PIN, OUTPUT); // Initialize buzzer pin as an output
  Serial.println("Scan RFID card...");
}

void loop() {
  // Look for new cards
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // Print UID to serial monitor without spaces
    // Serial.print("UID:");
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10) {
        Serial.print("0");
      }
      Serial.print(mfrc522.uid.uidByte[i], HEX);
    }
    Serial.println();

    // Check if the UID is known
    if (isKnownUID(mfrc522.uid.uidByte, mfrc522.uid.size)) {
      // UID is known, beep the buzzer once
      beepBuzzer(1);
    } else {
      // UID is unknown, beep the buzzer 3 times
      beepBuzzer(3);
    }

    mfrc522.PICC_HaltA(); // Halt PICC
    mfrc522.PCD_StopCrypto1(); // Stop encryption on PCD
    delay(1000); // Delay before looking for another card
  }
}

bool isKnownUID(byte *uid, byte size) {
  for (int i = 0; i < numKnownUIDs; i++) {
    if (memcmp(uid, knownUIDs[i], size) == 0) {
      return true;
    }
  }
  return false;
}

void beepBuzzer(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(BUZZER_PIN, HIGH); // Turn buzzer on
    delay(100); // Buzz for 100 milliseconds
    digitalWrite(BUZZER_PIN, LOW); // Turn buzzer off
    delay(100); // Short delay between beeps
  }
}
