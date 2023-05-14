function generateLabyrinth(){
    if(!n){
        alert("Создайте карту!");
        return;
    }

    createTableMarkup();
    map = getMatrix(1);

	let array_of_even_numbers = [];
	for (let i = 0; i < n; i++){
		if(getEven(i)){
			array_of_even_numbers.push(i);
		}
	}
	
	const start_x = getRandomFrom(array_of_even_numbers);
	const start_y = getRandomFrom(array_of_even_numbers);

	let removing = {
		x: start_x,
		y: start_y
	};

	setField(start_x, start_y, 0);
	
	while (!getLabirint()) {
		moveRemoving();
	}

	matrix = map.slice();

    colorMap();

	return;

	function getEven(n) {
		return n % 2 === 0;
	}

	function getLabirint () {
		for (let x = 0; x < n; x++) {
			for (let y = 0; y < n; y++) { 
				if (getEven(x) && getEven(y) && getField(x, y) === 1) {
					return false;
				}
			}
		}
		return true;
	}

	function getRandomFrom(array) {
		const index = Math.floor(Math.random() * array.length);
		return array[index];
	}
	

	function setField (x, y, value) {
		if (x < 0 | x >= n | y < 0 | y >= n) {
			return null;
		};
		map[x][y] = value;
	}

	function getField(x, y) {
		if (x < 0 | x >= n | y < 0 | y >= n) {
			return null;
		}
		return map[x][y];
	}

	function moveRemoving() {
		const directs = [];
		if (removing.x > 0) {
			directs.push("l");
		};
		if (removing.x < n - 2) {
			directs.push("r");
		};	
		if (removing.y > 0) {
			directs.push("u");
		};
		if (removing.y < n - 2) {
			directs.push("d");
		};
		const direct = getRandomFrom(directs);
		switch (direct) {
			case "l":
				if (getField(removing.x - 2, removing.y) === 1) {
					setField(removing.x - 1, removing.y, 0);
					setField(removing.x - 2, removing.y, 0);
				};
				removing.x -= 2;
				break;
			case "r":
				if (getField(removing.x + 2, removing.y) === 1) {
					setField(removing.x + 1, removing.y, 0);
					setField(removing.x + 2, removing.y, 0);
				};
				removing.x += 2;
				break;
			case "u":
				if (getField(removing.x, removing.y - 2) === 1) {
					setField(removing.x, removing.y - 1, 0);
					setField(removing.x, removing.y - 2, 0);
				};
				removing.y -= 2
				break;
			case "d":
				if (getField(removing.x, removing.y + 2) === 1) {
					setField(removing.x, removing.y + 1, 0);
					setField(removing.x, removing.y + 2, 0);
				};
				removing.y += 2;
				break;
		}
	}
}
