// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Ruleta {
    address public manager; //Creador del contrato
    address payable[] private players; //Array con los address de los jugadores que apuestan
    address payable[] private winners;//Array con los address de los ganadores
    uint public minBet;
    uint public maxBet;

    struct betInfo { //Informacion de la apuesta de los jugadores
        uint[] amountBet;
        uint[] numberBet;
    }

    //Cada address de jugador tendra asignada una info de la apuesta realizada
    mapping (address => betInfo) private playersBetInfo;
    mapping (address => bool) private playersBet; //Jugadores que ya han apostado

    modifier restricted() {
    require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimun, uint256 maximun) payable {
        require(msg.value >= 1 ether);
        manager = msg.sender;
        minBet = minimun;
        maxBet = maximun;
    }

    function getPlayerBetInfoNum(address add) public view returns(uint256[] memory){
        return playersBetInfo[add].numberBet; 
    }

    function getPlayerBetInfoAmount(address add) public view returns(uint256[] memory){
        return playersBetInfo[add].amountBet;
    }

    function getPlayers() public view returns(address payable[] memory){
        return players;
    }

    function getWinners() public view returns(address payable[] memory){
        return winners;
    }

    function bet(uint num) public payable{
        require(msg.sender != manager);
        require(msg.value >= minBet);
        require(msg.value <= maxBet);
        require(num < 37);
        
        playersBetInfo[msg.sender].numberBet.push(num);
        playersBetInfo[msg.sender].amountBet.push(msg.value);

        if(!playersBet[msg.sender]){
            players.push(payable(msg.sender));
            playersBet[msg.sender] = true;
        }
    }

    function randomNumBetween0and36() public view returns(uint) {
        return uint (keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)))
        % 37;
    }

    function setWinners() public restricted returns(address payable[] memory){
        uint ruletaNum = randomNumBetween0and36();
        winners = new address payable[](0);

        for(uint i = 0; i < players.length; i++){
            address payable playerAddress = players[i];

            for(uint j = 0; j < playersBetInfo[playerAddress].numberBet.length; j ++){
               
                if(playersBetInfo[playerAddress].numberBet[j] == ruletaNum){
                    playerAddress.transfer(playersBetInfo[playerAddress].amountBet[j] * 36);
                    winners.push(payable(playerAddress));
                }
            }
        delete playersBetInfo[playerAddress];
        delete playersBet[playerAddress];
        }
        players = new address payable[](0);
        return winners;
    }
} 