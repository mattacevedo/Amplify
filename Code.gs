/*********************************************/


// Amplify v1.0
// Matt Acevedo
// mattacevedo@gmail.com

// Amplify is released under the GNU General Public License v2.0.

// UPDATES
// Version 1.0: Lots of big changes. 
//              - Re-worked how selected text is captured and results added to document
//              - Now supports multiple paragraphs (GDocs elements)
//              - Images generated from highlighted text instead of prompt
//              - Intentional document selection of post-processing text           
// Version 0.3: Added Settings menu to allow user control over GPT-3 settings, other efficiencies
// Version 0.2: Introduced image generation with OpenAI DALL-E API.
// Version 0.1: Original version.


/*********************************************/


// define global variables used for settings
var SECRET_KEY; // stores the OpenAI API key
var MAX_TOKENS; // stores the maximum number of tokens
var GPT_MODEL; // stores the text completion model
var TEMPERATURE; // stores the text completion temperature
var IMAGE_RESOLUTION; // stores the max res of generated images
var IMAGE_INSERTION_SIZE; // stores the size percentage of inserted images

//////////////////////////////////////////////////////////////////////
// when the document opens, add the menu items
function onOpen() {

  // get stored user settings from properties service
  updateProperties();

  // call the document interface to add menu items
  var ui = DocumentApp.getUi();

  // add the menu items
  ui.createMenu('Amplify')
    .addItem('Amplify your text', 'amplifyText')
    .addItem('Generate an image', 'generateImage')
    .addSeparator()
    .addItem('Settings', 'showSettingsDialog')
    .addItem('About', 'openAbout')
    .addToUi();
}

//////////////////////////////////////////////////////////////////////
// show the settings popup dialog window
function showSettingsDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Settings')
    .setWidth(800)
    .setHeight(700);
  DocumentApp.getUi()
    .showModalDialog(html, 'Settings');
}

//////////////////////////////////////////////////////////////////////
// opens the About popup when the About menu item is selected
function openAbout() {

  var html = HtmlService.createHtmlOutputFromFile('About')
    .setWidth(500)
    .setHeight(400);
  DocumentApp.getUi()
    .showModalDialog(html, 'About Amplify');

}

//////////////////////////////////////////////////////////////////////
// When the user chooses "Amplify text now", this puts everything into motion.
function amplifyText() {

  // save the highlighted text from the doc
  var highlightedTextResult = getHighlightedText();

  if (highlightedTextResult) { // if there's actually highlighted text returned...

    // shave the leading and trailing whitespace
    highlightedTextResult = highlightedTextResult.trim();

    // send the text selection to GPT3 and get the response
    var responseFromGPT = sendToGPT(highlightedTextResult);

    // send the original + the response back to the document
    if (responseFromGPT) dropInResponse(responseFromGPT);
  } else {
    // if nothing's highlighted, tell the user to highlight something
    var ui = DocumentApp.getUi();
    ui.alert("Please highlight the text you want to amplify and try again.");
  }
}

//////////////////////////////////////////////////////////////////////
// gets the currently highlighted text from the document
function getHighlightedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection)
    return "";
  var selectedElements = selection.getRangeElements();
  var theText = "";

  for (var i = 0; i < selectedElements.length; i++) {
    var thisText = selectedElements[i].getElement().asText().getText();
    if (selectedElements[i].isPartial())
      var thisText = thisText.substring(selectedElements[i].getStartOffset(), selectedElements[i].getEndOffsetInclusive() + 1)
    theText += thisText;
    //I'm assuming each element is separated by one carriage return.
    if (i + 1 < selectedElements.length)
      theText += '\r';
  }

  return theText;
}

//////////////////////////////////////////////////////////////////////
// sends the prompt to GPT-3
function sendToGPT(prompt) {

  // get stored user settings from properties service
  updateProperties();

  if (SECRET_KEY) { // if there's actually an API key saved...
    const url = "https://api.openai.com/v1/completions";
    const payload = {
      model: GPT_MODEL,
      prompt: prompt,
      temperature: Number(TEMPERATURE),
      max_tokens: Number(MAX_TOKENS),
    };
    const options = {
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + SECRET_KEY
      },
      payload: JSON.stringify(payload),
    };
    const res = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
    return res.choices[0].text.trim();
  } else { // if there's no API key saved, prompt the user to add their key
    var ui = DocumentApp.getUi();
    ui.alert("Your OpenAI Key is not set. Please add your key and try again.");
  }
}

