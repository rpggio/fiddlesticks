
class FontFamiliesLoader {

    loadListLocal(callback: (families: FontFamily[]) => void) {
        $.ajax({
            url: "fonts/google-fonts.json",
            dataType: 'json',
            cache: true,
            success: (response: { kind: string, items: FontFamily[] }) => {
                callback(response.items);
            },
            error: (xhr, status, err) => {
                console.error("google-fonts.json", status, err.toString());
            }
        });
    }

    loadListRemote(callback: (families: FontFamily[]) => void) {
        var url = 'https://www.googleapis.com/webfonts/v1/webfonts?';
        var key = 'key=AIzaSyBHjV6_j4YEFpfehXOtATLoDDFdZbjYCFA';
        var sort = "popularity";
        var opt = 'sort=' + sort + '&';
        var req = url + opt + key;

        $.ajax({
            url: req,
            dataType: 'json',
            cache: true,
            success: (response: { kind: string, items: FontFamily[] }) => {
                callback(response.items);
            },
            error: (xhr, status, err) => {
                console.error(url, status, err.toString());
            }
        });
    }

    loadForPreview(families: string[]) {
        for (const chunk of _.chunk(families, 10)) {
            WebFont.load({
                classes: false,
                google: {
                    families: <string[]>chunk,
                    text: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                }
            });
        }
    }
}