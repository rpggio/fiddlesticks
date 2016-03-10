
abstract class Component<T> {
    abstract render(data: T): VNode;
}