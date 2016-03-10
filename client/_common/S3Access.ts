
namespace S3Access {

    /**
     * Upload file to application S3 bucket
     */
    export function upload(fileName: string, fileType: string, data: Blob) {
        const signUrl = `/sign_s3?file_name=${fileName}&file_type=${fileType}`;
        // get signed URL
        $.getJSON(signUrl)
            .done(signResponse => {
                
                // PUT file
                const putRequest = {
                    method: "PUT",
                    url: signResponse.signed_request,
                    headers: {
                        'x-amz-acl': 'public-read'
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
                console.error("error on sign_s3", err);
            });
    }
    
}