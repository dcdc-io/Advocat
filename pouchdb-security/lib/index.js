/*
  Copyright 2014-2015, Marten de Vries

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

"use strict";
var Promise = require("pouchdb-promise");

var nodify = require("promise-nodify");
var wrappers = require("pouchdb-wrappers");
var createBulkDocsWrapper = require("pouchdb-bulkdocs-wrapper");
var createChangeslikeWrapper = require("pouchdb-changeslike-wrapper");
var PouchDBPluginError = require("pouchdb-plugin-error");

var DOC_ID = "_local/_security";

exports.installSecurityMethods = function () {
  try {
    wrappers.installWrapperMethods(this, securityWrappers);
  } catch (err) {
    throw new Error("Security methods already installed.");
  }
};

exports.installStaticSecurityMethods = function (PouchDB) {
  //'static' method.
  try {
    wrappers.installStaticWrapperMethods(PouchDB, staticSecurityWrappers);
  } catch (err) {
    throw new Error("Static security methods already installed.");
  }
};

function securityWrapper(checkAllowed, original, args) {
  var userCtx = args.options.userCtx || {
    //Admin party!
    name: null,
    roles: ["_admin"]
  };
  if (userCtx.roles.indexOf("_admin") !== -1) {
    return original();
  }
  if (!checkAllowed) {
    return Promise.resolve().then(throw401);
  }
  return filledInSecurity(args)
    .then(function (security) {
      if (!checkAllowed(userCtx, security)) {
        throw401();
      }
    })
    .then(original);
}

function throw401() {
  throw new PouchDBPluginError({
    status: 401,
    name: "unauthorized",
    message: "You are not authorized to access this db."
  });
}

function filledInSecurity(args) {
  var getSecurity;
  if (typeof args.options.secObj === "undefined") {
    //needs the unwrapped getSecurity() to prevent recursion
    getSecurity = exports.getSecurity.bind(args.base);
  } else {
    getSecurity = Promise.resolve.bind(Promise, args.options.secObj);
  }

  return getSecurity()
    .then(function (security) {
      security.members = security.members || {};
      security.admins = security.admins || {};
      security.readers = security.readers || {};
      security.writers = security.writers || {};
      fillInSection(security.admins);
      fillInSection(security.members);
      fillInSection(security.readers);
      fillInSection(security.writers);

      return security;
    });
}

function fillInSection(section) {
  section.names = section.names || [];
  section.roles = section.roles || [];
}

function isIn(userCtx, section) {
  return section.names.some(function (name) {
    return name === userCtx.name;
  }) || section.roles.some(function (role) {
    return userCtx.roles.indexOf(role) !== -1;
  });
}

var securityWrappers = {};

//first the 'special' wrappers for functions that can be called
//depending on their arguments.

securityWrappers.query = function (original, args) {
  //query may only be called if
  //- a stored view & at least a db member or
  //- at least a db admin
  return securityWrapper(function (userCtx, security) {
    var isStoredView = typeof args.fun === "string";
    return (
      isIn(userCtx, security.admins) ||
      (isStoredView && (isMember(userCtx, security) || isReader(userCtx, security) || isPublicReader(userCtx, security)))
    );
  }, original, args);
};

function documentModificationWrapper(original, args, docId) {
  //the document modification functions may only be called if
  //- a non-design document & at least a db member or
  //- at least a db admin
  return securityWrapper(function (userCtx, security) {
    var isNotDesignDoc = String(docId).indexOf("_design/") !== 0;
    return (
      isIn(userCtx, security.admins) ||
      (isNotDesignDoc && (isMember(userCtx, security) || isWriter(userCtx, security) || isPublicWriter(userCtx, security)))
    );
  }, original, args);
}

function isNotPublic(security) {
  var thereAreAdmins = (
    security.admins.names.length ||
    security.admins.roles.length
  );
  var thereAreMembers = (
    security.members.names.length ||
    security.members.roles.length
  );
  var thereAreReaders = (
    security.readers.names.length ||
    security.readers.roles.length
  );
  var thereAreWriters = (
    security.writers.names.length ||
    security.writers.roles.length
  );
  return thereAreAdmins || thereAreMembers || thereAreReaders || thereAreWriters;
}

function isMember(userCtx, security) {
  return (!isNotPublic(security)) || isIn(userCtx, security.members);
}

function isReader(userCtx, security) {
  return (!isNotPublic(security)) || isIn(userCtx, security.readers);
}

function isWriter(userCtx, security) {
  return (!isNotPublic(security)) || isIn(userCtx, security.writers);
}

function isPublicReader(userCtx, security) {
  return security.readers.roles.some(role => role === "_public")
}

function isPublicWriter(userCtx, security) {
  return security.writers.roles.some(role => role === "_public")
}

securityWrappers.put = function (original, args) {
  return documentModificationWrapper(original, args, args.doc._id);
};
securityWrappers.post = securityWrappers.put
securityWrappers.remove = securityWrappers.put;

securityWrappers.putAttachment = function (original, args) {
  return documentModificationWrapper(original, args, args.docId);
};
securityWrappers.removeAttachment = securityWrappers.putAttachment;

securityWrappers.bulkDocs = createBulkDocsWrapper(function (doc, args) {
  var noop = Promise.resolve.bind(Promise);
  return documentModificationWrapper(noop, args, doc._id);
});

//functions requiring a server admin
var requiresServerAdmin = securityWrapper.bind(null, null);

securityWrappers.destroy = requiresServerAdmin;

//functions requiring a db admin
var requiresAdminWrapper = securityWrapper.bind(null, function (userCtx, security) {
  return isIn(userCtx, security.admins);
});
[
  'compact', 'putSecurity', 'viewCleanup', 'createIndex', 'deleteIndex'
].forEach(function (name) {
  securityWrappers[name] = requiresAdminWrapper;
});

//functions requiring a db member
var requiresMemberWrapper = securityWrapper.bind(null, function (userCtx, security) {
  return (
    isIn(userCtx, security.admins) ||
    isMember(userCtx, security)
  );
});
var requireMemberChangesWrapper = createChangeslikeWrapper(requiresMemberWrapper);

//functions requiring a db reader
var requiresReaderWrapper = securityWrapper.bind(null, function (userCtx, security) {
  return (
    isIn(userCtx, security.admins) ||
    isReader(userCtx, security) ||
    isMember(userCtx, security) ||
    isPublicReader(userCtx, security)
  );
});

//functions requiring a db writer
var requiresWriterWrapper = securityWrapper.bind(null, function (userCtx, security) {
  return (
    isIn(userCtx, security.admins) ||
    isWriter(userCtx, security) ||
    isMember(userCtx, security) ||
    isPublicWriter(userCtx, security)
  )
});

[
  'update', 'rewriteResultRequestObject'
].forEach(function (name) {
  securityWrappers[name] = requiresMemberWrapper;
});

[
  'sync', 'replicate.to', 'replicate.from'
].forEach(function (name) {
  securityWrappers[name] = requireMemberChangesWrapper;
});

[
  'get', 'allDocs', 'getAttachment', 'info', 'revsDiff', 'getSecurity', 'list',
  'show', 'bulkGet', 'getIndexes', 'find', 'explain', 'changes'
].forEach(function (name) {
  securityWrappers[name] = requiresReaderWrapper;
});

var staticSecurityWrappers = {};

staticSecurityWrappers.new = requiresServerAdmin;
staticSecurityWrappers.destroy = requiresServerAdmin;
staticSecurityWrappers.replicate = function (original, args) {
  //emulate replicate.to/replicate.from
  var PouchDB = args.base;
  args.base = args.source instanceof PouchDB ? args.source : new PouchDB(args.source);
  //and call its handler
  var handler = securityWrappers['replicate.to'];
  return handler(original, args);
};

exports.uninstallSecurityMethods = function () {
  try {
    wrappers.uninstallWrapperMethods(this, securityWrappers);
  } catch (err) {
    throw new Error("Security methods not installed.");
  }
};

exports.uninstallStaticSecurityMethods = function (PouchDB) {
  //'static' method.
  try {
    wrappers.uninstallStaticWrapperMethods(PouchDB, staticSecurityWrappers);
  } catch (err) {
    throw new Error("Static security methods not installed.");
  }
};

exports.putSecurity = function (secObj, callback) {
  var db = this;
  var promise;

  if (isHTTP(db)) {
    promise = db.get(DOC_ID)
      .catch(error => {
        if (error.status === 404) {
          return {_id: DOC_ID}
        } else {
          throw error
        }
      })
      .then(doc => {
        doc.security = secObj
        return db.put(doc)
          .catch(error => {
            return {_id: DOC_ID};
          })
        })
  } else {
    promise = db.get(DOC_ID)
      .catch(function () {
        return {_id: DOC_ID};
      })
      .then(function (doc) {
        doc.security = secObj;

        return db.put(doc);
      })
      .then(function () {
        return {ok: true};
      });
  }
  nodify(promise, callback);
  return promise;
};

function isHTTP(db) {
  return ["http", "https"].indexOf(db.type()) !== -1;
}

exports.getSecurity = function (callback) {
  var db = this;
  var promise;

  if (isHTTP(db)) {
    promise = 
      db.get(DOC_ID)
      .then(function(doc) {
        debugger
        return {}
      })
      .catch(function () {
        return {security: {}}
      })
  } else {
    promise = db.get(DOC_ID)
      .catch(function () {
        return {security: {}};
      })
      .then(function (doc) {
        return doc.security;
      });
  }
  nodify(promise, callback);
  return promise;
};