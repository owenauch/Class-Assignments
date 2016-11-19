
/* 
 * This file displays characters on a multiplexed LED board. 
 */
//define button pins -- 0 if pressed
const int upButton = 0;
const int downButton = 1;
const int frame = 2;

int counter = 0;

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

unsigned long accum1 = 0;
unsigned long accum2 = 0;

bool upButtonState;
bool lastUpButtonState = 0;

bool downButtonState;
bool lastDownButtonState = 0;

unsigned long lastDownDebounceTime = 0;

unsigned long lastUpDebounceTime = 0;
unsigned long debounceDelay = 50;

char c = 0x21;

#include "font.h"

void setup ()
{
  // insert code here as needed
//  Serial.begin(9600);
//  c = 0x15;
//  Serial.println(font_5x7[c][0],BIN);
//  Serial.println(font_5x7[c][1],BIN);
//  Serial.println(font_5x7[c][2],BIN);
//  Serial.println(font_5x7[c][3],BIN);
//  Serial.println(font_5x7[c][4],BIN);

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

  pinMode(A0, INPUT_PULLUP);
  pinMode(A1, INPUT_PULLUP);
}

void loop ()
{
  // insert code here as needed
  int r = analogRead(upButton);
//  Serial.println(r);
  bool reading = false;
  if (r < 100) {
    reading = true;
  }
  
//  Serial.println(reading);
  
  if (reading != lastUpButtonState) {
    lastUpDebounceTime = millis();
  }

  if ((millis() - lastUpDebounceTime) > debounceDelay) {
    if (reading != upButtonState) {
      upButtonState = reading;
      if (upButtonState) {
        c = c + 1;
        if (c > 0x5f) {
          c = 0;
        }
        Serial.println((int)c);
      }
    }
  }

  lastUpButtonState = reading;

  int r2 = analogRead(downButton);
//  Serial.println(r);
  bool reading2 = false;
  if (r2 < 100) {
    reading2 = true;
  }
  
//  Serial.println(reading);
  
  if (reading2 != lastDownButtonState) {
    lastDownDebounceTime = millis();
  }

  if ((millis() - lastDownDebounceTime) > debounceDelay) {
    if (reading2 != downButtonState) {
      downButtonState = reading2;
      if (downButtonState) {
        c = c - 1;
        if (c < 0) {
          c = 0x5f;
        }
        Serial.println((int)c);
      }
    }
  }

  Serial.println((int)c);
  lastDownButtonState = reading2;

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
}

