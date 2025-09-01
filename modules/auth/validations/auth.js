exports.registerInput = [
  { key: 'phone', type: 'string', required: false },
  { key: 'email', type: 'email', required: false },
  { key: 'full_name', type: 'string', required: false },
  { key: 'password', type: 'string', required: false },
  { key: 'oauth_provider', type: 'string', required: false },
  { key: 'oauth_uid', type: 'string', required: false },
  { key: 'preferred_language', type: 'string', required: false } // ✅ add this
];

exports.loginInput = [
  { key: 'email', type: 'email', required: true},
  { key: 'password', type: 'string', required: true},
  { key: 'preferred_language', type: 'string', required: false }
]

exports.businessRegisterInput = [
  { key: 'email', type: 'email', required: true },
  { key: 'full_name', type: 'string', required: true },
  { key: 'password', type: 'string', required: true },
  { key: 'oauth_provider', type: 'string', required: false },
  { key: 'oauth_uid', type: 'string', required: false },
  { key: 'preferred_language', type: 'string', required: false }
];

exports.initiatePasswordResetInput = [
  { key: 'email', type: 'email', required: true },
  { key: 'preferred_language', type: 'string', required: false }
];

exports.verifyResetOtpInput = [
  { key: 'email', type: 'email', required: true },
  { key: 'otp', type: 'string', required: true },
  { key: 'preferred_language', type: 'string', required: false }
];

exports.resetPasswordInput = [
  { key: 'email', type: 'email', required: true },
  { key: 'password', type: 'string', required: true },
  { key: 'confirm_password', type: 'string', required: true },
  { key: 'preferred_language', type: 'string', required: false }
];

exports.changePasswordInput = [
  { key: 'old_password', type: 'string', required: true },
  { key: 'new_password', type: 'string', required: true },
  { key: 'confirm_password', type: 'string', required: true },
  { key: 'preferred_language', type: 'string', required: false }
];