//////////////////////////////////////////////////////////////////////
// places the GPT-3 response after the selected area of the doc, then selects that area
function dropInResponse(gptResponse) {

  // store the original highlighted text
  var originalText = getHighlightedText();

  // sometimes the request text includes a space, sometimes it doesn't
  // like "My favorite color is" or "My favorite color is " (latter example has a space)
  // We want a single space there, but we don't to force it and have 2 spaces.
  // This helps us figure out if we need the space.
  if (originalText.charAt(originalText.length - 1) === ' ') {
    var spaceGap = ''; // no space needed if there's a space there
  } else var spaceGap = ' '; // yes space if there's no space
  gptResponse = spaceGap + gptResponse; // add the space (or lack thereof) to the GPT response

  // get the selected text from the document
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var elements = selection.getRangeElements(); // get the range of elements included in the selection
    var element = elements[elements.length - 1]; // reference the last one of those

    if (element.getElement().editAsText) {
      var text = element.getElement().editAsText(); // edit the final element of the selection as text
      var newSelectionStart = text.getText().length // need this index for selecting response later


      // Gets complicated here. Partial element has to be treated differently from a whole element.
      // With partial text, we can insert the GPT response at the end offset. 
      // But a completely-selected element has no end offset (returns -1)
      if (element.isPartial()) { // if the selection containts a partial element
        text.insertText(element.getEndOffsetInclusive() + 1, gptResponse); // drop the GPT response after it

      } else { // if the selected text comprises an entire element...
        text.appendText(gptResponse); // adds the GPT response to the end of the last element

      }

      // now we change the selected text to be just the GPT response using the indices we defined
      // This makes it so the newly dropped in text gets selected/highlighted in the document
      // Which signals to the user what the new text is

      var newSelectionEnd = text.getText().length - 1 // end of the selecting area
      newSelectionRange = DocumentApp.getActiveDocument().newRange(); // initialize a new range
      // adds the start and end index to the range
      newSelectionRange.addElement(element.getElement().asText(), newSelectionStart, newSelectionEnd);
      // makes the new selection in the document
      DocumentApp.getActiveDocument().setSelection(newSelectionRange);

    }
  }
}
//////////////////////////////////////////////////////////////////////
// sends the selected text off to get AI'd and plops the resuling image into the doc
function generateImage() {

  // get the selected text from the document
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {

    // get stored user settings from properties service
    updateProperties();

    // store the original highlighted text, needed for sizing stuff later
    originalImagePrompt = getHighlightedText();

    // trim the whitespace
    imagePrompt = originalImagePrompt.trim();

    // send that text to get turned into an image 
    var imageUrl = getAIImage(imagePrompt);

    // if we got an image back, let's drop it in the document after the selected text
    if (imageUrl) {

      var elements = selection.getRangeElements(); // get the range of elements included in the selection
      var element = elements[elements.length - 1]; // reference the last one of those

      if (element.getElement().editAsText) {
        var text = element.getElement().editAsText(); // edit the final element of the selection as text

        // Gets complicated here. Partial element has to be treated differently from a whole element.
        // With partial text, we can insert the image at the end offset. 
        // But a completely-selected element has no end offset (returns -1)
        if (element.isPartial()) { // if the selection containts a partial element

          // generate a new position for where the new image should go
          var imagePosition = DocumentApp.getActiveDocument()
            .newPosition(element.getElement(), element.getEndOffsetInclusive() + 1);

          // need this index for selecting original text later
          var newSelectionStart = element.getStartOffset()

        } else { // if the selected text comprises an entire element...

          // generate a new position for where the new image should go
          var imagePosition = DocumentApp.getActiveDocument()
            .newPosition(element.getElement().asText(),
              element.getElement().asText().getText().length);

          // need this index for selecting original text later (offset of entire element is 0)
          var newSelectionStart = 0;

        }

        // creates a blob out of the image stored at the URL
        var blob = UrlFetchApp.fetch(imageUrl).getBlob();

        // put the image after the text
        var insertedImage = imagePosition.insertInlineImage(blob);

        // adjust the image size per user settings
        insertedImage.setHeight(insertedImage.getHeight() * IMAGE_INSERTION_SIZE);
        insertedImage.setWidth(insertedImage.getWidth() * IMAGE_INSERTION_SIZE);

        // add alt text to the image from the original prompt
        insertedImage.setAltDescription(imagePrompt);

        // now we ensure that the selected text gets re-selected, 
        // which helps to generate another image if the user wants

        newSelectionRange = DocumentApp.getActiveDocument().newRange(); // initialize a new range

        // define that new range as the originally selected text 
        newSelectionRange.addElement(element.getElement()
          .asText(), newSelectionStart, newSelectionStart + originalImagePrompt.length - 1);

        // makes the new selection in the document
        DocumentApp.getActiveDocument().setSelection(newSelectionRange);

      }
    }

  } else {

    // if nothing's highlighted, tell the user to highlight something
    var ui = DocumentApp.getUi();
    ui.alert("Please select some text to form the basis of your image.");

  }
}

