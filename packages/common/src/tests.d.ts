module 'node:test' {
    interface TestContext {
        assert:{
            ok(value:any, message?:string):void;
            snapshot(value:any, message?:string):void;
        }
    }

}