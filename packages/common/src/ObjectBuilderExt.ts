import { ObjectBuilder, StringBuilder } from "@typespec/compiler/emitter-framework";


export class ObjectBuilderExt<T> extends ObjectBuilder<T> {
    constructor(private readonly depth = '  ') {
        super();
    }
    toStringBuilder(){
        const sb = new StringBuilder();
        sb.push('{\n');
        for(const [key, value] of this.entries){
            sb.push(this.depth);
            sb.push(key);
            sb.push(': ');
            sb.push(value);
            sb.push(',\n ');
        }
        sb.push('\n}');
        return sb;
    }
}