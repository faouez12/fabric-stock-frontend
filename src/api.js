export async function testBackendConnection() {
  try {
    const response = await fetch("http://localhost:5000/api/test");
    const data = await response.json();
    console.log("Backend Response:", data);
    return data;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return null;
  }
}
