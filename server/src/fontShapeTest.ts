
function runTest() {

    const box = new paper.Path({
        segments: [
            new paper.Point(0, 0),
            new paper.Point(10, 0),
            new paper.Point(10, 10),
            new paper.Point(0, 10)
        ],
        closed: true
    });

    const section = new FontShape.PathSection(box, 0.1, 0.1);
    assertEqual(4, section.length);
    assertPointEqual(new paper.Point(4, 0), section.getPointAt(0));
    assertPointEqual(new paper.Point(8, 0), section.getPointAt(4));

    const sectionOverStart = new FontShape.PathSection(box, 0.9, 0.2);
    assertEqual(8, sectionOverStart.length);
    assertPointEqual(new paper.Point(0, 4), sectionOverStart.getPointAt(0));
    assertPointEqual(new paper.Point(4, 0), sectionOverStart.getPointAt(8));

}

function assertPointEqual(expected: paper.Point, actual: paper.Point){
    if (expected.subtract(actual).length > 0.0001) {
        console.error(`expected ${expected}, was ${actual}`);
    }
}

function assertEqual(expected: number, actual: number){
    if (Math.abs(expected - actual) > 0.0001) {
        console.error(`expected ${expected}, was ${actual}`);
    }
}
