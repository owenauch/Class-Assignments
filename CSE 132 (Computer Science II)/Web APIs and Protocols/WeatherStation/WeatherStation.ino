/* weatherReceiver
 *  
 *  CSE 132 - Assignment 10
 *  
 *  Fill this out so we know whose assignment this is.
 *  
 *  Name: Owen Auch
 *  WUSTL Key: 443774
 *  
 *  Name:
 *  WUSTL Key:
 *  
 */
const int potPin = A0;
int counter = 0;
char c = 0x04;
const int frame = 1;
//define led pins
const int row1 = 2;
const int row2 = 3;
const int row3 = 4;
const int row4 = 5;
const int row5 = 6;
const int row6 = 7;
const int row7 = 8;
const int col1 = 9;
const int col2 = 10;
const int col3 = 11;
const int col4 = 12;
const int col5 = 13;

const char MAGIC = 0x24;

#include "font.h"

void setup ()
{
  Serial.begin(9600);
  pinMode(row1, OUTPUT);
  pinMode(row2, OUTPUT);
  pinMode(row3, OUTPUT);
  pinMode(row4, OUTPUT);
  pinMode(row5, OUTPUT);
  pinMode(row6, OUTPUT);
  pinMode(row7, OUTPUT);
  pinMode(col1, OUTPUT);
  pinMode(col2, OUTPUT);
  pinMode(col3, OUTPUT);
  pinMode(col4, OUTPUT);
  pinMode(col5, OUTPUT);

  pinMode(A0, INPUT);
}

void loop ()
{
  readWeather();
}

void readWeather() {
  if (Serial.available() > 0) {
    //check for magic number -- transmit most significant first
    c = Serial.read();
    if (c == MAGIC) {
      c = (char) Serial.read();
    }
  }
  displayChar(c);
}

void displayChar(char c) {
  for (int x = 2; x < 9; x++) {
    digitalWrite(x, LOW);
  }
  for (int f = 9; f < 14; f++) {
    digitalWrite(f, HIGH);
  }
  int line = 0;
  switch (counter) {
    case 0:
      digitalWrite(col1, LOW);
      line = font_5x7[c][0];
      for (int r = 0; r < 7; r++) {
        if ((line >> (7-r)) & 1) {
          digitalWrite((r+2), HIGH);
        }
      }
      counter = 1;
      break;
      
    case 1:
      digitalWrite(col2, LOW);
      line = font_5x7[c][1];
      for (int r = 0; r < 7; r++) {
        if ((line >> (7-r)) & 1) {
          digitalWrite((r+2), HIGH);
        }
      }
      counter = 2;
      break;
      
    case 2:
      digitalWrite(col3, LOW);
      line = font_5x7[c][2];
      for (int r = 0; r < 7; r++) {
        if ((line >> (7-r)) & 1) {
          digitalWrite((r+2), HIGH);
        }
      }
      counter = 3;
      break;

    case 3:
      digitalWrite(col4, LOW);
      line = font_5x7[c][3];
      for (int r = 0; r < 7; r++) {
        if ((line >> (7-r)) & 1) {
          digitalWrite((r+2), HIGH);
        }
      }
      counter = 4;
      break;

    case 4:
      digitalWrite(col5, LOW);
      line = font_5x7[c][4];
      for (int r = 0; r < 8; r++) {
        if ((line >> (7-r)) & 1) {
          digitalWrite((r+2), HIGH);
        }
      }
      counter = 0;
      break;
  }

  delay(frame);
  stateSwitcher();
}

void stateSwitcher() {
  int potOutput = analogRead(potPin);
  if (potOutput < 333) {
    //digitalWrite(13, HIGH);
    Serial.write(MAGIC);
    Serial.write(0x01);
  }
  else if (potOutput >= 333 && potOutput <= 666) {
    //digitalWrite(13, HIGH);
    Serial.write(MAGIC);
    Serial.write(0x02);
  } 
  else {
    digitalWrite(13, HIGH);
    Serial.write(MAGIC);
    Serial.write(0x03);
  }
}

