import serverUrl from "./config/index";
export interface SensorsOptions {
  name: string;
  auth_url: string;
  autoTrack: object;
  source_channel: [];
  show_log: boolean;
  allow_amend_share_path: boolean;
}
interface AbTestSdkOptions {
  sensorsOptions?: SensorsOptions;
  sensors?: any;
  appId: number | string;
  expIds: Array<string | number>;
  env: "production" | "development";
  authType: "jwt" | "token";
  requestFn: (url: string, params: object) => Promise<any>;
}
export interface AbParams {
  expId: string | number;
  callBack?: (res: any) => void;
}
const dealResponse = (params: Array<any>): object => {
  const result = params.reduce((total, current) => {
    return { ...total, [current.expId]: current };
  }, {});
  return result;
};
export default class AbTestSdk {
  sensors: any;
  options: AbTestSdkOptions;
  server_url: string;
  identity: any;
  appId: string | number;
  expIds: Array<string | number>;
  requestFn: (url: string, params: object) => Promise<any>;
  pending?: Promise<any> | null;
  constructor(options: AbTestSdkOptions) {
    this.sensors = options.sensors;
    this.server_url = serverUrl[options.env].serverUrl[options.authType];
    this.appId = options.appId;
    this.options = options;
    this.requestFn = options.requestFn;
    this.identity = {};
    this.expIds = options.expIds;
  }
  fetchCacheABTest(params: AbParams) {
    return new Promise((resolve, reject) => {
      if (this.identity[params.expId]) {
        resolve(this.identity[params.expId]);
      } else {
        reject("身份暂未获取，请先调用asyncFetchABTest或者fastFetchABTest");
      }
    });
  }
  abTrack(eventName: string, props: any) {
    this.sensors.track(eventName, {
      ...props,
      variable_key: this.identity[props.expId].variableKey,
      variable_type: this.identity[props.expId].variableType,
      variable_value: this.identity[props.expId].variableValue,
      group_id: this.identity[props.expId].groupId,
      exp_id: this.identity[props.expId].expId,
      app_id: this.identity[props.expId].appId,
    });
  }
  init() {
    //记录登录时间
    this.requestFn(serverUrl[this.options.env].serverUrl.recordTime, {});
    this.pending = this.requestFn(this.server_url, {
      appId: this.appId,
      expIds: this.expIds,
    });
    this.pending.then((data) => {
      this.identity = dealResponse(data);
      //上报AB事件
      data.forEach((item) => {
        this.sensors.track(item.sensorEventKey, {
          // variable_key: item.variableKey,
          // variable_type: item.variableType,
          // variable_value: item.variableValue,
          // group_id: item.groupId,
          // exp_id: item.expId,
          // app_id: item.appId,
          [item.variableKey]: item.variableValue,
        });
      });
    });
  }
  asyncFetchABTest(params: AbParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestFn(this.server_url, {
        appId: this.appId,
        expIds: this.expIds,
      }).then((data) => {
        this.identity = dealResponse(data);
        resolve(this.identity[params.expId]);
        params.callBack && params.callBack(this.identity[params.expId]);
      });
    });
  }
  fastFetchABTest(params: AbParams): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.identity[params.expId]) {
        resolve(this.identity[params.expId]);
      } else {
        if (this.pending) {
          this.pending.then((data) => {
            this.identity = dealResponse(data);
            this.pending = null;
            resolve(this.identity[params.expId]);
            params.callBack && params.callBack(this.identity[params.expId]);
          });
        } else {
          this.requestFn(this.server_url, {
            appId: this.appId,
            expIds: this.expIds,
          }).then((data) => {
            this.identity = dealResponse(data);
            resolve(this.identity[params.expId]);
            params.callBack && params.callBack(this.identity[params.expId]);
          });
        }
      }
    });
  }
}
