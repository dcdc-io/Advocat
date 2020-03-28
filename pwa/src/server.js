import * as fuxor from 'fuxor'
import * as pouchdbSecurity from '../../pouchdb-security'
fuxor.add('pouchdb-security', pouchdbSecurity)

import slouchdbSecurity from '../../slouchdb-security'

import PouchDB from 'pouchdb'
import express from 'express'
import expressPouchdb from 'express-pouchdb'
import bodyParser from 'body-parser'
import path from 'path'

import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	// application specific logging, throwing an error, or other logic here
  });

express().use(
	bodyParser.json()
).get(
	'/db/_utils', (req, res) => {
		if (req.originalUrl === '/db/_utils')
			res.redirect(301, '/db/_utils/')
		else
			res.sendFile(process.cwd() + "/_utils/index.html")
	}
).use(
	'/db/_utils',
	express.static(process.cwd() + '/_utils')
).use(
	'/db',
	globalThis.appContext = expressPouchdb(
		globalThis.dbContext = PouchDB.plugin(slouchdbSecurity).plugin(require('pouchdb-auth')).defaults({
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