import sa from "./assets/sensorsdata.es6.min.js"; //v1.15.26
import AbTestSdkBase from "./h5";
export default class AbTestSdkWithSensors extends AbTestSdkBase {
  constructor(options) {
    super(options);
    const defaultOption = {
      name: "sensors",
      server_url: `https://ssdata.xrxr.xyz/sa?project=${
        options.env === "development" ? "default" : "production"
      }`,
      show_log: true,
    };
    sa.init({ ...defaultOption, ...options.sensorsOptions });
    this.sensors = sa;
  }
}
export const AbTestSdk = AbTestSdkWithSensors;
