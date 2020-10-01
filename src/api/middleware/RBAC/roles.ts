import { AccessControl } from 'accesscontrol';

let grantList = [
	{ role: 'USER', resource: 'ticket', action: 'create:own', attributes: '*' },
	{ role: 'USER', resource: 'ticket', action: 'read:own', attributes: '*' },
	{ role: 'USER', resource: 'comment', action: 'create:own', attributes: '*' },
	{ role: 'USER', resource: 'comment', action: 'read:any', attributes: '*' },

	{ role: 'SUPPORT', resource: 'ticket', action: 'create:any', attributes: '*' },
	{ role: 'SUPPORT', resource: 'ticket', action: 'read:any', attributes: '*' },
	{ role: 'SUPPORT', resource: 'ticket', action: 'update:any', attributes: '*, status' },
	{ role: 'SUPPORT', resource: 'comment', action: 'create:own', attributes: '*' },
	{ role: 'SUPPORT', resource: 'comment', action: 'read:any', attributes: '*' },

	{ role: 'ADMIN', resource: 'ticket', action: 'create:any', attributes: '*' },
	{ role: 'ADMIN', resource: 'ticket', action: 'read:any', attributes: '*' },
	{ role: 'ADMIN', resource: 'ticket', action: 'update:any', attributes: '*' },
	{ role: 'ADMIN', resource: 'comment', action: 'create:own', attributes: '*' },
	{ role: 'ADMIN', resource: 'comment', action: 'read:any', attributes: '*' },
	{ role: 'ADMIN', resource: 'user', action: 'update:any', attributes: '*' }
];

const ac = new AccessControl(grantList);

export default ac;
