import { Client, Environment } from "square";

// Initializes Square client with correct SDK class and strong typing
export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Sandbox,
});

export default squareClient;
