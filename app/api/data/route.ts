import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Define our data structure
interface UserData {
  name: string;
  role: string;
  skills: string[];
}

interface Project {
  id: number;
  name: string;
  status: string;
}

interface PortfolioData {
  user: UserData;
  projects: Project[];
}

// Default data structure
const defaultData: PortfolioData = {
  user: {
    name: "Bar Moshe",
    role: "Software Developer & DevOps Enthusiast",
    skills: ["Backend", "DevOps", "Cloud", "TypeScript", "Node.js"],
  },
  projects: [{ id: 1, name: "Portfolio Site", status: "Completed" }],
};

// GET handler to retrieve data from MongoDB
export async function GET() {
  try {
    // Get the portfolio data collection
    const collection = await getCollection('portfolioData');
    
    // Use a string identifier that's consistent
    const dataId = 'main-data';
    
    // Find the data document
    let data = await collection.findOne({ identifier: dataId });
    
    // If no data exists yet, initialize with default data
    if (!data) {
      await collection.insertOne({ 
        identifier: dataId,
        ...defaultData
      });
      data = await collection.findOne({ identifier: dataId });
    }
    
    // Remove MongoDB specific fields from the response
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, identifier, ...cleanData } = data;
      return NextResponse.json(cleanData);
    }
    
    return NextResponse.json(defaultData);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to retrieve data from database" },
      { status: 500 }
    );
  }
}

// POST handler to update data in MongoDB
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate that the data is valid JSON
    if (!data) {
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }

    // Get the portfolio data collection
    const collection = await getCollection('portfolioData');
    
    // Use a string identifier that's consistent
    const dataId = 'main-data';
    
    // Update the existing document or create if it doesn't exist
    const result = await collection.updateOne(
      { identifier: dataId },
      { $set: { ...data, identifier: dataId } },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Data updated successfully in MongoDB",
      data,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to update data in database" },
      { status: 500 }
    );
  }
}
