export const endpointUrl =
  process.env.NODE_ENV === "production"
    ? "https://us-central1-e-stat-api-viewer.cloudfunctions.net/fetchEstatApi"
    : "http://localhost:8080/fetchEstatApi";
