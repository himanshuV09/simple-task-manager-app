const mongoose = require('mongoose');
const dns = require('dns');

// Some networks use a local DNS resolver (e.g. 127.0.0.1) that refuses SRV
// lookups, which breaks "mongodb+srv://" connection strings. Setting
// DNS_SERVERS (comma-separated) points Node's resolver at a DNS that supports
// SRV. Left unset, the system's default DNS servers are used.
if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
}

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL)
    .then(() => {
        console.log('MongoDB is Connected...');
    }).catch((err) => {
        console.log('MongoDB Conn Error...', err);
    });
