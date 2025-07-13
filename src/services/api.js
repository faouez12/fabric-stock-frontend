const API_URL = "http://localhost:5000/api";

export async function testBackendConnection() {
  try {
    const response = await fetch(`${API_URL}/test`);
    if (!response.ok) {
      throw new Error("Failed to connect to backend");
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}
