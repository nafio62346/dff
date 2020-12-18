import { Box, Modal, Button, ButtonGroup } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import React from 'react';

import { useTranslation } from '../../../contexts/TranslationContext';
import { statusPageUrl } from './constants';
import { useSetModal } from '../../../contexts/ModalContext';

const SeeMoreModal = ({ onClose }) => {
	const t = useTranslation();

	return <Modal>
		<Modal.Header>
			<Modal.Title>{t('Cloud_Connectivity')}</Modal.Title>
			<Modal.Close onClick={onClose} />
		</Modal.Header>
		<Modal.Content>
			<p>{t('Cloud_what_is_it_description')}</p>
			<ul>
				<li>1 - {t('Register_Server_Registered_Push_Notifications')}</li>
				<li>2 - {t('Register_Server_Registered_Livechat')}</li>
				<li>3 - {t('Register_Server_Registered_OAuth')}</li>
				<li>4 - {t('Register_Server_Registered_Marketplace')}</li>
			</ul>
		</Modal.Content>
		<Modal.Footer>
			<ButtonGroup align='end'>
				<Button primary onClick={onClose}>{t('Ok')}</Button>
			</ButtonGroup>
		</Modal.Footer>
	</Modal>;
};

function WhatIsItSection(props) {
	const t = useTranslation();

	const setModal = useSetModal();

	const handleModal = useMutableCallback(() => {
		setModal(<SeeMoreModal onClose={() => setModal()}/>);
	});

	return <Box is='section' {...props}>
		<Box fontScale='s2'>{t('Cloud_what_is_it')}</Box>

		<Box withRichContent color='neutral-800'>
			<p>{t('Cloud_what_is_it_description')}</p>

			<p>
				<a onClick={handleModal}>{t('See_more')}</a>
			</p>

			<p>
				{t('Cloud_status_page_description')}:{' '}
				<a href={statusPageUrl} target='_blank' rel='noopener noreferrer'>{statusPageUrl}</a>
			</p>

		</Box>
	</Box>;
}

export default WhatIsItSection;
