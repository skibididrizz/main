import { ObjectBuilder, StringBuilder } from "@typespec/compiler/emitter-framework";


class StringBuilderExt extends StringBuilder {
    toString(){
        return this.reduce();
    }
}

export function toStringBuilder(objectBuilder:ObjectBuilder<unknown>, depth = '  '){
        const sb = new StringBuilderExt();
        sb.push('{\n');
        for(const [key, value] of Object.entries(objectBuilder)) {
            sb.push(depth);
            sb.push(key);
            sb.push(': ');
            sb.push(value);
            sb.push(',\n ');
        }
        sb.push('\n}');
        return sb;
}