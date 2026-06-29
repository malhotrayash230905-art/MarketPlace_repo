const { generateDescription, verifyItemImage } = require('./utils/gemini');

async function testImage() {
  try {
    const dummyTitle = "bottle";
    // We'll use a small placeholder data URI
    const dummyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    
    console.log("Testing generation...");
    const description = await generateDescription(dummyTitle, dummyImage);
    console.log("Description result:", description);

    console.log("Testing verification...");
    const verification = await verifyItemImage(dummyTitle, dummyImage);
    console.log("Verification result:", verification);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testImage();