//////////////////////////////////////////////////////////////////////
// accepts prompt from the generateImage(), sends to OpenAI, returns response URL
function getAIImage(prompt) {

  // get stored user settings from properties service
  updateProperties();

  if (SECRET_KEY) { // if there's actually an API key saved...

    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('savedImagePrompt', prompt); // save the prompt to prop svc

    // get ready to send this bad boy to OpenAI
    const url = "https://api.openai.com/v1/images/generations";

    const payload = {
      prompt: prompt,
      n: 1,
      size: IMAGE_RESOLUTION,
    };
    const options = {
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + SECRET_KEY
      },
      payload: JSON.stringify(payload),
    };

    const res = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
    var imageURL = res.data[0].url.trim(); // extracts the image URL from the response

    return imageURL; // returns the URL to get inserted
  } else { // if there's no API key saved, prompt the user to add their key
    ui.alert("Your OpenAI Key is not set. Please add your key and try again.");
  }
}

//////////////////////////////////////////////////////////////////////
// returns the saved script settings (API key, etc.) as an object, used for settings dialog
function getAmplifySettings() {

  updateProperties();

  return {
    apiKey: SECRET_KEY, // SECRET_KEY,
    maxTokens: MAX_TOKENS,
    gptModel: GPT_MODEL,
    gptTemperature: TEMPERATURE,
    imageResolution: IMAGE_RESOLUTION,
    imageInsertionSize: IMAGE_INSERTION_SIZE
  }
}

//////////////////////////////////////////////////////////////////////
// grabs the settings from the settings pop-up and saves to the properties service
function getSettings(settingsObject) {

  // gets the user properties from properties service
  const userProperties = PropertiesService.getUserProperties();

  userProperties.setProperty('apiKey', settingsObject.apiKey);
  userProperties.setProperty('maxTokens', settingsObject.maxTokens);
  userProperties.setProperty('gptTemperature', settingsObject.gptTemperature);
  userProperties.setProperty('gptModel', settingsObject.gptModel);
  userProperties.setProperty('imageResolution', settingsObject.imageResolution);
  userProperties.setProperty('imageInsertionSize', settingsObject.imageInsertionSize);

  // update the global settings variables with the newly updated user properties
  updateProperties();
}

//////////////////////////////////////////////////////////////////////
// updates the global variables used for GPT-3 settings with the properties service
function updateProperties() {

  // get stored user settings from properties service
  const userProperties = PropertiesService.getUserProperties();
  SECRET_KEY = userProperties.getProperty('apiKey');
  MAX_TOKENS = userProperties.getProperty('maxTokens');
  GPT_MODEL = userProperties.getProperty('gptModel');
  TEMPERATURE = userProperties.getProperty('gptTemperature');
  IMAGE_RESOLUTION = userProperties.getProperty('imageResolution');
  IMAGE_INSERTION_SIZE = userProperties.getProperty('imageInsertionSize');
}

