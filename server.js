const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Your GitHub API Token and Repository Info
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'Joodev56';
const REPO_NAME = 'joo';
const FILE_PATH = 'db.txt'; // Path to your file in the repository

app.use(bodyParser.json());
app.use(express.static('public')); // To serve the frontend files

// Endpoint to add user number
app.post('/add-user', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    try {
        // Fetch the current contents of the file
        const fileResponse = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
        });

        // Decode the base64 content
        const fileContent = JSON.parse(Buffer.from(fileResponse.data.content, 'base64').toString());

        // Add the new phone number to the array
        fileContent.push({ phoneNumber });

        // Convert the updated content back to base64
        const updatedContent = Buffer.from(JSON.stringify(fileContent, null, 2)).toString('base64');

        // Update the file on GitHub
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Add new phone number',
            content: updatedContent,
            sha: fileResponse.data.sha // SHA of the original file to update
        }, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
