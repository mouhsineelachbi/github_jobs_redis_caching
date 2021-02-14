const express = require('express');
const redis = require('redis');
const axios = require('axios');
const   app = express();


app.get("/jobs", async (req, res) => {
    const searchTerm = req.query.search;
    try {
        const jobs = await axios.get(`https://jobs.github.com/positions.json?search=${searchTerm}`);
        res.status(200).send({
            jobs: jobs.data,
        });	
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

app.listen(3000, ()=>console.log(`Listening on port 3000`));