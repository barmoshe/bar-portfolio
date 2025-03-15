import { APIEndpoint } from "./api-documentation";

export const apiEndpoints: APIEndpoint[] = [
  {
    method: "GET",
    path: "/api/data",
    description: "Retrieves the current user and project data.",
    responses: [
      {
        status: 200,
        description: "Returns the user and project data as JSON.",
      },
      {
        status: 500,
        description: "Server error occurred while retrieving data.",
      },
    ],
  },
  {
    method: "POST",
    path: "/api/data",
    description: "Updates the user and project data.",
    parameters: [
      "Request body should contain valid JSON with user and project data.",
    ],
    responses: [
      {
        status: 200,
        description: "Data successfully updated.",
      },
      {
        status: 400,
        description: "Invalid JSON data provided.",
      },
      {
        status: 500,
        description: "Server error occurred while updating data.",
      },
    ],
  },
];
