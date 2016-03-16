
namespace S3Access {

    /**
     * Upload file to application S3 bucket
     */
    export function putFile(fileName: string, fileType: string, data: Blob | string) {

        // https://github.com/aws/aws-sdk-js/issues/190   
        if (navigator.userAgent.match(/Firefox/) && !fileType.match(/;/)) {
            var charset = '; charset=UTF-8';
            fileType += charset;
        }

        const signUrl = `/api/storage/access?fileName=${fileName}&fileType=${fileType}`;
        // get signed URL
        $.getJSON(signUrl)
            .done(signResponse => {

                // PUT file
                const putRequest = {
                    method: "PUT",
                    cache: false,
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
        return $.ajax({
            url: `/api/storage/url?fileName=${fileName}`,
            dataType: "json",
            cache: false
        })
            .then(response => {
                console.log("downloading", response.url);
                return $.ajax({
                    url: response.url,
                    dataType: "json",
                    cache: false
                });
            });
    }

}