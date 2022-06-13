/* eslint-disable import/prefer-default-export */
export const joiValidator = async (data, schema) => {
  let message;
  const validationOptions = {
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
    abortEarly: true, // validate all inputs befor flagging error
  };

  try {
    await schema.validateAsync(data, validationOptions);
  } catch (error: any) {
    message = error.details[0].message.replace(/['"]/g, '');
  }
  return message;
};
