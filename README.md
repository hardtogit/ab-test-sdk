## 一、小程序对接 
### 1、已经集成神策SDK项目接入
#### 参数说明：

``` 
interface AbTestSdkOptions {
  sensors?: any;//将项目神策实例传入abSdk
  appId: number | string;//AB应用ID
  expIds: Array<string | number>;//实验id集合
  env: "production" | "development";//环境    development|production
  authType: "jwt" | "token";	//鉴权方式     token|jwt
  requestFn: (url: string, params: object) => Promise<any>; //请求实例  返回promise对象
}
```
####接入示例：
#####（1）安装SDK

``` 
yarn add ab-test-sdk --save
npm install ab-test-sdk --save  //或者
```
（2）使用
``` 
import AbTestSdk from 'ab-test-sdk/dist/weapp';
//实例化SDK
export const abTest = new AbTestSdk({
  appId: '522065064467890257', 
  expIds: [		       
    '522065614693466192',   
    '522065518568407106',
  ],												
  sensors: sensors,		
  env: 'development', 		
  authType: 'token',	
  requestFn: (url, parmas) => { 
    return request({		
      method: 'post',
      url,
      data: parmas,
      isNeedAuth: true,
    });
  },
});
//登录之后调用
abTest.init()
//获取实验受众有三个方法fetchCacheABTest、asyncFetchABTest、fastFetchABTest依次是从缓存中获取；优先从缓存中获取、没有则请求接口获取；直接请求接口获取.三个方法可使用方式一致，如下：
//promise方式：
abTest.fastFetchABTest({ expId: '523570893788557370' }).then((data)=>{
	console.log(data)
})
//回调方式
abTest.fastFetchABTest({ expId: '523570893788557370',callBack:(data)=>{
	console.log(data)
} })
     /***data={  
                appId: "522065064467890257" ,
                expId: "523570893788557370" ,
                groupId: "523570893788557368",
                sensorEventKey:"align_exp",
                variableKey: "button_align",
                variableType: "string",
                variableValue: "left"
           	 }
            根据variableValue做AB。
    ***/


```
### 2、未集成神策SDK项目接入
#### 参数说明：
``` 
interface AbTestSdkOptions {
  sensorsOptions?: object;//为神策sdk setPara接口的参数
  appId: number | string;//AB应用ID
  expIds: Array<string | number>;//实验id集合
  env: "production" | "development";//环境    development|production
  authType: "jwt" | "token";	//鉴权方式     token|jwt
  requestFn: (url: string, params: object) => Promise<any>; //请求实例  返回promise对象
}
``` 
（2）使用
``` 
import AbTestSdk from 'ab-test-sdk/dist/weappSensors';
//实例化SDK
export const abTest = new AbTestSdk({
  appId: '522065064467890257', 
  expIds: [		       
    '522065614693466192',   
    '522065518568407106',
  ],												
  env: 'development', 		
  authType: 'token',	
  requestFn: (url, parmas) => { 
    return request({		
      method: 'post',
      url,
      data: parmas,
      isNeedAuth: true,
    });
  },
});
//Sensors实例会挂载在abTest上，通过abTest.sensors访问。
console.log(abTest.sensors)
//登录之后调用
abTest.init()
//获取实验受众有三个方法fetchCacheABTest、asyncFetchABTest、fastFetchABTest依次是从缓存中获取；优先从缓存中获取、没有则请求接口获取；直接请求接口获取.三个方法可使用方式一致，如下：
//promise方式：
abTest.fastFetchABTest({ expId: '523570893788557370' }).then((data)=>{
	console.log(data)
})
//回调方式
abTest.fastFetchABTest({ expId: '523570893788557370',callBack:(data)=>{
	console.log(data)
} })
     // data={  
                appId: "522065064467890257" ,
                expId: "523570893788557370" ,
                groupId: "523570893788557368",
                sensorEventKey:"align_exp",
                variableKey: "button_align",
                variableType: "string",
                variableValue: "left"
           	 }
            根据variableValue做AB。
    
    
```   

## 一、h5对接 （未测试）
### 1、已经集成神策SDK项目接入
#### 参数说明：

``` 
interface AbTestSdkOptions {
  sensors?: any;//将项目神策实例传入abSdk
  appId: number | string;//AB应用ID
  expIds: Array<string | number>;//实验id集合
  env: "production" | "development";//环境    development|production
  authType: "jwt" | "token";	//鉴权方式     token|jwt
  requestFn: (url: string, params: object) => Promise<any>; //请求实例  返回promise对象
}
``` 
	
#### 接入示例与小程序一致引入文件不同：
``` 
    import AbTestSdk from 'ab-test-sdk/dist/h5
```
### 2、未集成神策SDK项目接入
  ``` 
    import AbTestSdk from 'ab-test-sdk/dist/h5Sensors
```
