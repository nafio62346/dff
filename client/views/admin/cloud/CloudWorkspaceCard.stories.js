import React from 'react';

import CloudWorkspaceCard from './CloudWorkspaceCard';

export default {
	title: 'admin/connectivity/CloudWorkspaceCard.',
	component: CloudWorkspaceCard,
};

export const Unregistered = () => <CloudWorkspaceCard state={'unregistered'} />;

export const WaitingConfirmation = () => <CloudWorkspaceCard state={'confirmation'} email={'rocket.chat@rocket.chat'} />;

export const Registered = () => <CloudWorkspaceCard
	state={'registered'}
	lastSynced={new Date().toISOString()}
	airgapped={false}
	registrationData={{
		organization: 'Rocket.Chat',
		email: 'rocket.chat@rocket.chat',
		date: new Date().toISOString(),
		id: '5f3eecd19eb91400017168bb',
	}}
/>;
