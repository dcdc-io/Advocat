import * as fuxor from 'fuxor'
import * as pouchdbSecurity from '../../pouchdb-security'
fuxor.add('pouchdb-security', pouchdbSecurity)

import PouchDB from 'pouchdb'
import express from 'express'
import expressPouchdb from 'express-pouchdb'

import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

express().use(
	'/db',
	expressPouchdb(
		PouchDB.defaults({
			prefix: './db/'
		}), {
			mode: 'fullCouchDB',
			overrideMode: {
				exclude: ['routes/fauxton']
			}
		}
	),
).use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	sapper.middleware()
).listen(PORT, err => {
	if (err) console.log('error', err)
})


/*
polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
*/