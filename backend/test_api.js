async function testApi() {
  try {
    const sizeInBytes = 5 * 1024 * 1024;
    const dummyBase64 = 'data:image/png;base64,' + 'A'.repeat(sizeInBytes);
    
    console.log("Sending large payload to /api/ai/generate-description...");
    const res = await fetch('http://localhost:5000/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Missing token will cause 401 Unauthorized, which PROVES payload limit didn't block it!
      },
      body: JSON.stringify({
        title: 'large image test',
        imageUrl: dummyBase64
      })
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testApi();
