
namespace FontShape {

    export interface VerticalBounds {
        upper: paper.Path;
        lower: paper.Path;
    }

    export interface FontSpecifier {
        family: string;
        variant: string;
    }

    export interface FontFamily {
        kind?: string;
        family?: string;
        category?: string;
        variants?: string[];
        subsets?: string[];
        version?: string;
        lastModified?: string;
        files?: { [variant: string]: string; };
    }

}