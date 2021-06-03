import $ from 'jquery'

export class S3Access {
    /**
     * Upload file to application S3 bucket.
     * Returns upload URL as a promise.
     */
    static putFile(fileName: string, fileType: string, data: Blob | string)
        : JQueryPromise<string> {

        // https://github.com/aws/aws-sdk-js/issues/190
        if (navigator.userAgent.match(/Firefox/) && !fileType.match(/;/)) {
            const charset = '; charset=UTF-8'
            fileType += charset
        }

        const signUrl = `/api/storage/access?fileName=${fileName}&fileType=${fileType}`
        // get signed URL
        return $.getJSON(signUrl)
            .then(
                signResponse => {

                    // PUT file
                    const putRequest = {
                        method: 'PUT',
                        cache: false,
                        url: signResponse.signedRequest,
                        headers: {
                            'x-amz-acl': 'public-read',
                        },
                        data: data,
                        processData: false,
                        contentType: fileType,
                        accept: 'application/json',
                    }

                    return $.ajax(putRequest)
                        .then(
                            putResponse => {
                                console.log('uploaded file', signResponse.url)
                                return signResponse.url
                            },
                            err => {
                                console.error('error uploading to S3', err)
                            })
                },
                err => {
                    console.error('error on /api/storage/access', err)
                })
    }

    /**
     * Download file from bucket
     */
    static getJson(fileName: string): JQueryPromise<Object> {
        return this.getFileUrl(fileName)
            .then(response => {
                console.log('downloading', response.url)
                return $.ajax({
                    url: response.url,
                    dataType: 'json',
                    cache: false,
                })
            })
    }

    static getFileUrl(fileName: string) {
        return $.ajax({
            url: `/api/storage/url?fileName=${fileName}`,
            dataType: 'json',
            cache: false,
        })
    }
}