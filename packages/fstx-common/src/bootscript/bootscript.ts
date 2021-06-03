import { h, VNode } from "snabbdom";

export interface MenuItem {
    content: any,
    options?: Object
}

export function dropdown(
    args: {
        id: string,
        content: any,
        items: MenuItem[]
    }): VNode {

    return h('div.dropdown', [
        h('button.btn.btn-default.dropdown-toggle',
            {
                'attrs': {
                    id: args.id,
                    type: 'button',
                    'data-toggle': 'dropdown',
                    className: 'btn btn-default dropdown-toggle',
                },
            },
            [
                args.content,
                h('span.caret'),
            ]),
        h('ul.dropdown-menu',
            {},
            args.items.map(item =>
                h('li',
                    {},
                    [
                        h('a', item.options || {}, [item.content]),
                    ],
                ),
            ),
        ),
    ])

}
