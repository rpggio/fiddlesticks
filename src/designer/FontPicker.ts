
declare var ReactSelect;

class FontPicker {

    constructor(container: HTMLElement) {
        var options = [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' }
        ];

        function logChange(val) {
            console.log("Selected: " + val);
        }

        const element = rh(ReactSelect, { 
            name: "form-field-name", 
            value: "one", 
            options, 
            onChange: () => console.log("select changed") }
        );

        ReactDOM.render(element, container);
    }

}
