import * as sapper from '@sapper/app';
import { setDatabaseUrl } from './helpers'

setDatabaseUrl(window.location.origin + "/db")
sapper.start({
	target: document.querySelector('#sapper')
});