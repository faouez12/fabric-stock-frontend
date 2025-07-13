export async function testBackendConnection() {
  try {
    const response = await fetch("https://fabric-stock-backend.onrender.com/api/test");
    const data = await response.json();
    console.log("Backend Response:", data);
    return data;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return null;
  }
}
