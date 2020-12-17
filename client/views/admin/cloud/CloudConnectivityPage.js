import { Box, Button, ButtonGroup, Divider } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import React from 'react';

import Page from '../../../components/Page';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useMethod } from '../../../contexts/ServerContext';
import { useToastMessageDispatch } from '../../../contexts/ToastMessagesContext';
// import { useQueryStringParameter, useRoute, useRouteParameter } from '../../../contexts/RouterContext';
import WhatIsItSection from './WhatIsItSection';
// import ConnectToCloudSection from './ConnectToCloudSection';
// import TroubleshootingSection from './TroubleshootingSection';
// import WorkspaceRegistrationSection from './WorkspaceRegistrationSection';
// import WorkspaceLoginSection from './WorkspaceLoginSection';
// import ManualWorkspaceRegistrationModal from './ManualWorkspaceRegistrationModal';
import { useMethodData } from '../../../hooks/useMethodData';
import { cloudConsoleUrl } from './constants';
import CloudWorkspaceCard from './CloudWorkspaceCard';

const getState = (data) => {
	if (!data) {
		return;
	}
	const { connectToCloud, workspaceRegistered } = data;
	if (connectToCloud) {
		if (workspaceRegistered) {
			return 'registered';
		}

		return 'confirmation';
	}

	return 'unregistered';
};

function CloudConnectivityPage() {
	const t = useTranslation();
	// const dispatchToastMessage = useToastMessageDispatch();

	// const cloudRoute = useRoute('cloud');

	const dispatchToastMessage = useToastMessageDispatch();

	// const page = useRouteParameter('page');
	const syncWorkspace = useMethod('cloud:syncWorkspace');
	const disconnectWorkspace = useMethod('cloud:disconnectWorkspace');

	const { value } = useMethodData('cloud:checkRegisterStatus');

	const state = getState(value);
	// console.log(registerStatus);

	const handleSyncButtonClick = useMutableCallback(async () => {
		try {
			const isSynced = await syncWorkspace();

			if (!isSynced) {
				throw Error(t('An error occured syncing'));
			}

			dispatchToastMessage({ type: 'success', message: t('Sync Complete') });
		} catch (error) {
			dispatchToastMessage({ type: 'error', message: error });
		}
	});

	const handleDisconnectButtonClick = async () => {
		try {
			const success = await disconnectWorkspace();

			if (!success) {
				throw Error(t('An error occured disconnecting'));
			}

			dispatchToastMessage({ type: 'success', message: t('Disconnected') });
		} catch (error) {
			dispatchToastMessage({ type: 'error', message: error });
		}
	};

	return <Page>
		<Page.Header title={t('Cloud_Connectivity')}>
			<ButtonGroup>
				<Button is='a' href={cloudConsoleUrl} target='_blank' rel='noopener noreferrer'>
					{t('View_Cloud_Account')}
				</Button>
			</ButtonGroup>
		</Page.Header>
		<Page.ScrollableContentWithShadow>
			<WhatIsItSection />
			<Divider />
			<Box pbs='x24'>
				<CloudWorkspaceCard
					{...value}
					state={state}
					onSync={handleSyncButtonClick}
					onUnregister={handleDisconnectButtonClick}
				/>
			</Box>

		</Page.ScrollableContentWithShadow>
	</Page>;
}

export default CloudConnectivityPage;
