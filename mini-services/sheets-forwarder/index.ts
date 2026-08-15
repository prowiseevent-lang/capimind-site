import { serve } from "bun";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDkpEnbsYuEnNLK69WVNcVhhXpt5QWYkp6JmVM9pUub2hoBTp357EMTMgzqGjQqhOO2A/exec";

async function sendToGoogleSheets(data: Record<string, string>) {
  try {
    const urlWithData = `${SCRIPT_URL}?data=${encodeURIComponent(JSON.stringify(data))}`;
    const redirectRes = await fetch(urlWithData, { method: "GET", redirect: "manual" });
    const location = redirectRes.headers.get("location");
    
    if (!location) {
      if (redirectRes.ok) {
        const text = await redirectRes.text();
        console.log("✅ Google Sheets (no redirect):", text);
        return true;
      }
      console.error("❌ Google Sheets failed:", redirectRes.status);
      return false;
    }
    
    const execRes = await fetch(location, { method: "GET" });
    if (execRes.ok) {
      const text = await execRes.text();
      console.log("✅ Google Sheets:", text);
      return true;
    }
    console.error("❌ Google Sheets exec failed:", execRes.status);
    return false;
  } catch (err) {
    console.error("❌ Google Sheets error:", err);
    return false;
  }
}

serve({
  port: 3031,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Health check
    if (url.pathname === "/health") {
      return Response.json({ status: "ok", service: "sheets-forwarder" });
    }
    
    // Forward enrollment
    if (url.pathname === "/enroll" && req.method === "POST") {
      try {
        const body = await req.json();
        const { fullName, email, phone, company, message, courseId, courseTitle } = body;
        
        if (!fullName || !email || !phone || !courseId) {
          return Response.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        // Forward to Google Sheets (fire and forget)
        sendToGoogleSheets({
          type: "inscription",
          name: fullName,
          email,
          phone,
          company: company || "",
          course: courseTitle || "",
          message: message || "",
          date: new Date().toISOString(),
          destination: "contact@capimind.com",
        }).catch(console.error);
        
        return Response.json({
          success: true,
          message: "Inscription réussie!",
          id: "enr_" + Date.now(),
        });
      } catch (e) {
        return Response.json({ error: "Invalid request" }, { status: 400 });
      }
    }
    
    // Forward contact
    if (url.pathname === "/contact" && req.method === "POST") {
      try {
        const body = await req.json();
        const { name, email, subject, message } = body;
        
        if (!name || !email || !subject || !message) {
          return Response.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        // Forward to Google Sheets (fire and forget)
        sendToGoogleSheets({
          type: "contact",
          name,
          email,
          subject,
          message,
          date: new Date().toISOString(),
          destination: "contact@capimind.com",
        }).catch(console.error);
        
        return Response.json({
          success: true,
          message: "Message envoyé avec succès",
          id: "msg_" + Date.now(),
        });
      } catch (e) {
        return Response.json({ error: "Invalid request" }, { status: 400 });
      }
    }
    
    return Response.json({ error: "Not found" }, { status: 404 });
  },
});

console.log("🚀 Sheets Forwarder running on port 3031");
