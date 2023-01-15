const path = require('path'); //make sure we generate a valid path
const fs = require('fs'); //fileSystem module
const solc = require('solc'); //solidty compiler de java

//__dirname, variable de node que siempre hace referencia al directorio en el que estas
const ruletaPath = path.resolve(__dirname, 'contracts', 'Ruleta.sol');
const source = fs.readFileSync(ruletaPath, 'utf8') //Almacena el codigo del archivo al que hace referencia el path

const input = {
    language: 'Solidity',
    sources:{
        'Ruleta.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*':{
                '*': ['*'],
            },
        },
    },
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Ruleta.sol'].Ruleta;

//console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts);