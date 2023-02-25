# Amplify
Amplify is an add-on for Google Docs that uses OpenAI's GPT-3 language model to amplify your document text and OpenAI's image generation technology create images out of your document text. Harness the power of generative AI without leaving your Google Doc!
## How to Install
1. Open a new Google Document.
2. In the menu select Extensions → Apps Script. This opens an environment in a new tab where you can add code that changes how your Google Doc works.
3. Delete the default code in the Apps Script editor. It looks like this:
```
function myFunction() {
     }
```
4. Paste all of the code in its entirety from [Code.gs](Code.gs) into the Apps Script editor.
5. In the Files panel, there's a [+] button to create new files. Click it, choose HTML, and change the name to "Settings" (omit the quotation marks, but keep the capital S). The ".html" extension will be added for you.
6. Copy all of the code in its entirety from [Settings.html](Settings.html) into the code editor.
7. Create another HTML file in the same way called "About" (omit quotes, keep the capital A).
8. Copy all of the code in its entirety from [About.html](About.html) into the code editor.
9. If you’d like, name the Google Apps Script project by changing the name from “Untitled Project” to something of your liking (e.g., Amplify). This is optional but a good idea.
10. Click the Save Project button (looks like a floppy disk).
11. Go back to the tab with the new document. Refresh the page.
12. You should see the new menu "Amplify" in the menu bar. Great! You're almost there.
13. The first time you select a menu item, Google will ask you to authorize. Agree to all the things, even if Google says you shouldn't. What do they know, anyway?
14. Once you've authorized everything, Amplify will work! Remember that you'll need your own [OpenAI API Key](https://platform.openai.com/account/api-keys) to get started.
15. If you want to use Amplify in another document, you can copy this document and the script will carry over. That's easier than re-copying all this stuff every time you want to use Amplify, so consider keeping this blank document as a template.

## How to Use

1. First, enter your OpenAI API key in Settings (Amplify → Settings).
2. To amplify your text, select a segment of text from your document and click Amplify → Amplify your text. This will send your selected text to GPT-3 as a prompt and append the result to the text. The newly added text becomes selected (highlighted) to help you see the results.
3. You can change the GPT model, temperature, and maximum token size in Settings. If you're not familiar with those, just keep the defaults.
4. To generate an image, select a segment of text and click Amplify → Generate an image. After a few seconds, you'll get a AI-generated image dropped in next to your text. Your original text stays selected in case you want to run it again and get another version.
5. You can change the resolution of generated images in settings, as well as the insertion size. Generated images will be inserted into the document at this size, although you can still adjust the size afterwards. For reference, a 1024x1024 image at 100% will be wider than a standard page and kind of unwieldy; a 256x256 at 10% will be really, really tiny.

## Example Uses

### Sentence/Paragraph Completion

**Original text:** My favorite episode of Captain Planet is the one where he

**Amplified text:** My favorite episode of Captain Planet is the one where he has to face the evil Dr. Blight. In this episode, Captain Planet and the Planeteers are tasked with saving an entire city from the evil Dr. Blight and her plant-controlling schemes. Captain Planet is forced to use all his powers to battle the doctor and her minions, while the Planeteers work to free the city and its citizens. The episode is full of action and suspense, and it shows the power of teamwork and the importance of protecting the environment.

**Original text:** I would never eat at Olive Garden because

**Amplified text:** I would never eat at Olive Garden because I do not believe in their food quality. Their food is often processed and not fresh, and I prefer to eat food that is made with fresh ingredients.

**Original text:** The funniest way to quit a job must be to

**Amplified text:** The funniest way to quit a job must be to give a humorous speech to everyone in the office. You could make jokes about the job, your coworkers, the company, or anything else that you feel comfortable sharing. You could also include some funny anecdotes or stories from your time at the job to make everyone laugh. Once you've finished your speech, you could end with a humorous farewell and thank everyone for their support.

### Writing Help

**Original text:** Synonyms for happy:

**Amplified text:** Synonyms for happy: Elated, ecstatic, content, overjoyed, joyous, jubilant, delighted, blissful, cheery, gleeful, pleased.

**Original text:** Correct grammar for “My friend and I’s new hobby”: 

**Amplified text:** Correct grammar for “My friend and I’s new hobby”: My friend's and my new hobby.

### Translation

**Original text:**“Where is the library?” in Spanish:

**Amplified text:** “Where is the library?” in Spanish: ¿Dónde está la biblioteca?

**Original text:**“Where is the library?” in Japanese:

**Amplified text:** “Where is the library?” in Japanese: 図書館はどこですか？

### List Generation

*Add line breaks after your list-related prompts to start them on a new line*

**Original text:** The following is a list of foods that dogs should not eat:

**Amplified text:** The following is a list of foods that dogs should not eat:
1. Chocolate
2. Xylitol (sugar-free products)
3. Grapes and raisins
4. Onions and garlic
5. Avocados
6. Macadamia nuts
7. Alcohol
8. Caffeine
9. Salt
10. Raw eggs, meat, or fish

**Original text:** Top reasons to get a college education: 

**Amplified text:** Top reasons to get a college education: 

1. Increased earning potential – Statistics show that college graduates typically earn more than their counterparts without a degree.
2. Job security – A degree increases an individual’s chances of finding and keeping a job.
3. Employment opportunities – Many employers prefer college graduates when considering job applicants.
4. Professional and personal networks – College can be a great way to meet people and build relationships that can be beneficial both professionally and personally.
5. Personal growth and development – College can help an individual to learn, grow and develop into a more capable and well-rounded individual.
6. Broaden your knowledge – College provides an opportunity to learn about different cultures, perspectives, and disciplines.
7. Improved communication – College can help an individual to develop better communication skills, both written and verbal.
8. Personal fulfillment – Achieving a college degree is a great accomplishment and can bring a great sense of pride and satisfaction.

### Inmage Generation

**Original text:** Photograph of a lion

**Image:**

![lion](https://user-images.githubusercontent.com/124928006/221338837-4b800f9a-3c45-4f7e-b573-f387a33a1252.png)

**Original text:** Abstract wavy lines with bold colors

**Image:**

![wavylines](https://user-images.githubusercontent.com/124928006/221338916-e641677d-b5ea-42ae-8eb4-ad5ff289c6f6.png)

**Original text:** Crayon drawing of a mad scientist riding a bicycle

**Image:**

![madscientist](https://user-images.githubusercontent.com/124928006/221338998-32c5cc17-340d-427f-b341-b4b08a118575.png)

*Tip: You can save a generated image by right clicking on it and choosing View more actions → Save to Keep. You can then save it from the Keep sidebar.*
