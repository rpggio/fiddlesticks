
namespace DomHelpers {
    
    //  https://support.mozilla.org/en-US/questions/968992
    export function downloadFile(dataUrl: string, filename: string){
        var link = <any>document.createElement("a");
        link.id = newid();
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.target = "_self";
        link.click();
        document.body.removeChild(link);
    }
    
}