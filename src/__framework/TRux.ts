
namespace TRux {

    // --- Core types ---

    type Serializable = Object | Array<any> | number | string | boolean | Date;

    type Value = number | string | boolean | Date;

    export interface ITypedItem<TItemTypes extends Value> {
        type: TItemTypes;
    }

    export interface ISubject<T> extends Rx.Observable<T>, Rx.IObserver<T> {
    }

    /**
     * Represents a stream of typed objects.
     * Provides convenience methods for filtering. 
     */
    export interface ITypedObservable<TItemTypes extends Value> extends Rx.Observable<ITypedItem<TItemTypes>> {
        typeFilter: TItemTypes[];
        //ofType(...type: TItemTypes[]): ITypedObservable<TItemTypes>;
    }

    export interface ITypedSubject<TItemTypes extends Value>
        extends ISubject<ITypedItem<TItemTypes>> {
        //ofType(...types: TItemTypes[]): ITypedObservable<TItemTypes>;
    }

    // --- Flux pipeline types ---

    /**
     * An action message to be handled by the system.
     */
    export interface Action<TActionTypes extends Value> extends ITypedItem<TActionTypes> {
        payload?: Serializable;
        error?: boolean;
        meta?: Serializable
    }

    /**
     * An event message originating from the system.
     */
    export interface Event<TEventTypes extends Value> extends ITypedItem<TEventTypes> {
        eventData?: Serializable;
        rootData?: Serializable;
        meta?: Serializable;
    }

    /**
     * A pushable stream of actions.
     */
    export interface IActionSubject<TActionTypes extends Value> extends ISubject<Action<TActionTypes>> {
        ofType(...types: TActionTypes[]): IActionObservable<TActionTypes>;
    }

    /**
     * An observable stream of actions.
     */
    export interface IActionObservable<TActionTypes extends Value> extends Rx.Observable<Action<TActionTypes>> {
        ofType(...types: TActionTypes[]): IActionObservable<TActionTypes>;
    }
    
    /**
     * A pushable stream of events.
     */
    export interface IEventSubject<TEventTypes extends Value> extends ISubject<Event<TEventTypes>> {
        ofType(...types: TEventTypes[]): IEventObservable<TEventTypes>;
    }

    /**
     * An observable stream of events.
     */
    export interface IEventObservable<TEventTypes extends Value> extends Rx.Observable<Event<TEventTypes>> {
        ofType(...types: TEventTypes[]): IEventObservable<TEventTypes>;
    }

    /**
     * Static facade for accessing TRux features.
     */

    export function newActionSubject<TActionTypes extends Value>(): IActionSubject<TActionTypes> {
        let subject = new Rx.Subject<Action<TActionTypes>>();
        mixinTypedSubject(subject);
        return subject as any as IActionSubject<TActionTypes>;
    }

    export function newEventSubject<TEventTypes extends Value>(): IEventSubject<TEventTypes> {
        let subject = new Rx.Subject<Event<TEventTypes>>();
        mixinTypedSubject(subject);
        return subject as any as IEventSubject<TEventTypes>;
    }

    /**
     * Adds methods to subject, returing same instance as passed.
     */
    export function mixinTypedSubject<TItemTypes extends Value>(subject: ISubject<ITypedItem<TItemTypes>>): 
        ITypedSubject<TItemTypes> {
        let typed = subject as any;
        if (typed.ofType) {
            // already has mixin
            return typed;
        }
        typed.ofType = (...types: TItemTypes[]): ITypedObservable<TItemTypes> => {
            let result: ITypedObservable<TItemTypes>;
            if (!types || types.length === 0) {
                result = subject.concat() as any as ITypedObservable<TItemTypes>;
            }
            else if (types.length === 1) {
                let type = types[0];
                result = subject.filter(a => a.type === type) as any as ITypedObservable<TItemTypes>;
            } else {
                result = subject.filter(a => types.indexOf(a.type) >= 0) as any as ITypedObservable<TItemTypes>;
            }
            result.typeFilter = types;
            return result;
        }
        return typed;
    }

}

