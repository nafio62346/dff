import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Callout, Icon } from '@rocket.chat/fuselage';
import { useMutableCallback, useSafely } from '@rocket.chat/fuselage-hooks';

import Subtitle from '../../../components/Subtitle';
import MarkdownText from '../../../components/MarkdownText';
import RegisterModal from './RegisterModal';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useShortTimeAgo } from '../../../hooks/useTimeAgo';
import { useFormatDateAndTime } from '../../../hooks/useFormatDateAndTime';
import { useSetModal } from '../../../contexts/ModalContext';
import { statusPageUrl } from './constants';

const CloudWorkspaceCardContainer = ({ children }) => {
	const t = useTranslation();

	return <Box bg='neutral-100' p='x16' maxWidth='x372'>
		<Subtitle>{t('Cloud_Workspace')}</Subtitle>
		{children}
	</Box>;
};

const Unregistered = ({ onRegister }) => {
	const t = useTranslation();

	const setModal = useSetModal();

	const handleRegisterModal = useMutableCallback(() => {
		setModal(<RegisterModal onRegister={onRegister} onClose={() => setModal()} />);
	});

	return <CloudWorkspaceCardContainer>
		<Callout type='danger'>{t('Not_Registered')}</Callout>
		<Box is='p' color='hint' mb='x24'>
			{/* TODO USE REAL URL */}
			{/* TODO USE REAL URL */}
			{/* TODO USE REAL URL */}
			{/* TODO USE REAL URL */}
			<MarkdownText content={t('Cloud_functionalities__url__may_not_work_unregistered', { url: statusPageUrl })}/>
		</Box>
		<ButtonGroup start>
			<Button primary onClick={handleRegisterModal}>{t('_Register')}</Button>
		</ButtonGroup>
	</CloudWorkspaceCardContainer>;
};

const Registered = ({ onUnregister, onSync, lastSynced, airgapped, workspaceId, email, organization, date }) => {
	const t = useTranslation();

	const timeAgo = useShortTimeAgo();
	const formatDateAndTime = useFormatDateAndTime();

	const [isLoading, setLoading] = useSafely(useState(false));

	const handleSync = useMutableCallback(async () => {
		setLoading(true);
		await onSync();
		setLoading(false);
	});

	const handleUnregister = useMutableCallback(async () => {
		setLoading(true);
		await onUnregister();
		setLoading(false);
	});

	return <CloudWorkspaceCardContainer>
		<Callout type='success'>
			<Box is='span' fontScale='c1'>
				{t('Registered_ID')}{' '}
				<b>{workspaceId}</b>
			</Box>
		</Callout>
		<Box is='p' color='hint' mb='x24'>
			<p><b>{t('Organization')}</b>: {organization}</p>
			<p><b>{t('Registered_by')}</b>: {email}</p>
			<p><b>{t('Date')}</b>: {formatDateAndTime(date)}</p>
			{/* TODO USE REAL URL */}
			{/* TODO USE REAL URL */}
			{/* TODO USE REAL URL */}
			{/* TODO USE REAL URL */}
			<MarkdownText content={t('Cloud_functionalities__url__may_not_work_unregistered', { url: statusPageUrl })}/>
		</Box>
		<Box display='flex' flexDirection='row' w='full' alignItems='center'>
			<ButtonGroup start>
				<Button small primary danger onClick={handleUnregister} disable={isLoading}>{t('Unregister')}</Button>
				<Button small onClick={handleSync} disabled={airgapped || isLoading}>{t('Sync')}</Button>
			</ButtonGroup>
			<Box color='hint' fontScale='c1' mis='x8'>
				<Icon color='success' name='check' mie='x4' size='x16'/>
				{ t('Last_sync__timeAgo__', { timeAgo: timeAgo(lastSynced) }) }
			</Box>
		</Box>
	</CloudWorkspaceCardContainer>;
};

const WaitingConfirmation = ({ onCancel, email }) => {
	const t = useTranslation();

	return <CloudWorkspaceCardContainer>
		<Callout type='warning'><b>{t('Awaiting_Email_Confirmation')}</b></Callout>
		<Box is='p' color='hint' mb='x24'>
			{t('Cloud_email_confirmation_description', { email })}
		</Box>
		<Box display='flex' flexDirection='row' w='full' alignItems='center'>
			<ButtonGroup start>
				<Button small primary danger onClick={onCancel}>{t('Cancel')}</Button>
			</ButtonGroup>
		</Box>
	</CloudWorkspaceCardContainer>;
};

const CloudWorkspaceCard = ({ state, ...props }) => {
	switch (state) {
		case 'confirmation':
			return <WaitingConfirmation {...props}/>;
		case 'registered':
			return <Registered {...props}/>;
		case 'unregistered':
		default:
			return <Unregistered {...props}/>;
	}
};

export default CloudWorkspaceCard;
