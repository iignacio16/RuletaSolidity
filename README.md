# Gambling ruleta en Solidity 

## Índice :clipboard:
1. [Descripción General](#descrepción-general)
2. [Herramientas](#Herramientas)
3. [Instalación](#instalación)
***
### Descripción General :card_file_box:
Smart contract que simula el juego de la ruleta típico de los casinos. :slot_machine:.

El Smart Contract ha sido desarrollado con el lenguaje de programación Solidity en Remix. :card_index:

Después he creado un proyecto en Vs Code, para desarrollar las files 'compile.js', 'deploy.js' y los tests correspondientes para probar el funcionamiento del mismo.:file_folder:
***
### Herramientas :hammer_and_wrench:
1. Editores de texto y lenguajes: :memo:
* [Remix](https://remix.ethereum.org/): Version 0.29.1
* [Vs Code](https://code.visualstudio.com/): Version 1.74
* [Solidity](https://docs.soliditylang.org/en/v0.8.15/): Version 0.8.15
* [JavaScript](https://www.java.com/es/download/): Version 8
* [nodejs](https://nodejs.org/en/): Version 16.18.1

2. Librerías: :books:
* Solc: Version 0.8.17
* Web3: Version 1.8.1
* Truffle/hdwallet-provider: Version 2.1.5
* Fs-extra:Version 11.1.0
* Mocha: Version 10.2.0
* Ganache-cli: Version 6.12.2

***
### Instalación :man_technologist:
Mi recomendación para poder desplegar este contrato en su ordenador:
```
mkdir nombreProyecto
```
```
npm init -y
```
```
cd nombreProyecto
```
```
mkdir contracts
```
```
mkdir test
```
Después en su editor de texto en la carpeta 'contracts' :open_file_folder: crea la file 'Ruleta.sol' :page_facing_up:. 

Y en la carpeta 'test' :open_file_folder:, crear la file 'Ruleta.test.js' :page_facing_up:.

Copiar las files correspondientes y después ejecutar el siguiente comando por consola, colocarnos dentro de 'nombreProyecto':

```
npm install solc web3 fs-extra mocha ganache-cli @truffle/hdwallet-provider
```

Añadir en la file 'package.json' :page_facing_up:: 

>   "scripts": {
    "test": "mocha"
  }

```
npm run test
```
Ejecutará los test. :heavy_check_mark:

Por último, para desplegar el contrato, en la file 'deploy.js':
* :warning: cambiar las 12 palabras para indicar las de su cuenta de Metamask :warning:
* Cambiar la url en caso de querer desplegar el contrato en una test network distinta a la de Goerli. :pencil2:
* Ejecutar el siguiente comando:
```
node depoy.js
```
:dart:
