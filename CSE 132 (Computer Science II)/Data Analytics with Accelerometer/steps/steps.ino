#include <Wire.h> // Must include Wire library for I2C
#include <SparkFun_MMA8452Q.h> // Includes the SFE_MMA8452Q library

MMA8452Q accel;
float prevX1 = 0;
float prevX2 = 0;
float prevY1 = 0;
float prevY2 = 0;
float prevZ1 = 1;
float prevZ2 = 1;

float rollingAverage;
const int VALS = 60;
float moveVals[VALS];
int sleepSamples = 0;

unsigned long accum = 0;
bool wait = true;

float zMean = 0;
float dataPoints = 0;

int steps = 0;

const int buttonModePin = 11;
const int buttonStepPin = 12;
const int ledPin = 13;
const int tempPin = A1;

const int INTERVAL = 250;
float tempRollingAverage;
const int FILTER_COUNTS = 8;
float temperatures[FILTER_COUNTS];
int count = 0;

unsigned long protocolAccumulator = 0;

float sleepTime = 0;
unsigned long sleepCount = 0;

const int MAGIC = 0x24;
const int DEBUG_KEY = 0x41;
const int ERROR_KEY = 0x42;
const int TEMP_KEY = 0x43;
const int STEPS_KEY = 0x44;
const int SLEEP_KEY = 0x45;
const int RUN_KEY = 0x46;
const int Z_KEY = 0x47;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  accel.init();
  pinMode(buttonModePin, INPUT_PULLUP);
  pinMode(buttonStepPin, INPUT_PULLUP);
  pinMode(tempPin, INPUT);
  pinMode(ledPin, OUTPUT);
  for (int x = 0; x < 60; x++) {
    moveVals[x] = .05;
  }
  analogReference(INTERNAL);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(ledPin, HIGH);
  countSteps();
}

void countSteps() {
  //read data
  if (accel.available()) {
    accel.read();
  }
  
  //check wait
  if (millis() - accum > 300) {
    wait = true;
  }
  
  //update zMean
  float sum = zMean * dataPoints;
  dataPoints += 1;
  sum += accel.cz;
  zMean = sum / dataPoints;

  //detect peak
  if (prevZ1 > prevZ2 && prevZ1 > accel.cz) {
    if (prevZ1 > zMean + .5) {
      if (wait) {
        steps += 1;
        accum = millis();
        wait = false;
      }
    }
  }

  //update prevs
  prevZ2 = prevZ1;
  prevZ1 = accel.cz;
  prevX2 = prevX1;
  prevX1 = accel.cx; 
  prevY2 = prevY1;
  prevY1 = accel.cy;

  if (!digitalRead(buttonStepPin)) {
    steps = 0;
  }

  protocol();

  if (!digitalRead(buttonModePin)) {
    digitalWrite(ledPin, LOW);
    delay(300);
    trackSleep();
  }
  else {
    countSteps();
  }
}

void trackSleep() {
  //read data
  sleepCount = millis();
  if (accel.available()) {
    accel.read();
  }

  //get all movement in one number
  moveVals[sleepSamples % VALS] = abs(accel.cx - prevX1);
  moveVals[(sleepSamples % VALS) + 1] = abs(accel.cy - prevY1);
  moveVals[(sleepSamples % VALS) + 2] = abs(accel.cz - prevZ1);
  sleepSamples += 3;

  rollingAverage = 0;
  for (int x = 0; x < VALS; x++) {
    rollingAverage += moveVals[x];
  }
  rollingAverage = rollingAverage / VALS;
  
  //if rollingAverage is low enough, update sleep count
  if (rollingAverage < .01) {
    sleepTime += millis() - sleepCount;
  }

  prevX1 = accel.cx;
  prevY1 = accel.cy;
  prevZ1 = accel.cz;

  if (!digitalRead(buttonStepPin)) {
    steps = 0;
  }
  
  protocol();

  if (!digitalRead(buttonModePin)) {
    digitalWrite(ledPin, HIGH);
    delay(300);
    countSteps();
  }
  else {
    trackSleep();
  }
}

