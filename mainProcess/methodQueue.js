"use strict";
class methodItem
{
    constructor( mq , method, isAsync, args )
    {
        this._mq = mq;
        this._method = method;
        this._isAsync = isAsync;
        this._args = args;
    }

    execute()
    {
        this._method.apply( null,  this._args );
        if (!this._isAsync) this._mq.next() ;
    }
}
class methodQueue
{
    constructor()
    {
        this._methodList = [];
    }

    addItem(method, isAsync, args)
    {
        this._methodList.push( new methodItem( this, method, isAsync, args ) ) ;
    }

    next()
    {
        let len = this._methodList.length;
        if( len > 0 ) this._methodList.shift().execute();
    }
}

module.exports = methodQueue;