/*
* This program gets data from the Dark Skies API on one of three different locations
* depending on the position of a potentiometer, then sends it to the Arduino.
* WeatherStation.ino processes data from Java and displays it on a multiplexed LED board.
*/

package assign10;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.*;

import assign4.MsgReceiver;
import assign4.ViewInputStream;
import assignment5.morse.ViewOutputStream;
import studio4.SerialComm;

public class WeatherStation {
	
	private static ViewOutputStream vos;
	private static long accum = 0;
	private String link = "https://api.darksky.net/forecast/a2633fe15d8e1f3e0b4f764153a6d08b/39.997027,-83.067248?exclude=[minutely,hourly,daily,alerts,flags]";
	private static ViewInputStream vis;
	//0 = Lopata, 1 = Columbus, 2 = Kotor
	private int location = 0;
	private static SerialComm s = null;
	
    public static void main(String[] args) throws Exception {
        // Create a new instance of Weather Station
    	WeatherStation ws = new WeatherStation();
    	InputStream in = null;
    	try
        {        	
            s = new SerialComm();
            s.connect("/dev/cu.usbserial-DN01JIBB"); // Adjust this to be the right port for your machine
            in = s.getInputStream();
            MsgReceiver msgr = new MsgReceiver(in);
        }
        catch ( Exception e )
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    	
    	vis = new ViewInputStream(in);
    	accum = System.currentTimeMillis();

        // Based on the name of the instance created above, call xx.sendGet().
        // This will test to the function we'll be creating below.
    	ws.sendGet();


    }

    // HTTP GET request
    private void sendGet() throws Exception {
        // Create a string that contains the URL you created for Lopata Hall in Studio 10
        // Use the URL that DOES NOT have the timestamp included.
        // Since we only need the current data (currently) you can use the API to exclude all of the excess blocks (REQUIRED).
        // Instructions to do that are here: https://darksky.net/dev/docs/forecast
        // Test this new URL by pasting it in your web browser. You should only see the information about the current weather.
    			

        // Create a new URL object with the URL string you defined above. Reference: https://docs.oracle.com/javase/7/docs/api/java/net/URL.html
    	URL url = new URL(link);


        // Follow the instructions in the URL API to open this connection.
        // Cast this to a HttpURLConnection and save it in a new HttpURLConnection object.
    	HttpURLConnection con = (HttpURLConnection) url.openConnection();


        // Use the HttpURLConnection API to setup the HttpURLConnection you defined above.
        // Reference: https://docs.oracle.com/javase/7/docs/api/java/net/HttpURLConnection.html
        // Set the request method.
    	con.setRequestMethod("GET");
    	


        // Set the request property "User-Agent" to the User-Agent you saw in Wireshark when you did the first exercise in studio.
        // Repeat the quick wireshark example if you've forgotten. It should be in the form "xxxxxxx/#.#"
    	con.setRequestProperty("User-Agent", "Mozilla/5.0");


        // To debug, get and print out the response code.
    	System.out.println(con.getResponseCode());


        // The rest of the code should be much more familiar.
        // Create an InputStream that gets the input stream from our HttpURLConnection object.
    	InputStream in = con.getInputStream();


        // Wrap it in a DataInputStream
    	DataInputStream dis = new DataInputStream(in);


        // Read a line and save it in a string
    	String line = dis.readLine();
    	
    	// Close the InputStream
    	in.close();


        // Using string manipulation tools, pull out the string between quotes after "icon:"
        // For example: "summary":"Clear","icon":"clear-day","nearestStormDistance":27
        // You should pull out JUST "clear-day"
    	JSONObject obj = new JSONObject(line);
    	JSONObject res = obj.getJSONObject("currently");
    	String iconVal = res.getString("icon");
    	System.out.println(iconVal);


        // You will set this char (in a switch statement) to one of the 5 types of weather. (Nothing TODO here)
        char weatherChar = '\0';
        char C = 0x43;
        char F = 0x46;
        char W = 0x57;
        char S = 0x53;
        char P = 0x50;

        // Create a switch statement based on the string that contains the description (ex. clear-day)
        // The switch statement should be able to handle all 10 of the icon values from the API: https://darksky.net/dev/docs/response
        // If the value is any of the cloudy ones, set weatherChar to C
        // If the value is fog, set it to F
        // If the value if wind, set it to W
        // If the value is any of the clear ones, set it to S
        // If the value is any type of precipitation, set it to P
        switch (iconVal) {
        	case "clear-day":
        		weatherChar = S;
        		break;
        	case "clear-night":
        		weatherChar = S;
        		break;
        	case "rain":
        		weatherChar = P;
        		break;
        	case "snow":
        		weatherChar = P;
        		break;
        	case "sleet":
        		weatherChar = P;
        		break;
        	case "wind":
        		weatherChar = W;
        		break;
        	case "fog":
        		weatherChar = F;
        		break;
        	case "cloudy":
        		weatherChar = C;
        		break;
        	case "partly-cloudy-day":
        		weatherChar = C;
        		break;
        	case "partly-cloudy-night":
        		weatherChar = C;
        		break;
        	default:
        		weatherChar = 0x58;
        		break;
        }
        // Now you're ready to implement this into your past code to send it to the Arduino.
        // You also have to make a couple modifications to handle the switch location requests from Arduino.
        // Choose three locations or more, but make sure one is Lopata Hall.
    	//still need to do magic number
    	vos = new ViewOutputStream(s.getOutputStream());
    	System.out.println("weatherChar : " + weatherChar);
		try {
			vos.write(0x24);
			vos.write(weatherChar);
			vos.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		accum = System.currentTimeMillis();
		while (System.currentTimeMillis() - accum < 60000) {
			//System.out.println("loop");
    		int oldLocation;
	    	if (vis.available() > 0) {
	    		int isMagic = vis.read();
	    		//System.out.println("magic: " + isMagic);abc
	    		if (isMagic == 0x24) {
	    			oldLocation = location;
	    			location = vis.read();
	    			//System.out.println("location: " + location);
	    	    	
	    	    	if (oldLocation != 0 && location == 0) {
	    	    		link = "https://api.darksky.net/forecast/a2633fe15d8e1f3e0b4f764153a6d08b/38.649196,-90.306099?exclude=[minutely,hourly,daily,alerts,flags]";
	    	    		accum = -60000;
	    	    	}
	    	    	else if (oldLocation != 1 && location == 1) {
	    	    		link = "https://api.darksky.net/forecast/a2633fe15d8e1f3e0b4f764153a6d08b/39.997027,-83.067248?exclude=[minutely,hourly,daily,alerts,flags]";
	    	    		accum = -60000;
	    	    	}
	    	    	else if (oldLocation != 2 && location == 2){
	    	    		link = "https://api.darksky.net/forecast/a2633fe15d8e1f3e0b4f764153a6d08b/42.424662,-18.771234?exclude=[minutely,hourly,daily,alerts,flags]";
	    	    		accum = -60000;
	    	    	}
	    		}
	    	}
		}
		sendGet();
    }
}