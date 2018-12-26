var localKey = 'admin';

var common = {
    /**
     * 3.设置本地存储(html5存储，浏览器必须支持)
     */
    storage:{
        setItem : function( key, value ) {
        	key = localKey + key;
            value = JSON.stringify( value );
            localStorage.setItem( key, value ); 
        },
        getItem:function( key ) {   
        	key = localKey + key;
            return JSON.parse( localStorage.getItem( key ) );
        },
        removeItem:function( key ) {
        	key = localKey + key;
            localStorage.removeItem( key );
        }
    }
};
export default common ;