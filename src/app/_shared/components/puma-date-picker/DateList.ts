class Node {
    public data;
    public next;
}

// tslint:disable-next-line:max-classes-per-file
export class DateList<T> {
    public head = new Node();
    constructor() {
        this.head = null;
    }

    public addToHead(data) {
        let newNode = new Node();
        newNode.data = data;
        if (!this.head) { return this.head = newNode; }
        newNode.next = this.head;
        this.head = newNode;
    }

    public getNode(data): Node {
        let node = this.head;
        while (node) {
            if (node.data === data) { return node; }
            node = node.next;
        }
    }
}
