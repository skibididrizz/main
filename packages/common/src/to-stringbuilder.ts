import { ArrayBuilder, ObjectBuilder, StringBuilder } from "@typespec/compiler/emitter-framework";


class StringBuilderExt extends StringBuilder {
    toString(){
        return this.reduce();
    }
}

export function fromObjectBuilder(objectBuilder:ObjectBuilder<unknown>, depth = '  '){
        const sb = new StringBuilderExt();
        sb.push('{\n');
        for(const [key, value] of Object.entries(objectBuilder)) {
            sb.push(depth);
            sb.push(key);
            sb.push(': ');
            sb.push(typeof value == 'number' ? String(value) : value);
            sb.push(',\n ');
        }
        sb.push('\n}');
        return sb;
}

export function fromArrayBuilder(arrayBuilder:ArrayBuilder<unknown>, depth = '  '){
    const sb = new StringBuilderExt();
    sb.push('[\n');
    let i=1;
    for(const value of arrayBuilder) {
        sb.push(depth);
        sb.push(typeof value === 'number' ? String(value) : value);
        if (i++ < arrayBuilder.length) {
            sb.push(',\n ');
        }
    }
    sb.push('\n]');
    return sb;
}
