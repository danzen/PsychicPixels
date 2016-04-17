// Modified script below to crop an image into different screen sizes for mobile loading screens
// the sizes match the following XML which can be used in your PhoneGap Build config.xml file
// Dan Zen - http://danzen.com - museum of interactive works
// ZIM JS  - http://zimjs.com - coding the Canvas has never been easier - IKEA of Code

// INSTRUCIONS
// put jsx file in photoshop app presets/scripts/ folder
// it will show up in your photoshop file>scripts menu under MobileScreens
// make a directory that has a splash directory in it
// make portrait and landscape folders in here
// and then create ios, android and winphone folders inside each
// make and save a 2048 square splash screen image
// would suggest a background color and then a central image
// as this gets cropped both horizontally and vertically
// run the script and point to the splash screen file
// then choose the directory you made that has the splash directory in it
// all your screens will be made and put in the directories that match the XML below
// NOTE: keep the .pgomit file (almost empty file) inside the splash directory

// if you are only making portrait - then do not include the landscape folder
// if you are only making landscape - then do not include the portrait folder
// adjust your XML accordingly

// XML for your PhoneGap Build config.xml (early 2016)
/*
	<splash src="splash.png" width="320" height="480" />

	<platform name="ios">
		<splash src="splash/portrait/ios/Default.png" width="320" height="480" />
		<splash src="splash/portrait/ios/Default@2x.png" width="640" height="960" />
		<splash src="splash/portrait/ios/Default-568h@2x.png" width="640" height="1136" />
		<splash src="splash/portrait/ios/Default-667h@2x.png" width="750" height="1334" />
		<splash src="splash/portrait/ios/Default-Portrait-736h@3x.png" width="1242" height="2208" />
		<splash src="splash/portrait/ios/Default-Portrait.png" width="768" height="1024" />
		<splash src="splash/portrait/ios/Default-Portrait@2x.png" width="1536" height="2048" />

		<splash src="splash/landscape/ios/Default-Landscape-736h@3x.png" width="2208" height="1242" />
		<splash src="splash/landscape/ios/Default-Landscape.png" width="1024" height="768" />
		<splash src="splash/landscape/ios/Default-Landscape@2x.png" width="2048" height="1536" />
	</platform>

	<platform name="android">
		<splash src="splash/portrait/android/portrait-ldpi.png" width="200" height="320" qualifier="port-ldpi" />
		<splash src="splash/portrait/android/portrait-mdpi.png" width="320" height="480" qualifier="port-mdpi" />
		<splash src="splash/portrait/android/portrait-hdpi.png" width="480" height="800" qualifier="port-hdpi" />
		<splash src="splash/portrait/android/portrait-xhdpi.png" width="720" height="1280" qualifier="port-xhdpi" />
		<splash src="splash/portrait/android/portrait-xxhdpi.png" width="960" height="1600" qualifier="port-xxhdpi" />
		<splash src="splash/portrait/android/portrait-xxxhdpi.png" width="1280" height="1920" qualifier="port-xxxhdpi" />

		<splash src="splash/landscape/android/landscape-ldpi.png" width="320" height="200" qualifier="port-ldpi" />
		<splash src="splash/landscape/android/landscape-mdpi.png" width="480" height="320" qualifier="port-mdpi" />
		<splash src="splash/landscape/android/landscape-hdpi.png" width="800" height="480" qualifier="port-hdpi" />
		<splash src="splash/landscape/android/landscape-xhdpi.png" width="1280" height="720" qualifier="port-xhdpi" />
		<splash src="splash/landscape/android/landscape-xxhdpi.png" width="1600" height="960" qualifier="port-xxhdpi" />
		<splash src="splash/landscape/android/landscape-xxhdpi.png" width="1920" height="1280" qualifier="port-xxxhdpi" />
	</platform>

	<platform name="winphone">
		<splash src="splash/portrait/winphone/SplashScreenImage.jpg" width="480" height="800" />
    </platform>
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
  // Prompt user to select splash screen file. Clicking "Cancel" returns null.
  var splash = File.openDialog("Select a splash screen PNG file that starts at 2048 pixels wide or high.", "*.png", false);

  if (splash !== null)
  {
    var doc = open(splash, OpenDocumentType.PNG);

    if (doc == null)
    {
      throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }

    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels


    if ((doc.width < 2048) && (doc.height < 2048))
    {
        throw "Image is too small!  Image must be at least 2048 pixels in one dimension.";
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

    var screens = [
	{"name": "splash.png", "width":320, "height":480},
	{"name": "splash/portrait/ios/Default.png", "width":320, "height":480},
	{"name": "splash/portrait/ios/Default@2x.png", "width":640, "height":960},
	{"name": "splash/portrait/ios/Default-568h@2x.png", "width":640, "height":1136},
	{"name": "splash/portrait/ios/Default-667h@2x.png", "width":750, "height":1334},
	{"name": "splash/portrait/ios/Default-Portrait-736h@3x.png", "width":1242, "height":2208},
	{"name": "splash/portrait/ios/Default-Portrait.png", "width":768, "height":1024},
	{"name": "splash/portrait/ios/Default-Portrait@2x.png", "width":1536, "height":2048},
	{"name": "splash/portrait/android/portrait-ldpi.png", "width":200, "height":320},
	{"name": "splash/portrait/android/portrait-mdpi.png", "width":320, "height":480},
	{"name": "splash/portrait/android/portrait-hdpi.png", "width":480, "height":800},
	{"name": "splash/portrait/android/portrait-xhdpi.png", "width":720, "height":1280},
	{"name": "splash/portrait/android/portrait-xxhdpi.png", "width":960, "height":1600},
	{"name": "splash/portrait/android/portrait-xxxhdpi.png", "width":1280, "height":1920},
	{"name": "splash/portrait/winphone/SplashScreenImage.jpg", "width":480, "height":800},
	{"name": "splash/landscape/ios/Default-Landscape-736h@3x.png", "width":2208, "height":1242},
	{"name": "splash/landscape/ios/Default-Landscape.png", "width":1024, "height":768},
	{"name": "splash/landscape/ios/Default-Landscape@2x.png", "width":2048, "height":1536},
	{"name": "splash/landscape/android/landscape-ldpi.png", "width":320, "height":200},
	{"name": "splash/landscape/android/landscape-mdpi.png", "width":480, "height":320},
	{"name": "splash/landscape/android/landscape-hdpi.png", "width":800, "height":480},
	{"name": "splash/landscape/android/landscape-xhdpi.png", "width":1280, "height":720},
	{"name": "splash/landscape/android/landscape-xxhdpi.png", "width":1600, "height":960},
	{"name": "splash/landscape/android/landscape-xxhdpi.png", "width":1920, "height":1280},
    ];

    function cropMe(w,h) {
		var scale;
		if (w/h > doc.width/doc.height) {
			scale = doc.width/w;
		} else {
			scale = doc.height/h;
		}
		var newW = w*scale;
		var newH = h*scale;
		doc.crop([(doc.width-newW)/2,(doc.height-newH)/2,(doc.width-newW)/2+newW,(doc.height-newH)/2+newH], 0, w, h);
    }



    var screen;
    for (i = 0; i < screens.length; i++)
    {
      screen = screens[i];
      if (!screen.name.match(/\.png$/i)) continue;
	  cropMe(screen.width, screen.height);
      var destFileName = screen.name;
      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }


    // WinPhone needs jpg

    // Save icons in JPG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.JPEG;
    sfw.includeProfile = false;
    sfw.interlaced = false;
    sfw.optimized = false;
    sfw.quality = 80;
    doc.info = null;  // delete metadata

    for (i = 0; i < screens.length; i++)
    {
      screen = screens[i];
      if (!screen.name.match(/\.jpe?g$/i)) continue;
      cropMe(screen.width, screen.height);
      var destFileName = screen.name;
      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }

    // create a file called .pgomit in the screens directory so PhoneGap Build does not bundle the screens
    // as it already puts them in the right directory for each build
    // this is normally a text file but it does not matter - it is just the file name that is important
    doc.resizeImage(1, 1, // width, height
			  null, ResampleMethod.BICUBICSHARPER);
    doc.exportDocument(new File(destFolder + "/" + "splash/.pgbomit"), ExportType.SAVEFORWEB, sfw);
    doc.activeHistoryState = startState; // undo resize


    alert("Splash Screens created!");
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
