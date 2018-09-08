export class ByNameController {
	constructor(
		$scope,
		$state,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$scope,
			$state,
			firebase,

			collapse: [],
			data: [],
			dataLoaded: false,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.formatData(data);
						this.dataLoaded = true;
						this.$scope.$digest();
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}

	formatData(rawData) {
		const rawFilesizes = new Array(27);
		const contents = new Array(27);
		const filesizes = new Array(27);
		const keys = new Array(27);

		for (let i = 0; i < contents.length; i++) {
			this.data[i] = {};
			contents[i] = [];
			filesizes[i] = "";
			rawFilesizes[i] = 0;

			if (i === 0) {
				keys[i] = "#";
			} else {
				keys[i] = String.fromCharCode(i + 64);
			}
		}

		rawData.map((data) => {
			if (data.inhdd === 1) {
				const currCharCode = data.title[0].toLowerCase().charCodeAt();

				if (currCharCode >= 48 && currCharCode <= 57) {
					rawFilesizes[0] += data.filesize;

					data.filesize = this._convertFilesize(data.filesize);
					contents[0].push(data);
				} else if (currCharCode >= 97 && currCharCode <= 122) {
					rawFilesizes[currCharCode - 96] += data.filesize;

					data.filesize = this._convertFilesize(data.filesize);
					contents[currCharCode - 96].push(data);
				}
			}
		});

		rawFilesizes.forEach((element, index) => {
			filesizes[index] = this._convertFilesize(element);
		});

		contents.forEach((element, index) => {
			this.collapse.push(false);

			_.extend(this.data[index], {
				content: contents[index].sort(this._sortByTitle),
				filesize: filesizes[index],
				key: keys[index],
				panel: index,
			});
		});
	}

	panelCollapse(panel) {
		this.collapse[panel - 1] = !this.collapse[panel - 1];
	}

	_convertFilesize(filesize) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return "-";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}

	_sortByTitle(a, b) {
		if (a.title > b.title) {
			return 1;
		}

		if (a.title < b.title) {
			return -1;
		}

		return 0;
	}
}
