namespace Fstx.Framework {

    export function createFileName(text: string, maxLength: number, extension: string): string {
        let name = "";
        for (const word of text.split(/\s/)) {
            const trim = word.replace(/\W/g, '').trim();
            if (trim.length) {
                if(name.length && name.length + trim.length + 1 > maxLength){
                    break;
                }
                if (name.length) name += " ";
                name += trim;
            }
        }
        return name + "." + extension;
    }

}