export class ListItem {
	// tslint:disable:indent
	public id: number;
	public itemName: string;
}

export class MyException {
	// tslint:disable:indent
	public status: number;
	public body: any;
	constructor(status: number, body: any) {
		this.status = status;
		this.body = body;
	}
}
