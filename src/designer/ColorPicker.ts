namespace ColorPicker {

    const DEFAULT_PALETTE = [
        [
            "#000", "#666", "#ccc", "#eee", "#fff"
        ],
        [
            // http://www.color-hex.com/color-palette/807
            "#ee4035",
            "#f37736",
            "#fdf498",
            "#7bc043",
            "#0392cf",
        ],
        [
            // http://www.color-hex.com/color-palette/894
            "#edc951",
            "#eb6841",
            "#cc2a36",
            "#4f372d",
            "#00a0b0",
        ],
        [
            // http://www.color-hex.com/color-palette/164
            "#1b85b8",
            "#5a5255",
            "#559e83",
            "#ae5a41",
            "#c3cb71",
        ],
        [
            // http://www.color-hex.com/color-palette/389
            "#4b3832",
            "#854442",
            "#fff4e6",
            "#3c2f2f",
            "#be9b7b",
        ],
        [
            // http://www.color-hex.com/color-palette/455
            "#ff4e50",
            "#fc913a",
            "#f9d62e",
            "#eae374",
            "#e2f4c7",
        ],
        [
            // http://www.color-hex.com/color-palette/700
            "#d11141",
            "#00b159",
            "#00aedb",
            "#f37735",
            "#ffc425",
        ],
        [
            // http://www.color-hex.com/color-palette/826
            "#e8d174",
            "#e39e54",
            "#d64d4d",
            "#4d7358",
            "#9ed670",
        ],
        [
            // http://www.color-hex.com/color-palette/1223
            "#ffd4e5",
            "#d4ffea",
            "#eecbff",
            "#feffa3",
            "#dbdcff",
        ]
    ];

    export function setup(elem, topColors: string[], onChange) {
        const topColorsGrouped = _.chunk(topColors, 8);
        const palette = topColorsGrouped.concat(DEFAULT_PALETTE);
        
        let sel = <any>$(elem);
        (<any>$(elem)).spectrum({
            showInput: true,
            allowEmpty: true,
            preferredFormat: "hex",
            showButtons: false,
            showAlpha: true,
            showPalette: true,
            showSelectionPalette: false,
            palette: palette,
            localStorageKey: "sketchtext",
            change: onChange
        });
    };

    export function set(elem: HTMLElement, value: string) {
        (<any>$(elem)).spectrum("set", value);
    }

    export function destroy(elem) {
        (<any>$(elem)).spectrum("destroy");
    }
}
