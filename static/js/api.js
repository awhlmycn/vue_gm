import axios from 'axios';
var host = process.env.API_ROOT;
axios.defaults.baseURL = host;
// 拦截器
axios.interceptors.request.use( 
	function ( config ) {// 处理请求之前的配置
		config.headers = {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
 		return config;
 	},
	function( error ) { // 请求失败的处理
 		return Promise.reject( { code : 500, errMsg : error } );
 	}
);
var apiRequest = {
	get( url, data ) {
		return axios.get( url, data )
		.then( response => {
		    return response.data;
		})
		.catch( error => {
		    return { code : 500, errMsg : error };
		});
	},
	post( url, data ) {
		return axios.post( url, data )
		.then( response => {
		    return response.data;
		})
		.catch( error => {
		    return { code : 500, errMsg : error };
		});
	}
};

export default apiRequest;