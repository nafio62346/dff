import React, { useState } from 'react';
import { Box, Modal, ButtonGroup, Button, Field, TextInput, CheckBox } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';

import { useTranslation } from '../../../contexts/TranslationContext';
import { isEmail } from '../../../../app/utils';
import MarkdownText from '../../../components/MarkdownText';

const RegisterModal = ({ onClose, onConnect }) => {
	const t = useTranslation();

	const [email, setEmail] = useState('');
	const [agreement, setAgreement] = useState(false);

	const handleEmail = useMutableCallback((e) => {
		setEmail(e.currentTarget.value);
	});

	const handleAgreement = useMutableCallback(() => {
		setAgreement(!agreement);
	});

	const validEmail = isEmail(email);

	return <Modal>
		<Modal.Header>
			<Modal.Title>{t('Cloud_Register_Workspace')}</Modal.Title>
			<Modal.Close onClick={onClose}/>
		</Modal.Header>

		<Modal.Content>
			<MarkdownText content={t('Cloud_inform_email')} />
			<Field>
				<Field.Label>{t('Email')}</Field.Label>
				<Field.Row>
					<TextInput error={email.length && !validEmail ? 'invalid' : ''} value={email} onChange={handleEmail} placeholder={t('Email')}/>
				</Field.Row>
				<Field.Error>
					&nbsp;{ !!email.length && !validEmail && t('error-invalid-email-address') }
				</Field.Error>
			</Field>
			<Field>
				<Field.Row>
					<Box display='flex' flexDirection='row'>
						<CheckBox checked={agreement} onChange={handleAgreement}/>
						<Box mis='x8' dangerouslySetInnerHTML={{ __html: t('Cloud_Service_Agree_PrivacyTerms_Description') }} />
					</Box>
				</Field.Row>
			</Field>
		</Modal.Content>

		<Modal.Footer>
			<ButtonGroup align='end'>
				<Button onClick={onClose}>{t('Cancel')}</Button>
				<Button onClick={onConnect} disabled={!validEmail || !agreement} primary>{t('Connect')}</Button>
			</ButtonGroup>
		</Modal.Footer>
	</Modal>;
};

export default RegisterModal;
