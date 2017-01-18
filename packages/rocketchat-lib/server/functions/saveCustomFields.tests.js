describe('Server Functions', function () { // Logical Group (class / folder / namespace)
	describe('saveCustomFields', function () { // SUT (system under test)

		it('should validate formData against using the customFields validator', function () {
			const validator = td.replace('../validators/customFieldsValidator');
			const formData = {any: 'thing'};
			RocketChat.models.Users.setCustomFields = td.function();

			require('./saveCustomFields');
			RocketChat.saveCustomFields(null, formData);

			td.verify(validator.customFieldsValidator(formData));
		});

		it('should throw? return? an error if the validation does not pass', function () {
			fail('Not implemented');
		});

		it.only('should update the custom fields on the user object', function () {
			const userId = '';
			const formData = {any: 'thing'};
			const expectedCustomFields = {some: 'object'};
			const customFieldsValidator = td.replace('../validators/customFieldsValidator').customFieldsValidator;
			td.when(customFieldsValidator(formData)).thenReturn(expectedCustomFields);
			RocketChat.models.Users.setCustomFields = td.function();

			require('./saveCustomFields');
			RocketChat.saveCustomFields(userId, formData);

			td.verify(RocketChat.models.Users.setCustomFields(userId, expectedCustomFields));
		});

		it('should should return true when there are no errors', function () {
			// FIXME why does this return true when successful, but no false for anything else?
			// consider redesigning the error strategy
			fail('Not implemented');
		});
	});
});
