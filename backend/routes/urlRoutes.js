const express = require("express");
const router = express.Router();

const { nanoid } = require("nanoid");
const Url = require("../model/Url");


// 1. CREATE SHORT URL
// Inside your CREATE SHORT URL router.post("/") route:
router.post("/", async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "URL is required" });
    }

    let shortCode;
    if (customAlias && customAlias.trim() !== "") {
      const existingUrl = await Url.findOne({ shortCode: customAlias });
      if (existingUrl) {
        return res.status(400).json({ message: "Custom alias is already taken. Try another one!" });
      }
      shortCode = customAlias.trim();
    } else {
      shortCode = nanoid(6);
    }

    // ⭐ CALCULATE EXPIRATION TIME HERE:
    // Let's set it to 5 hours from right now
    const hoursToLive = 5; 
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + hoursToLive); 
    
    // Note: If you want 1 day instead, you can do:
    // expirationDate.setDate(expirationDate.getDate() + 1);

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      expiresAt: expirationDate // ⭐ Save the calculated future time stamp here
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:5173";

    res.status(201).json({
      message: "URL shortened successfully",
      shortUrl: `${baseUrl}/${shortCode}`,
      data: newUrl,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 2. GET ALL SHORTENED LINKS (For your Frontend Table UI)
router.get("/all", async (req, res) => {
  try {
    // Pull entries out sorted by newest created first
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ 
      message: error.message 
    });
  }
});


// 3. GET URL INFO & INCREMENT CLICKS (Used by your React Redirect Handler Page)
router.get("/info/:code", async (req, res) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.code,
    });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    // ⭐ FIX: Clicks will now register whenever your frontend loader page resolves a code lookup!
    url.clicks += 1;
    await url.save();

    res.json(url);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// 4. DIRECT SERVER REDIRECT (Alternative method if directly visiting backend links)
router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.code,
    });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;