//void updateTemp() {
//  if (millis() - tempAccumulator > INTERVAL) {
//    tempAccumulator += INTERVAL;
//    float tmpAD = analogRead(tempPin);
//    float tmpVolts = (.0010742187 * tmpAD);
//    float temp = (tmpVolts * 100) - 50;
//    temperatures[count % FILTER_COUNTS] = temp;
//    count += 1;
//    tempRollingAverage = 0;
//    for (int x = 0; x < FILTER_COUNTS; x++) {
//      tempRollingAverage += temperatures[x];
//    }
//    tempRollingAverage = tempRollingAverage / FILTER_COUNTS;
//    Serial.print("TEMP: ");
//    Serial.println(tempRollingAverage);
//  }
//}

void protocol() {
  if ((millis() - protocolAccumulator) > 100) {
    sendDebugString("abcd");
    sendErrorString("efgh");
    sendTemp();
    sendSteps();
    sendSleepTime();
    sendTimeRunning();
    sendZ();
    protocolAccumulator = millis();
  }
}

void sendDebugString(const char* message) {
  Serial.write(MAGIC);
  Serial.write(DEBUG_KEY);
  Serial.write(strlen(message));
  Serial.write(message);
}

void sendErrorString(const char* message) {
  Serial.write(MAGIC);
  Serial.write(ERROR_KEY);
  Serial.write(strlen(message));
  Serial.write(message);
}

void sendTimeRunning() {
    unsigned long timeElapsed = millis();
    Serial.write(MAGIC);
    Serial.write(RUN_KEY);
    unsigned long byte1 = timeElapsed >> 24;
    Serial.write(byte1);
    unsigned long byte2 = timeElapsed >> 16;
    Serial.write(byte2);
    unsigned long byte3 = timeElapsed >> 8;
    Serial.write(byte3);
    Serial.write(timeElapsed);
}


void sendTemp() {
  Serial.write(MAGIC);
  Serial.write(TEMP_KEY);
  int tmpAD = analogRead(tempPin);
  int byte1 = tmpAD >> 8;
  Serial.write(byte1);
  Serial.write(tmpAD);
}

void sendSteps() {
  Serial.write(MAGIC);
  Serial.write(STEPS_KEY);
  int byte1 = steps >> 8;
  Serial.write(byte1);
  Serial.write(steps);
}

void sendSleepTime() {
  Serial.write(MAGIC);
  Serial.write(SLEEP_KEY);
  unsigned long rawBits; 
  rawBits = *(unsigned long *) &sleepTime;
  unsigned long byte1 = rawBits >> 24;
  Serial.write(byte1);
  unsigned long byte2 = rawBits >> 16;
  Serial.write(byte2);
  unsigned long byte3 = rawBits >> 8;
  Serial.write(byte3);
  Serial.write(rawBits);
}

void sendZ() {
  Serial.write(MAGIC);
  Serial.write(Z_KEY);
  unsigned long rawBits; 
  rawBits = *(unsigned long *) &prevZ1;
  unsigned long byte1 = rawBits >> 24;
  Serial.write(byte1);
  unsigned long byte2 = rawBits >> 16;
  Serial.write(byte2);
  unsigned long byte3 = rawBits >> 8;
  Serial.write(byte3);
  Serial.write(rawBits);
}

void printCalculatedAccels() {
  Serial.print(accel.cx, 3);
  Serial.print(",");
  Serial.print(accel.cy, 3);
  Serial.print(",");
  Serial.print(accel.cz, 3);
  Serial.println(",");
  Serial.println(millis());
}

void tempTest() {
  int tmpAD = analogRead(tempPin);
  Serial.print("AD: ");
  Serial.println(tmpAD);
  float tmpVolts = (.0010742187 * tmpAD);
  Serial.print("Volts: ");
  Serial.println(tmpVolts);
  float temp = (tmpVolts * 100) - 50;
  Serial.println(temp);
  delay(500);
}

