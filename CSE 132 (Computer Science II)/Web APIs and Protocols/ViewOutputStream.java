package assign10;

import java.io.BufferedOutputStream;
import java.io.FilterOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;

import javax.swing.JFrame;

import studio4.PrintStreamPanel;

public class ViewOutputStream extends FilterOutputStream {
	//
	 final private PrintStreamPanel psp;
	 final private PrintStream ps;
	
	public ViewOutputStream(OutputStream out) {
		// TODO Auto-generated constructor stub
        super(out);
        JFrame f = new JFrame("ViewOutputStream");
		f.setBounds(100,100,225,300);
        psp = new PrintStreamPanel();
		f.getContentPane().add(psp);
		f.setVisible(true);
        ps = psp.getPrintStream(); 
	}

	@Override
	public void write(int i) throws IOException {
	    // Send the Hex values corresponding to i (the parameter) 
	    // to be displayed in the panel and also send it to the parent 
	    // class so it can do its "write"
		super.write(i);
		String hex = Integer.toHexString(i);
    	ps.println(hex);
	}
}
