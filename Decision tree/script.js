function decisionTree(){
    const file = document.getElementById("fileInput");
    let data;
    const reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = function () {
        data = readFile(reader.result);
    }
    console.log(data);
}

function getMatrixfromFile(text){
    let data = [];
    for (let i = 0; i < text.length; i++){
        let row = "";
        let j = 0;
        while(text[j] != '\n'){
            row += text[j];
            j++;
        }
        data.push(row.split(/,(?=[^\s])/));
    }
    return data;
}