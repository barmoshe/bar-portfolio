import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

// Default data structure
const defaultData = {
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
    
    // Find the data document (we'll use a simple approach with a single document)
    let data = await collection.findOne({ _id: 'main-data' });
    
    // If no data exists yet, initialize with default data
    if (!data) {
      await collection.insertOne({ 
        _id: 'main-data',
        ...defaultData
      });
      data = await collection.findOne({ _id: 'main-data' });
    }
    
    // Remove MongoDB specific fields from the response
    const { _id, ...cleanData } = data || defaultData;
    
    return NextResponse.json(cleanData);
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
    
    // Update the existing document or create if it doesn't exist
    const result = await collection.updateOne(
      { _id: 'main-data' },
      { $set: data },
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
