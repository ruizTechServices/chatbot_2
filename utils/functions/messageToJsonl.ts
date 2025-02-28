export const convertMessagesToJSONL = (messages: { text: string; sender: "user" | "bot" }[]): string => {
  return messages.map(msg => JSON.stringify(msg)).join('\n');
};