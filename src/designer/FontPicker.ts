
declare var ReactSelect;

interface FontPickerProps {
    store: Store;    
    selection?: FontDescription;
    selectionChanged: (selection: FontDescription) => void;
}

interface FontPickerState {
    familyObject?: FontFamily;
    variant?: string;
}

class FontPicker extends React.Component<FontPickerProps, FontPickerState> {
    
    previewFontSize = "28px";
    
    constructor(props: FontPickerProps){
        super(props);
        
        this.state = {};
        
        if(this.props.selection){
            this.state.familyObject = this.props.store.resources.fontFamilies[this.props.selection.family];
            this.state.variant = this.props.selection.variant;
        }
    }
    
    render() {
        const familyOptionRender = (option) => {
            const fontFamily = option.value;
            return rh("div", {
                style: {
                    fontFamily,
                    fontSize: this.previewFontSize
                }
            }, [fontFamily]);
        };
        const variantOptionRender = (option) => {
            const fontVariant = option.value;
            const style = <any>FontHelpers.getCssStyle(this.state.familyObject.family, fontVariant);
            style.fontSize = this.previewFontSize;
            return rh("div", { style }, 
               [`${this.state.familyObject.family} ${option.value}`]);
        };
        
        return rh("div",
        {
            className: "font-picker"
        },
        [
            rh(ReactSelect, { 
                name: "font-family", 
                key: "font-family",
                className: "font-family", 
                value: this.state.familyObject && this.state.familyObject.family,
                clearable: false,
                options: this.getFamilyOptions(), 
                optionRenderer: familyOptionRender,
                valueRenderer: familyOptionRender,
                onChange: (f) => {
                    const familyObject = this.props.store.resources.fontFamilies[f];
                    const variant = _.last(familyObject.variants
                        .filter(v => v.indexOf("italic") < 0)); 
                    this.setState({ 
                        familyObject,
                        variant
                    },
                    () => this.sendSelectionChanged());
                }
            }),
            // only show for multiple variants
            this.state.familyObject && this.state.familyObject.variants.length > 1 &&
            rh(ReactSelect, { 
                name: "font-variant", 
                key: "font-variant",
                className: "font-variant", 
                clearable: false,
                value: this.state.variant,
                options: this.state.familyObject && this.state.familyObject.variants.map(v => {
                    return { value: v, label: v };
                }), 
                optionRenderer: variantOptionRender,
                valueRenderer: variantOptionRender,
                onChange: (value) => {
                    this.setState({ 
                        familyObject: this.state.familyObject,
                        variant: value 
                    }, 
                        () => this.sendSelectionChanged() );
                }
            }),
        ]);
    }

    private sendSelectionChanged(){
        this.props.selectionChanged(
            <FontDescription>{
                family: this.state.familyObject.family,
                variant: this.state.variant,
                category: this.state.familyObject.category,
                url: this.state.familyObject.files[this.state.variant]
            }
        );
    }
    
    private getFamilyOptions(): { value: FontFamily, label: string}[] {
 
        const options = _.values(this.props.store.resources.fontFamilies)
            .map((fontFamily: FontFamily) => 
                { return { value: fontFamily.family, label: fontFamily.family }; });
        return options;
    }
}
