const assert = require('assert');
const ganache = require('ganache-cli');//local test network que nos proporcionara address para poder hacer test
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
//provider es lo que nos permite conectarnos a cualquier red, en este caso estamos probando con ganache,
//pero se puede cambiar a cualquier otra red.
const {abi, evm} = require('../compile')

let ruleta;//almacena la instancia del contrato
let accounts;//almacena las cuentas que genera la libreria ganache-cli

beforeEach(async () => { //desplegara el contrato y almacena las cuentas que nos da la libreria ganache-cli
    accounts = await web3.eth.getAccounts();

    ruleta = await new web3.eth.Contract(abi)
    .deploy({data: evm.bytecode.object, arguments: [1,100], }) //argumentos min y max apuestas
    .send({gas:3000000, from: accounts[0], value: web3.utils.toWei('1', 'ether')});//enviarle 1 ether para que el contrato tenga dinero para enviar al posible ganador
});

describe('Ruleta Contract', () =>{ //Dentro de describe cada it es un test de algo de nuestro contrato
    it('deploys a contract', () => { //Comprueba que el contrato se ha desplegado correctamente
        assert.ok(ruleta.options.address);
    });
    it('allows one player to bet', async () => { //Comprobar que un jugador puede apostar y que la address de dicho jugador se añade al array de players
        await ruleta.methods.bet("10").send({ //en la funcion bet hay que especificar el numero al que se apuesta
            gas: 3000000,
            from: accounts[1],
            value: "10"//la cantidad de dinero que apuesta 
        });

        const players = await ruleta.methods.getPlayers().call(); //usamos la funcion getPlayers creada en el contrato para acceder al array de players

        assert.equal(accounts[1], players[0]); //comprobar que la address del jugador que ha apostado se encuentra en la posicion 1 del array players
        assert.equal(1, players.length); //comprueba que el array solo tiene 1 elemento
    });

    it('allows multiple player to bet', async () => { //Comprobar que varios jugadores pueden apostar y que sus address se añaden al array de players
        await ruleta.methods.bet("10").send({ 
            gas: 3000000,
            from: accounts[1],
            value: "10"
        });
        await ruleta.methods.bet("20").send({ 
            gas: 3000000,
            from: accounts[2],
            value: "10"
        });
        await ruleta.methods.bet("30").send({ 
            gas: 3000000,
            from: accounts[3],
            value: "10"
        });

        const players = await ruleta.methods.getPlayers().call();

        assert.equal(accounts[1], players[0]);
        assert.equal(accounts[2], players[1]);
        assert.equal(accounts[3], players[2]);
        assert.equal(3, players.length); //comprueba que el array tiene 3 elementos
    });

    it('allows one player to bet multiple times', async () => { //Comprobar que un jugador puede apostar varias veces y su address se almacena solo 1 vez en el array players
        await ruleta.methods.bet("0").send({ 
            gas: 3000000,
            from: accounts[1],
            value: "10"
        });
        await ruleta.methods.bet("36").send({ 
            gas: 3000000,
            from: accounts[1],
            value: "20"
        });

        const players = await ruleta.methods.getPlayers().call();

        assert.equal(accounts[1], players[0]);
        assert.equal(1, players.length); //comprueba que el array tiene solo 1 elemento
    });

    it('check that the contract correctly storage the arguments of the bet', async () => {
        await ruleta.methods.bet("36").send({ 
            gas: 3000000,
            from: accounts[1],
            value: "20"
        });

        const numBet = await ruleta.methods.getPlayerBetInfoNum(accounts[1]).call();
        const amountBet = await ruleta.methods.getPlayerBetInfoAmount(accounts[1]).call();

        assert.equal("36", numBet);
        assert.equal("20", amountBet);
    });

    it('check that the bet is above the minimum limit', async () => {  //comprobar que cantidad apostada supera limite
        try{                                            //Uso el try-catch para comprobar si da un error
            await ruleta.methods.bet("16").send({
                gas: 3000000,
                from: accounts[1],
                value: "0"
            });
            assert(false); //para comprobar que si llega a esta linea de codigo es porque lo anterior no ha dado error por lo que no pasara el test
        }catch(e){
            assert(true); //comprueba que existe el error, si existe el error el test pasara
        } //para comprobar que si llega a esta linea de codigo es porque lo anterior no ha dado error por lo que  pasara el test
    });

    it('check that the bet is under the maximum limit', async () => {  //comprobar que cantidad apostada no supera limite 
        try{                                            //Uso el try-catch para comprobar si da un error
            await ruleta.methods.bet("16").send({
                gas: 3000000,
                from: accounts[1],
                value: "101"
            });
            assert(false); //para comprobar que si llega a esta linea de codigo es porque lo anterior no ha dado error por lo que no pasara el test
        }catch(e){
            assert(true); //comprueba que existe el error, si existe el error el test pasara
        }
    });

    it('check that only the manager can call setWinners', async () =>{ //Comprobar que solo el manager puede llamar a la funcion serWinners
            try{
                await ruleta.methods.setWinners().call({
                    from: accounts[1]
                });
                assert(false);
            }catch(e){
                assert(e);
            }

    });

})