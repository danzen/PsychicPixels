// Modified script below for making icons to PhoneGap Build specifications 2016
// the sizes match the following XML which can be used in your config.xml file
// Dan Zen - http://danzen.com - museum of interactive works
// ZIM JS  - http://zimjs.com - coding the Canvas has never been easier - IKEA of Code

// INSTRUCIONS
// put jsx file in photoshop app presets/scripts/ folder
// it will show up in your photoshop file>scripts menu under MobileIcons
// make a directory that has an icon directory in it 
// and then create ios, android, blackberry and winphone folders inside the icon folder
// make and save a 1024 square icon and point to it when you run the script
// then choose the directory you made that has the icon directory in it
// all your icons will be made and put in the directories that match the XML below
// NOTE: keep the .pgomit file (almost empty file) inside the icon directory

// XML for your PhoneGap Build config.xml (early 2016)
/*
	<icon src="icon.png" width="57" height="57" />
	
	<platform name="ios">
	
		<!-- iOS 7+ -->
		
		<!-- iPhone 6 / 6+ -->
    		<icon src="icon/ios/icon-60@3x.png" width="180" height="180" />

		<!-- iPhone / iPod Touch  -->
		<icon src="icon/ios/icon-60.png" width="60" height="60" />
		<icon src="icon/ios/icon-60@2x.png" width="120" height="120" />
		
		<!-- iPad -->
		<icon src="icon/ios/icon-76.png" width="76" height="76" />
		<icon src="icon/ios/icon-76@2x.png" width="152" height="152" />
		
		<!-- Settings Icon -->
		<icon src="icon/ios/icon-small.png" width="29" height="29" />
		<icon src="icon/ios/icon-small@2x.png" width="58" height="58" />
		
		<!-- Spotlight Icon -->
		<icon src="icon/ios/icon-40.png" width="40" height="40" />
		<icon src="icon/ios/icon-40@2x.png" width="80" height="80" />
		
		<!-- iOS 6.1 -->
		
		<!-- iPhone / iPod Touch -->		
		<icon src="icon/ios/icon.png"  width="57" height="57" />
		<icon src="icon/ios/icon@2x.png"  width="114" height="114" />
		
		<!-- iPad -->
		<icon src="icon/ios/icon-72.png"  width="72" height="72" />
		<icon src="icon/ios/icon-72@2x.png"  width="144" height="144" />
		
		<!-- iPhone Spotlight and Settings Icon -->
		<icon src="icon/ios/icon-small.png"  width="29" height="29" />
		<icon src="icon/ios/icon-small@2x.png"  width="58" height="58" />
		
		<!-- iPad Spotlight and Settings Icon -->
		<icon src="icon/ios/icon-50.png"  width="50" height="50" />
		<icon src="icon/ios/icon-50@2x.png"  width="100" height="100" />

	</platform>
	
	<platform name="android">
		<icon src="icon/android/ldpi.png" width="36" height="36" qualifier="ldpi" />
		<icon src="icon/android/mdpi.png" width="48" height="48" qualifier="mdpi" />
		<icon src="icon/android/hdpi.png" width="72" height="72" qualifier="hdpi" />
		<icon src="icon/android/xhdpi.png" width="96" height="96" qualifier="xhdpi" />
		<icon src="icon/android/xxhdpi.png" width="144" height="144" qualifier="xxhdpi" />
		<icon src="icon/android/xxxhdpi.png" width="192" height="192" qualifier="xxxhdpi" />
	</platform>
	
	<platform name="winphone">
		<icon src="icon/winphone/icon.png" width="48" height="48" />
		<icon src="icon/winphone/tileicon.png" width="173" height="173" role="background" />
	</platform>
   
   	<platform name="blackberry"><!-- probably not supported at this time in Build -->
    		<icon src="icon/blackberry/icon-80.png" width="80" height="80" />
	</platform>


// original creator message:

*/

// Photoshop Script to Create iPhone Icons from iTunesArtwork
//
// WARNING!!! In the rare case that there are name collisions, this script will
// overwrite (delete perminently) files in the same folder in which the selected
// iTunesArtwork file is located. Therefore, to be safe, before running the
// script, it's best to make sure the selected iTuensArtwork file is the only
// file in its containing folder.
//
// Copyright (c) 2010 Matt Di Pasquale
// Added tweaks Copyright (c) 2012 by Josh Jones http://www.appsbynight.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Prerequisite:
// First, create at least a 1024x1024 px PNG file according to:
// http://developer.apple.com/library/ios/#documentation/iphone/conceptual/iphoneosprogrammingguide/BuildTimeConfiguration/BuildTimeConfiguration.html
//
// Install - Save Create Icons.jsx to:
//   Win: C:\Program Files\Adobe\Adobe Utilities\ExtendScript Toolkit CS5\SDK
//   Mac: /Applications/Utilities/Adobe Utilities/ExtendScript Toolkit CS5/SDK
// * Restart Photoshop
//
// Update:
// * Just modify & save, no need to resart Photoshop once it's installed.
//
// Run:
// * With Photoshop open, select File > Scripts > Create Icons
// * When prompted select the prepared iTunesArtwork file for your app.
// * The different version of the icons will get saved to the same folder that
//   the iTunesArtwork file is in.
//
// Adobe Photoshop JavaScript Reference
// http://www.adobe.com/devnet/photoshop/scripting.html


