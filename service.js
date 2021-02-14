require('dotenv').config();
const redis = require('redis');
const fetch = require('node-fetch');
const { default: axios } = require('axios');

const redis_port = process.env.REDIS_PORT;

const client = redis.createClient(redis_port);

async function fetch_api(searchTerm)
{
        client.get(searchTerm, async (err, jobs) => {
            if (err) throw err;

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
}


//  exports.fetch_api = fetch_api();
exports.fetchText = fetchText();