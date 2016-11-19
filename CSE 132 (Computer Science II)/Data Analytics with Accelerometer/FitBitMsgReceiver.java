/*
* This assignment was to create a version of a FitBit using Arduino and 
* an accelerometer. This Java file receieves data from the Arduino on steps,
* acceleation and sleep, and charts it dynamically using StdDraw.
* steps.ino recieves data from the accelerometer and sends it to Java
*/

package assign8;

import studio4.SerialComm;
import java.io.*;
import java.text.DecimalFormat;

import sedgewick.StdDraw;

public class FitBitMsgReceiver {
	
	double[] zVals = new double[450];
	float zCurrent = 0;
	float accum = 0;
	boolean stepUp = false;
	int steps = 0;
	double temp = 0;
	float sleep = 0;
	int counter = 0;

	final private ViewInputStream vis;
	
	public FitBitMsgReceiver(InputStream in) {
		vis = new ViewInputStream(in);
	}
	
	public void run() {
		// insert code here
		// read from vis and write to console
		
		DataInputStream dis = new DataInputStream(vis);
		for (int x = 0; x < 450; x++) {
			zVals[x] = -2;
		}
		accum = System.nanoTime();
		
		while (true) {
			boolean zChange = false;
			try {
				if (vis.available() > 0) {
					int in = vis.read();
					//check for magic number
					if (in == 36){
						//change between cases
						in = vis.read();

						switch (in) {
						//debug string case
						case (0x41):
//							System.out.print("Debug message: ");
							//retrieves length, loops through all chars and casts them, then prints
							int len = vis.read();
							for (int x = 0; x < len; x++){
								char c = (char)vis.read();
//								System.out.print(c);
							}
//							System.out.println();
							break;
							
						//error string case -- same as debug
						case (0x42):
//							System.out.print("Error message: ");
							int len1 = vis.read();
							for (int x = 0; x < len1; x++){
								char c = (char)vis.read();
//								System.out.print(c);
							}
//							System.out.println();
							break;
						
						//time since last reset
						case (0x46):
//							System.out.print("Time since reset: ");
						//shifting bits back to add together
							long byte1 = (vis.read() << 24);
							long byte2 = (vis.read() << 16);
							long byte3 = (vis.read() << 8);
							long byte4 = vis.read();
							long currentTime = byte1 + byte2 + byte3 + byte4;
//							System.out.println(currentTime);
							break;
						
						//sleep
						case (0x45):
//							System.out.print("Current Sleep Time: ");
							sleep = dis.readFloat();
//							System.out.println(sleep);
							break;
						
						//steps
						case (0x44):
//							System.out.print("Current Steps Since Reset: ");
							int byteOne = (vis.read() << 8);
							int byteTwo = vis.read();
							int stepNew = byteOne + byteTwo;
							if (steps != stepNew) {
								stepUp = true;
							}
							steps = stepNew;
//							System.out.println(steps);
							break;
							
						//raw temp, need to convert
						case (0x43):
//							System.out.print("Current Temperature: ");
							int firstByte = (vis.read() << 8);
							int secondByte = vis.read();
							int rawTemp = firstByte + secondByte;
							double tempVolts = .0010742187 * rawTemp;
							temp = (tempVolts * 100) - 50;
//							System.out.println(String.format("%.2f", temp));
							break;
							
						//read z-accel data
						case (0x47):
							System.out.print("Current z-accel value: ");
							zCurrent = dis.readFloat();
							zChange = true;
							System.out.println(zCurrent);
							
							break;
								
						
						default:
							System.out.println("Error!!!!!");
							break;
						}
					}
				}
				
				if (zChange) {
					zVals[0] = zCurrent;
					for (int x = 449; x > 0; x--) {
						zVals[x] = zVals[x-1];
						System.out.print(zVals[x]);
					}
					System.out.println();
					zChange = false;
					
					StdDraw.enableDoubleBuffering();
					StdDraw.setPenColor(StdDraw.WHITE);
					StdDraw.filledSquare(256, 256, 500);
					StdDraw.setPenRadius(0.005);
			        StdDraw.setPenColor(StdDraw.RED);
			        StdDraw.setYscale(-4, 2.3);
			        StdDraw.setXscale(-90, 450);
			        for (int x = 449; x > 0; x--) {
			        	StdDraw.line(x, zVals[x], x-1, zVals[x-1]);
			        }
			        
			        //axes
			        StdDraw.setPenColor(StdDraw.BLACK);
					StdDraw.line(0, -2, 450, -2);
					StdDraw.line(0, -2, 0, 2.3);
					
					//labels
					for (int r = 0; r < 450; r += 50) {
						StdDraw.text(r, -2.2, Integer.toString(r/10 + (int)(counter*.1)));
					}
					counter ++;
					for (int t = 0; t < 7; t++) {
						double tAd = (((2.3 + 2) / 6) * t) - 2;
						DecimalFormat df = new DecimalFormat("#.##");
						String text = df.format(tAd);
						StdDraw.setPenRadius(.001);
						StdDraw.text((double) -25, tAd, text);
						StdDraw.line((double) 0, tAd, 450, tAd);
					}
					StdDraw.text(-70, ((2.3 + 2) / 2) - 2, "Z-Axis Acceleration (Gs)", 90);
					StdDraw.text(450 / 2, -2.5, "Time Since Reading(secs)");
					
					//label peaks
					if (stepUp) {
						StdDraw.setPenColor(StdDraw.BLUE);
						StdDraw.text(300, 2, "STEP!");
						stepUp = false;
					}
					
					//other data
					StdDraw.setPenColor();
					StdDraw.text(100, -2.8, ("Total Steps: " + Integer.toString(steps)));
					float stepRate = (steps / (System.nanoTime() - accum)); 
					stepRate = stepRate * 36000;
					stepRate = stepRate * 100000000;
					System.out.println(System.nanoTime());
					StdDraw.text(100, -3, ("Step Rate (steps per hours): " + (int)stepRate));
					StdDraw.text(100, -3.2, ("Temperature (degrees C): " + String.format("%.2f", temp)));
					StdDraw.text(100, -3.4, ("Total Sleep (ms): " + sleep));
			        StdDraw.show();
				}
			
		        
		        
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
	}
	/**
	 * @param args
	 */
	public static void main(String[] args) {
        try
        {        	
            SerialComm s = new SerialComm();
            s.connect("/dev/cu.usbserial-DN01JIBB"); // Adjust this to be the right port for your machine
            InputStream in = s.getInputStream();
            FitBitMsgReceiver msgr = new FitBitMsgReceiver(in);
            msgr.run();
        }
        catch ( Exception e )
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

	}

}
