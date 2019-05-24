import { Meteor } from 'meteor/meteor';

import { Messages, Users } from '../../../models';
import { updateMessage } from '../../../lib/server/functions/updateMessage';
// import { getRoom } from '../../../livechat/server/api/lib/livechat';
import { Livechat } from '../../../livechat/server/lib/Livechat';

export class AppLivechatBridge {
	constructor(orch) {
		this.orch = orch;
	}

	async createMessage(message, appId) {
		this.orch.debugLog(`The App ${ appId } is creating a new message.`);

		const guest = message.visitor;

		if (!guest) {
			throw new Error('');
		}

		let msg = this.orch.getConverters().get('messages').convertAppMessage(message);

		// Livechat.sendMessage();

		Meteor.runAsUser(msg.u._id, () => {
			msg = Meteor.call('sendMessage', msg);
		});

		return msg._id;
	}

	async getMessageById(messageId, appId) {
		this.orch.debugLog(`The App ${ appId } is getting the message: "${ messageId }"`);

		return this.orch.getConverters().get('messages').convertById(messageId);
	}

	async updateMessage(message, appId) {
		this.orch.debugLog(`The App ${ appId } is updating a message.`);

		if (!message.editor) {
			throw new Error('Invalid editor assigned to the message for the update.');
		}

		if (!message.id || !Messages.findOneById(message.id)) {
			throw new Error('A message must exist to update.');
		}

		const msg = this.orch.getConverters().get('messages').convertAppMessage(message);
		const editor = Users.findOneById(message.editor.id);

		updateMessage(msg, editor);
	}

	async createRoom(visitor, agent, appId) {
		this.orch.debugLog(`The App ${ appId } is creating a livechat room.`);

		// return this.orch.getConverters().get('rooms').convertRoom(getRoom({ guest: visitor, agent }).room);
	}
}
