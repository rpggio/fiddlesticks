namespace Framework {
    
    export class SeedRandom {
        
        seed: number;
        nextSeed: number;
        
        constructor(seed: number = Math.random()){
            this.seed = this.nextSeed = seed;
        }
        
        random(): number {
            const x = Math.sin(this.nextSeed * 2 * Math.PI) * 10000;
            const result = x - Math.floor(x);
            this.nextSeed = result;
            return result;
        }
    }
    
}