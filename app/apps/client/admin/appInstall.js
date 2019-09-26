// The idea of this page is to allow them to select a file from their system
// or enter a url or visit this page with a url attached which then their server
// downloads the file from the url. After it's either uploaded or downloaded,
// then the server parses it and takes them to that App's setting page
// to then allow them to enable it and go from there. A brand new App
// will NOT be enabled by default, they will have to manually enable it. However,
// if you're developing it and using a rest api with a particular parameter passed
// then it will be enabled by default for development reasons. The server prefers a url
// over the passed in body, so if both are found it will only use the url.
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import toastr from 'toastr';

import { APIClient } from '../../../utils';
import { SideNav } from '../../../ui-utils/client';

function handleInstallError(apiError) {
	if (!apiError.xhr || !apiError.xhr.responseJSON) { return; }

	const { status, messages, error } = apiError.xhr.responseJSON;

	let message;

	switch (status) {
		case 'storage_error':
			message = messages.join('');
			break;

		case 'compiler_error':
			message = 'There has been compiler errors. App cannot be installed';
			break;

		default:
			if (error) {
				message = error;
			} else {
				message = 'There has been an error installing the app';
			}
	}

	toastr.error(message);
}

Template.appInstall.helpers({
	appFile() {
		return Template.instance().file.get();
	},
	isInstalling() {
		return Template.instance().isInstalling.get();
	},
	appUrl() {
		return Template.instance().appUrl.get();
	},
	disabled() {
		const instance = Template.instance();
		return !(instance.appUrl.get() || instance.file.get());
	},
	isUpdating() {
		const instance = Template.instance();

		return !!instance.isUpdatingId.get();
	},
});

Template.appInstall.onCreated(function() {
	const instance = this;
	instance.file = new ReactiveVar('');
	instance.isInstalling = new ReactiveVar(false);
	instance.appUrl = new ReactiveVar('');
	instance.isUpdatingId = new ReactiveVar('');

	// Allow passing in a url as a query param to show installation of
	if (FlowRouter.getQueryParam('url')) {
		instance.appUrl.set(FlowRouter.getQueryParam('url'));
		FlowRouter.setQueryParams({ url: null });
	}

	if (FlowRouter.getQueryParam('isUpdatingId')) {
		instance.isUpdatingId.set(FlowRouter.getQueryParam('isUpdatingId'));
	}
});

Template.appInstall.events({
	'input #appPackage'(e, i) {
		i.appUrl.set(e.currentTarget.value);
	},
	'change #upload-app'(e, i) {
		const file = e.currentTarget.files[0];
		i.file.set(file.name);
	},
	'click .js-cancel'() {
		FlowRouter.go('/admin/apps');
	},
	'click .js-install'(e, t) {
		console.log('Triggered');

		const url = $('#appPackage').val().trim();
		const { files } = $('#upload-app')[0];

		console.log({ files });

		const isUpdating = !!t.isUpdatingId.get();
		const endpoint = isUpdating ? `apps/${ t.isUpdatingId.get() }` : 'apps';
		let data;

		if (url) {
			data = { url };
		} else if (files instanceof FileList) {
			const selectedFile = files[0] || {};
			const payload = new FormData();

			if (selectedFile.type === 'application/zip') {
				payload.append('app', selectedFile, selectedFile.name);

				data = payload;
			}
		}

		if (!data) {
			return;
		}

		console.log('Will upload...', data instanceof FormData ? data.getAll('app') : data);

		const callback = (result) => FlowRouter.go(`/admin/apps/${ result.app.id }?version=${ result.app.version }`);

		t.isInstalling.set(true);

		let promise;

		if (data instanceof FormData) {
			console.log('... a file');
			promise = APIClient.upload(endpoint, data);
		} else {
			console.log('... a url');
			promise = APIClient.post(endpoint, data);
		}

		promise.then((result) => { console.log('success', result); callback(result); })
			.catch((error) => { console.log('error', error); handleInstallError(error); })
			.finally(() => {
				console.log('Got to the end!');
				t.isInstalling.set(false);
				t.file.set('');
			});
	},
});

Template.appInstall.onRendered(() => {
	Tracker.afterFlush(() => {
		SideNav.setFlex('adminFlex');
		SideNav.openFlex();
	});
});
