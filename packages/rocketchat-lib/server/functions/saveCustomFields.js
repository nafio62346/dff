import {customFieldsValidator} from '../validators/customFieldsValidator'

RocketChat.saveCustomFields = function (userId, formData) {
	const customFields = customFieldsValidator(formData);

	// for fieldName, field of customFieldsMeta
	RocketChat.models.Users.setCustomFields(userId, customFields);

	// Object.keys(customFields).forEach((fieldName) => {
	// 	if (!customFieldsMeta[fieldName].modifyRecordField) {
	// 		return;
	// 	}
  //
	// 	let modifyRecordField = customFieldsMeta[fieldName].modifyRecordField;
	// 	let update = {};
	// 	if (modifyRecordField.array) {
	// 		update.$addToSet = {};
	// 		update.$addToSet[modifyRecordField.field] = customFields[fieldName];
	// 	} else {
	// 		update.$set = {};
	// 		update.$set[modifyRecordField.field] = customFields[fieldName];
	// 	}
  //
	// 	RocketChat.models.Users.update(userId, update);
	// });

	return true;

}
