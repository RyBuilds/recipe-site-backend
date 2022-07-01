
import axios from "axios";

export const exchangeCode = async (code: String, client_id: String, client_secret: String): Promise<String> => {
  const url = "https://todoist.com/oauth/access_token";
  const headers = {"Content-Type": "application/json"};
  const body = {client_id, client_secret, code}

  const response = await axios.post(url, body, {headers} );

  if (!response.data || response.status !== 200) {
    throw new Error("Non 200 status received when fetching recently played.");
  }

  return JSON.parse(response.data).access_token;
};
