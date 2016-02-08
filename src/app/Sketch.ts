
class Sketch implements ChangeNotifier {
    
    textBlocks: TextBlock[] = [];
    
    // this is fragile: need real pub-sub
    onChanged: () => void;
    
}