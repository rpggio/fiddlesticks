
interface ChangeNotifier {
    
}

class NotifyArray extends Array implements ChangeNotifier {
    onChanged: () => void;    
}
