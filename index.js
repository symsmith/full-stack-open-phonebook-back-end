const express = require("express")
const app = express(express.json())

const PORT = 3001
app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
})
