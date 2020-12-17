import React from 'react';

import { usePermission } from '../../../contexts/AuthorizationContext';
import NotAuthorizedPage from '../../../components/NotAuthorizedPage';
// import CloudPage from './CloudPage';
import CloudConnectivityPage from './CloudConnectivityPage';

function CloudRoute() {
	const canManageCloud = usePermission('manage-cloud');

	if (!canManageCloud) {
		return <NotAuthorizedPage />;
	}

	return <CloudConnectivityPage />;
}

export default CloudRoute;
