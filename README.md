# Advocat.
---------------------------
An app to connect self-isolating people with healthy people to drop them supplies

## Contributing

Take a look at the [help us out](https://github.com/dcdc-io/Advocaat/labels/help%20wanted) issues for the top priority work to do.

## Build and Run Local

Run `docker-compose up` in the root directory to start a local stack.

The API will run on HTTP port 3001 and the web frontend on HTTP port 3000


/server is the server and you run with node index.js
/pwa is the pwa and you run with yarn dev
/deploy has the db setup scripts and node dev.js will initialise you db after you start the server
./build.sh will make sure everything is built properly <----- SO I SUGGEST YOU RUN THIS FIRST

# PouchDB Permission System

PouchDB database access is controlled through whitelists, unless nobody is in any whitelist, in which case a database resource is public read and write.

Once any roles or names are added to the security document for a database then access to that database will be governed by the whitelists in each section of the security document.

### Roles, Names, and Permissions

Databases support simultaneous role-based access control and user-based access control.

The security document structure is as follows:



fig.1. a security document with only one `role` named `workers_uk_leeds_rw` with `member` permissions.
<code>
<pre>
{
    members: {
        roles: [
            "workers_uk_leeds_rw"
        ]
    }
}
</pre>
</code>