export default {
  development: {
    serverUrl: {
      recordTime: "https://api-qa.doctorwork.com/familydoctor/v1/user/upload_login_time",
      token: "https://api-qa.doctorwork.com/ab-web-token/v1/get_flags_async",
      jwt: "https://api-qa.doctorwork.com/ab-web-sso/v1/get_flags_async",
    },
  },
  production: {
    serverUrl: {
      recordTime: "https://api.doctorwork.com/familydoctor/v1/user/upload_login_time",
      token: "https://api.doctorwork.com/ab-web-token/v1/get_flags_async",
      jwt: "https://api.doctorwork.com/ab-web-sso/v1/get_flags_async",
    },
  },
};
