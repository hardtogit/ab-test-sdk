import sa from "sa-sdk-miniprogram";
import AbTestSdk from "./weapp";

export default class AbTestSdkWithSensors extends AbTestSdk {
  constructor(options) {
    super(options);
    const defaultOption = {
      name: "sensors",
      server_url: `https://ssdata.xrxr.xyz/sa?project=${
        options.env === "development" ? "default" : "production"
      }`,
      autoTrack: {
        mpClick: true,
      },
      is_track_device_id: true,
      show_log: true,
    };
    sa.setPara({ ...defaultOption, ...options.sensorsOptions });
    this.sensors = sa;
  }
}