// Turn debugger on. 0 is off.
// $.level = 1;

try
{
  // Prompt user to select iTunesArtwork file. Clicking "Cancel" returns null.
  var iTunesArtwork = File.openDialog("Select a sqaure PNG file that is at least 1024x1024.", "*.png", false);

  if (iTunesArtwork !== null) 
  { 
    var doc = open(iTunesArtwork, OpenDocumentType.PNG);
    
    if (doc == null)
    {
      throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }

    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels

    if (doc.width != doc.height)
    {
        throw "Image is not square";
    }
    else if ((doc.width < 1024) && (doc.height < 1024))
    {
        throw "Image is too small!  Image must be at least 1024x1024 pixels.";
    }
    else if (doc.width < 1024)
    {
        throw "Image width is too small!  Image width must be at least 1024 pixels.";
    }
    else if (doc.height < 1024)
    {
        throw "Image height is too small!  Image height must be at least 1024 pixels.";
    }
    
    // Folder selection dialog
    var destFolder = Folder.selectDialog( "Choose an output folder");

    if (destFolder == null)
    {
      // User canceled, just exit
      throw "";
    }

    // Save icons in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // use PNG-24
    sfw.transparency = true;
    doc.info = null;  // delete metadata
    
    // Dan Zen adjust
    // PhoneGap Build Recommendations
    // you need to make icons/ios, icons/android, icons/winphone, icons/blackberry folders to start
    var icons = [     
    	{"name": "icon", "size":57},
	{"name": "icon/ios/icon-60@3x", "size":180},
	{"name": "icon/ios/icon-60", "size":60},
	{"name": "icon/ios/icon-60@2x", "size":120},
	{"name": "icon/ios/icon-76", "size":76},
	{"name": "icon/ios/icon-76@2x", "size":152},
	{"name": "icon/ios/icon-small", "size":29},
	{"name": "icon/ios/icon-small@2x", "size":58},
	{"name": "icon/ios/icon-40", "size":40},
	{"name": "icon/ios/icon-40@2x", "size":80},
	{"name": "icon/ios/icon", "size":57},
	{"name": "icon/ios/icon@2x", "size":114},
	{"name": "icon/ios/icon-72", "size":72},
	{"name": "icon/ios/icon-72@2x", "size":144},
	{"name": "icon/ios/icon-small", "size":29},
	{"name": "icon/ios/icon-small@2x", "size":58},
	{"name": "icon/ios/icon-50", "size":50},
	{"name": "icon/ios/icon-50@2x", "size":100},
	{"name": "icon/android/ldpi", "size":36},
	{"name": "icon/android/mdpi", "size":48},
	{"name": "icon/android/hdpi", "size":72},
	{"name": "icon/android/xhdpi", "size":96},
	{"name": "icon/android/xxhdpi", "size":144},
	{"name": "icon/android/xxxhdpi", "size":192},
	{"name": "icon/winphone/icon", "size":48},
	{"name": "icon/winphone/tileicon", "size":173},
	{"name": "icon/blackberry/icon-80", "size":80}
    ];
    
    var icon;
    for (i = 0; i < icons.length; i++) 
    {
      icon = icons[i];
      doc.resizeImage(icon.size, icon.size, // width, height
                      null, ResampleMethod.BICUBICSHARPER);
      var destFileName = icon.name + ".png";
      if ((icon.name == "iTunesArtwork@2x") || (icon.name == "iTunesArtwork"))
      {
        // iTunesArtwork files don't have an extension
        destFileName = icon.name;
      }
      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }
    
    // create a file called .pgomit in the icons directory so PhoneGap Build does not bundle the icons
    // as it already puts them in the right directory for each build
    // this is normally a text file but it does not matter - it is just the file name that is important
    doc.resizeImage(1, 1, // width, height
                      null, ResampleMethod.BICUBICSHARPER);
    doc.exportDocument(new File(destFolder + "/" + "icon/.pgbomit"), ExportType.SAVEFORWEB, sfw); 
    doc.activeHistoryState = startState; // undo resize

    alert("Mobile Icons created!");
  }
}
catch (exception)
{
  // Show degbug message and then quit
	if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally
{
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES);
  
    app.preferences.rulerUnits = initialPrefs; // restore prefs
}