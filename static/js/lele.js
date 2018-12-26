var localKey = 'admin';

var lele = {
    intval( v ) {
        if ( v === undefined || v === null || v === false || typeof v == 'object' ) return 0;
        if ( v === true ) return 1;

        var tmp = parseInt( v ); //Number( v ),其实用Number转换更好
        if ( isNaN( tmp ) ) return 0;
        return tmp;
    },
    /**
     * 1.获取当前的时间
     * @param  time ：秒
     * @return  2018-5-28 15:58:01
     * @return  加上new Date : 2018-05-28T08:00:41.000Z
     */
    toLocaleString( time ) {
        var time = time ? new Date( time * 1000 ) : new Date();
        return new Date( time.toLocaleString() );
    },
    /*
        2.获取时间  yyyy-mm-dd : mm:ss
     */
    formatTime( hms, d ) {
        var date = d ? new Date( d * 1000 ) : new Date();
        var str = date.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate();
        if(hms)
        {
            str += ' ' + date.getHours() + ':' +  date.getMinutes() + ':' + date.getSeconds();
        }
        return str;
    },
    /**
     * 3.将data : [{ uid : 11,nickname:'kilmy' }]  转为  [111,'kilmy']
     * filterVal ：过滤的字段 [ 'uid', 'nickname' ]
     * jsonData : [{ uid : 11,nickname:'kilmy' }] 
     */
    formatJson( filterVal, jsonData ) {
        return jsonData.map( v =>
            filterVal.map( j => {
               return v[j]
            })
        )
    },
    toTimeTZ( time ) {
        if( lele.intval( time ) == 0 ) {
            return lele.formatTime( true )
        }
        return new Date( time ).toISOString().replace( /T/g, ' ').replace(/\.[\d]{3}Z/, '');
    }
};
export default lele ;