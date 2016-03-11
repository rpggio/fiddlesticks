
namespace S3Access {

    /**
     * Upload file to application S3 bucket
     */
    export function putFile(fileName: string, fileType: string, data: Blob|string) {
        const signUrl = `/api/storage/access?fileName=${fileName}&fileType=${fileType}`;
        // get signed URL
        $.getJSON(signUrl)
            .done(signResponse => {
                
                // PUT file
                const putRequest = {
                    method: "PUT",
                    url: signResponse.signedRequest,
                    headers: {
                        "x-amz-acl": "public-read"
                    },
                    data: data,
                    processData: false,
                    contentType: fileType
                };
                $.ajax(putRequest)
                .done(putResponse => {
                    console.log("uploaded file", signResponse.url)
                })
                .fail(err => {
                    console.error("error uploading to S3", err);
                });
                
            })
            .fail(err => {
                console.error("error on /api/storage/access", err);
            });
    }
    
    /**
     * Download file from bucket
     */
    export function getFile(fileName: string): JQueryPromise<any> {
        return $.getJSON(`/api/storage/url?fileName=${fileName}`)
            .then(response => {
                console.log("downloading", response.url);
                return $.getJSON(response.url);
            });
    }
    
}