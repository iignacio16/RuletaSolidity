const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi, evm} = require('./compile')

//Especificara que cuenta usar para desplegar el contrato y el nodo al que se conectara
const provider = new HDWalletProvider(
    //account pneumonic (12 palabras de seguridad de metamask, que te da acceso a clave pública, privada y a la cuenta de la cartera)
    'trade rifle direct vehicle almost smoke social earn spider engage divert answer',
    //Segundo argumento, link o url a la red que te quieres conectar, se obtiene desde Infura
    'https://goerli.infura.io/v3/25d4ab467a584f0a9ff58033ab904d68'
);

const web3 = new Web3(provider);
//ESta instancia de web3, tendrá una fuente de eth, (nuestra cuenta de metamask) y una red en la que desplegarse
//Por lo que se puede usar esta instancia 'web3' para interactuar con la red Goerli, para enviar eth, desplegar, actualizar contratos...

//Se crea una función para poder utilizar la async await syntax, ya que desplegar un contrato y tener acceso a las cuentas de ganache
//son promesas
const deploy = async () => {
    const accounts = await web3.eth.getAccounts(); 
    //Lista de las cuentas que tiene desbloqueadas el HDWalletProvider, ya que las 12 palabras no solo desbloquea una cuenta si no varias
    //ya que dentro de tu metamask puedes crear varias cuentas, en este caso utilizaremos la primera cuenta para desplegar nuestro contrato

    console.log("Adress de la cuenta que va a desplegar el contrato", accounts[0]); 

    const result = await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object, arguments: [1,100], }) //argumentos min y max apuestas
        .send({gas:3000000, from: accounts[0], value: web3.utils.toWei("1", "ether")}); //enviarle 1 ether para que el contrato tenga dinero para enviar al posible ganador
    
    console.log(abi);
    console.log('Contract deployed to', result.options.address);//Para saber en que adress se ha desplegado nuestro contrato
    //provider.engine.stop();
};

deploy();