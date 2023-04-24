function generateMaze () {
    map = getMatrix(1);
	function isEven (n) {
		return n % 2 === 0;
	}
	function getRandomFrom (array) {
		const index = Math.floor(Math.random() * array.length);
		return array[index];
	}
	const startX = getRandomFrom(Array(n).fill(0).map((item, index) => index).filter(x => isEven(x)));
	const startY = getRandomFrom(Array(n).fill(0).map((item, index) => index).filter(x => isEven(x)));
	var tractor = {};
	tractor.x = startX;
	tractor.y = startY;
	function setField (x, y, value) {
		if (x < 0 || x >= n || y < 0 || y >= n) {
			return null;
		};
		map[y][x] = value;
	}
	setField(startX, startY, 0);
	function isMaze () {
		for (let x = 0; x < n; x++) {
			for (let y = 0; y < n; y++) { 
				if (isEven(x) && isEven(y) && getField(x, y) === 1) {
					// то карта с лабиринтом не готова
					return false;
				}
			}
		}
		return true;
	}
	while (!isMaze()) {
		moveTractor();
	}
	return map;
	function getField (x, y) {
		if (x < 0 || x >= n || y < 0 || y >= n) {
			return null;
		}
		return map[y][x];
	}
	function moveTractor () {
		const directs = [];
		if (tractor.x > 0) {
			directs.push('left');
		};
		if (tractor.x < n - 2) {
			directs.push('right');
		};	
		if (tractor.y > 0) {
			directs.push('up');
		};
		if (tractor.y < n - 2) {
			directs.push('down');
		};
		const direct = getRandomFrom(directs);
		switch (direct) {
			case 'left':
				if (getField(tractor.x - 2, tractor.y) === 1) {
					setField(tractor.x - 1, tractor.y, 0);
					setField(tractor.x - 2, tractor.y, 0);
				};
				tractor.x -= 2;
				break;
			case 'right':
				if (getField(tractor.x + 2, tractor.y) === 1) {
					setField(tractor.x + 1, tractor.y, 0);
					setField(tractor.x + 2, tractor.y, 0);
				};
				tractor.x += 2;
				break;
			case 'up':
				if (getField(tractor.x, tractor.y - 2) === 1) {
					setField(tractor.x, tractor.y - 1, 0);
					setField(tractor.x, tractor.y - 2, 0);
				};
				tractor.y -= 2
				break;
			case 'down':
				if (getField(tractor.x, tractor.y + 2) === 1) {
					setField(tractor.x, tractor.y + 1, 0);
					setField(tractor.x, tractor.y + 2, 0);
				};
				tractor.y += 2;
				break;
		}
	}

}