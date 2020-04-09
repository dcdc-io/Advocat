# Advocat.
---------------------------
An app to connect self-isolating people with healthy people to drop them supplies

## Contributing

Take a look at the [help us out](https://github.com/dcdc-io/Advocaat/labels/help%20wanted) issues for the top priority work to do.

## Build and Run Local

Before you run advocat. you should run the script ./build.sh which will gather external none-npm-able dependencies and make sure things are integrated.

So, one time `./build.sh`

And then whenever you want to run the PWA, it's just `yarn dev` in the `/pwa` directory to start a local stack.

To use the app, go to:

http://localhost:3000

The PouchDB backend can be found at:

http://localhost/db/_utils

The default admin username and password is:

Username: `admin`
Password: `password`

###  Creating Users Locally

To create users advocat. sends an email, and you may not want this in dev so we don't enable that service by default.

When you want to complete a registration of a user in dev, you can create a link using the `token` from the registrations database.

To complete a dev registration go to http://localhost:3000/db/_utils and view the registrations database, copy the token for your registration and then visit http://localhost:3000/complete-registration/the-token-copied

### Initialising Data Locally

Database initialisation is automated, and you may not want this in dev so we don't run the migrations by default.

When you want to initialise the database, whilst the app is running open another terminal and run `node index.js` from the /deploy subdirectory. This will load all migrations in /deploy into your local database. The migration process is currently not very sophisticated so while it will prevent scripts running multiple times, it will not know if you alter an existing script. If you do alter existing scripts you should clear your local database by removing the directory /pwa/db.

---

# PouchDB (Modified) Permission System

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

### New PouchDB Permission Sets and Special Roles

#### admins. members, readers, writers

Advocat. adds "readers" and "writers" in addition to the built in "admins" and "members". This allows the creation of write-only and read-only DB APIs and can be useful when deploying into federated app ecosystems where you want to take advantage of PouchDB replication without the risk that external databases write to data sources or read from data sinks.

#### role: _public

Advocat. adds a special _public role that can be added to a security document to make a particular permission interface public and available to none authenticated users. This allows scenarios such as anonymous reading and authorised writing. It is important to remember that this is *not the same* as having a database without a security document, as this would treat every visitor as if they had "member" permissions.

The shipped database `claim_templates` is an example of a database with public read and admin only write.