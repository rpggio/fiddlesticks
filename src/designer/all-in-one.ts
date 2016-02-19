
// interface Intent {
//     tag: string;
//     action: string;
//     data: any;
// }

// const Dispatcher = new Rx.Subject<Intent>();

// const UserList$ = Dispatcher
//     .filter(x => x.action === 'ListUsers');
    
// // const UserList$ = Dispatcher
// //     .filter(x => x.action === 'ListUsers')
// //     // Fetch a list of users from GitHub.
// //     .flatMap(() => Rx.DOM.getJSON('https://api.github.com/users'))
// //     // Format the response. Carry the action through.
// //     .map(users => ({action: 'ListUsers', data: users}))
// //     // Cache the response so multiple subscribers can grab
// //     // this data without triggering redundant ajax requests.
// //     .shareReplay(1);

// const store$ = Rx.Observable.merge(UserList$);

// const ListView$ = store$
//     .filter(x => x.action === 'ListUsers')
//     .map(function({data}) {
//         return (
//             h('ul', [
//                 data.map(login => h('li'))
//             ])
//         );
//     });

// const userDetail$ = Dispatcher
//     .filter(x => x.tag === 'UserDetail')
//     .pluck('data', 'login')
//     .flatMap(login => Rx.DOM.getJSON(`https://api.github.com/users/${login}`))
//     .map(x => ({tag: 'UserDetail', data: x}))
//     .shareReplay(1);
    
// const allViews$ = Rx.Observable.merge(userDetail$);

// allViews$.subscribe(function(content) {
//     ReactiveDom.render(content,
//         document.querySelector('#content'));
// });


