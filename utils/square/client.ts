import { SquareClient, SquareEnvironment } from "square";

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  // Force sandbox mode until production credentials are set up
  environment: SquareEnvironment.Sandbox,
});

export default squareClient;