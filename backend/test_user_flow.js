async function testFullFlow() {
  try {
    const sizeInBytes = 2 * 1024 * 1024;
    const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' + 'A'.repeat(sizeInBytes);
    
    console.log("Registering user...");
    let token = '';
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User ' + Date.now(),
        email: 'testflow' + Date.now() + '@example.com',
        password: 'password123',
        college: 'Test College',
        phoneNumber: '1234567890'
      })
    });
    const regData = await regRes.json();
    if (regRes.ok) {
      token = regData.token;
    } else {
      console.log("Register failed:", regData);
      return;
    }

    console.log("Got token:", token.substring(0, 10) + "...");
    const res = await fetch('http://localhost:5000/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        title: 'Water Bottle',
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

testFullFlow();
