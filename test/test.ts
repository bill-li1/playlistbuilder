async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeRequest(index: number) {
  try {
    const response = await fetch("http://localhost:8080/test");
    console.log(`Request ${index}: Status ${response.status}`);

    // Only try to parse JSON for successful responses
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
    } else {
      const text = await response.text();
      console.log(text);
    }
  } catch (error) {
    console.error(`Request ${index} failed:`, error);
  }
}

async function testRateLimiting() {
  console.log("\n=== Testing Rate Limiting ===");
  // Make 7 requests sequentially (should see 429 after 5 requests)
  for (let i = 1; i <= 7; i++) {
    await makeRequest(i);
    // Small delay to ensure consistent ordering
    await sleep(100);
  }
}

async function testLoadBalancing() {
  console.log("\n=== Testing Load Balancing ===");
  // Make requests with delay to avoid rate limiting
  for (let i = 1; i <= 4; i++) {
    await makeRequest(i);
    await sleep(2000); // Wait 2 seconds between requests
  }
}

async function runTests() {
  console.log("Starting load balancer tests...");

  // Test load balancing first
  await testLoadBalancing();

  // Wait for rate limit window to reset
  console.log("\nWaiting for rate limit window to reset...");
  await sleep(10000);

  // Then test rate limiting
  await testRateLimiting();
}

runTests().catch(console.error);
