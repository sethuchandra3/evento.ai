export interface LambdaResponse {
  [key: string]: any;
}

export async function sendMessageToLambda(message: string): Promise<LambdaResponse> {
  try {
    const response = await fetch(
      "https://ihz8zrndih.execute-api.us-east-1.amazonaws.com/default/GroupMeAIExtractor",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message,
          sender_type: "user",
          group_name: "Frontend Test",
        }),
      }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error response: ${errorText}`);
        throw new Error(`Request failed with status: ${response.status}. See console for backend response.`);
    }

    // Lambda proxy integration often returns a stringified JSON in the body.
    // Let's parse it here so the UI components don't have to.
    const data = await response.json();
    console.log("Raw Lambda response:", data);

    if (typeof data.body === 'string') {
        try {
            const parsedBody = JSON.parse(data.body);
            console.log("Parsed Lambda body:", parsedBody);
            return parsedBody;
        } catch (e) {
            console.error("Failed to parse Lambda response body:", e);
            // If parsing fails, maybe the body was just a plain string message
            return { message: data.body };
        }
    }
    
    // If body wasn't a string or didn't exist, return the original data
    return data;
    
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const corsError = new Error(
        "Network request failed. This could be a CORS issue or a network connectivity problem. Please ensure the backend at AWS API Gateway is configured to accept requests from this website's domain."
      );
      console.error("Error details:", error);
      throw corsError;
    }
    
    console.error("Error sending message to Lambda:", error);
    throw error;
  }
}