const express = require('express');
const axios = require('axios');
const app = express();
const redis = require('redis');
const redisPort = 6379
const client = redis.createClient(redisPort);
 if(!client) throw Error;
 else
 {
    app.get("/jobs", async (req, res) => {
        const searchTerm = req.query.search;
        try {
            client.on('error', ()=>{
                console.log("can't connect to redis");
            })
            client.get(searchTerm, async (err, jobs) => {
                if (err) console.log("Error")//throw err;

                if (jobs) {
                    res.status(200).send({
                        jobs: JSON.parse(jobs),
                        message: "data retrieved from the cache"
                    });
                } else {
                        const jobs = await axios.get(`https://jobs.github.com/positions.json?search=${searchTerm}`);
                        client.setex(searchTerm, 600, JSON.stringify(jobs.data));
                        res.status(200).send({
                            jobs: jobs.data,
                            message: "cache miss"
                        });
                }
        });
        } catch(err) {
            res.status(500).send({message: err.message});
        }
    });
}

app.listen(3000, ()=>console.log(`Listening on port 3000`));