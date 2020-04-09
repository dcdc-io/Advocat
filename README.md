# Advocat.
---------------------------
An app to connect self-isolating people with healthy people to drop them supplies

## Contributing

Take a look at the [help us out](https://github.com/dcdc-io/Advocaat/labels/help%20wanted) issues for the top priority work to do.

## Build and Run Local

Run `yarn dev` in the `/pwa` directory to start a local stack.

To use it, go to:

http://localhost:3000

The PouchDB backend can be found at:

http://localhost/db/_utils

The default admin username and password is:

Username: `admin`
Password: `password`

To create users advocat. sends an email, and you may not want this in dev so we don't enable that service by default.

When you want to complete a registration of a user in dev, you can create a link using the `token` from the registrations database.

To complete a dev registration go to http://localhost:3000/db/_utils and view the registrations database, copy the token for your registration and then visit http://localhost:3000/complete-registration/the-token-copied



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
