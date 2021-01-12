import serverUrl from "./config/index";
interface SensorsOptions {
  server_url: string;
  cross_subdomain?: boolean; //设置成 true 后，表示在根域下设置 cookie 。也就是如果你有 zhidao.baidu.com 和 tieba.baidu.com 两个域，且有一个用户在同一个浏览器都登录过这两个域的话，我们会认为这个用户是一个用户。如果设置成 false 的话，会认为是两个用户。
  show_log?: boolean; //设置 true 后会在网页控制台打 logger，会显示发送的数据,设置 false 表示不显示。
  use_client_time?: boolean; //客户端系统时间的不准确，会导致发生这个事件的时间有误，所以这里默认为 false ，表示不使用客户端时间，使用服务端时间，如果设置为 true 表示使用客户端系统时间。如果你在属性中加入 {$time: new Date()} ，注意这里必须是 Date 类型，那么这条数据就会使用你在属性中传入的这个时间。
  source_channel?: []; //默认获取的来源是根据 utm_source 等 ga 标准来的，如果使用百度统计的 hmsr 等参数，需在此字段中加入对应参数，参数必须是数组，例如：['hmsr']。使用网页通用渠道添加自定义属性时，需将对应的自定义属性名添加到此字段。
  source_type?: object; //自定义搜索引擎流量，社交流量，搜索关键词。
  max_string_length?: number; //通用字符串最大长度，超过部分会被截取丢弃（由于超过 7000 的字符串会导致 url 超长发不出去，所以限制长度）。
  send_type?: string; //表示使用图片 get 请求方式发数据，( 神策系统 1.10 版本以后 ) 可选使用 'ajax' 和 'beacon' 方式发送数据，这两种默认都是 post 方式， beacon 方式兼容性较差。
  callback_timeout?: number; //表示回调函数超时时间，如果数据发送超过 callback_timeout 还未返回结果，会强制执行回调函数。
  queue_timeout?: number; //表示队列发送超时时间，如果数据发送时间超过 queue_timeout 还未返回结果，会强制发送下一条数据。
  datasend_timeout?: number; //表示数据发送超时时间，如果数据发送超过 datasend_timeout 还未返回结果，会强制取消该请求。
  preset_properties?: object; //是否开启 $latest 最近一次相关事件属性采集以及配置 $url 作为公共属性，默认值为一个对象。
  is_track_single_page?: boolean; //表示是否开启单页面自动采集 $pageview 功能，SDK 会在 url 改变之后自动采集web页面浏览事件 $pageview。
  batch_send?: boolean; //表示不开启批量发送，设置为 true 表示开启批量采集。

  heatmap: {
    clickmap?: string; //是否开启点击图，默认 default 表示开启，可以设置 'not_collect' 表示关闭。
    scroll_notice_map?: string; //是否开启触达注意力图，设置 default 表示开启，设置 'not_collect' 表示关闭。
    loadTimeout?: number; //返回真会采集当前页面的元素点击事件，返回假表示不采集当前页面,设置这个函数后，内容为空的话，是返回假的。不设置函数默认是采集所有页面。
    collect_url?: () => boolean; //	返回真会采集当前页面的元素点击事件，返回假表示不采集当前页面,设置这个函数后，内容为空的话，是返回假的。不设置函数默认是采集所有页面。
    collect_element?: (element_target: any) => boolean; //用户点击页面元素时会触发这个函数，让你来判断是否要采集当前这个元素，返回真表示采集，返回假表示不采集。
    custom_property?: (element_target: any) => object; //假如要在 $WebClick 事件增加自定义属性，可以通过标签的特征来判断是否要增加。
    collect_input?: (element_target: any) => boolean; //考虑到用户隐私，这里可以设置 input 里的内容是否采集。
    element_selector?: string; //SDK 默认优先以元素 ID 作为选择器采集点击事件，若不想以 ID 作为选择器，可以设置该参数为 'not_use_id'。
    renderRefreshTime?: number; //第二版点击图滚动滚动条，改变页面尺寸后延时多少毫秒重新渲染页面。
    collect_tags?: object; //通过 collect_tags 配置是否开启 div 的全埋点采集，默认不采集。如需开启 ，配置  collect_tags 参数如下（注意：只支持配置 div）
  };
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
//简化参数，使用expId获取身份
interface AbParams {
  expId: string | number;
  callBack?: (res: any) => void;
}

const dealResponse = (params: Array<any>): object => {
  const result = params.reduce((total, current) => {
    return { ...total, [current.expId]: current };
  }, {});
  return result;
};

export class AbTestSdkBase {
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
    this.options = options;
    this.appId = options.appId;
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
export default AbTestSdkBase;
export const AbTestSdk = AbTestSdkBase;
