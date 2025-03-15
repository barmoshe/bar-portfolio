import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// Define the path to our JSON data file
const dataFilePath = path.join(process.cwd(), "data", "storage.json");

// Helper function to ensure the data directory exists
function ensureDataDirectoryExists() {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Helper function to read data from the JSON file
function readDataFile() {
  ensureDataDirectoryExists();

  if (!fs.existsSync(dataFilePath)) {
    // Create default data if file doesn't exist
    const defaultData = {
      user: {
        name: "Bar Moshe",
        role: "Software Developer & DevOps Enthusiast",
        skills: ["Backend", "DevOps", "Cloud", "TypeScript", "Node.js"],
      },
      projects: [{ id: 1, name: "Portfolio Site", status: "Completed" }],
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }

  try {
    const rawData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading data file:", error);
    return { error: "Failed to read data file" };
  }
}

// GET handler to retrieve the JSON data
export async function GET() {
  try {
    const data = readDataFile();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    );
  }
}

// POST handler to update the JSON data
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate that the data is valid JSON
    if (!data) {
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }

    // Ensure the data directory exists
    ensureDataDirectoryExists();

    // Write the updated data to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: "Data updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}
