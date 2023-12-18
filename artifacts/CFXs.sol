/**
 *Submitted for verification at https://evm.confluxscan.io/ on 2023-12-13
*/

// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

contract CFXsContract {
    // Structure representing a CFXs (Unspent Transaction Output)
    struct cfxs {
        uint256 id;     // Unique identifier for the CFXs
        address owner;  // Address of the owner of this CFXs
        uint256 amount; // Amount of asset held in this CFXs
        string data;    // Additional data or message that can be inscribed in the CFXs
    }

    // Structure to represent data for creating output CFXss during a transaction
    struct OutputCFXsData {
        address owner;  // Address of the owner for the output CFXs
        uint256 amount; // Asset amount for the output CFXs
        string data;    // Additional data for the output CFXs
    }

    struct LockScript {
        uint256 _ether;
        uint256 locktime;
    }

    // Mapping of CFXs ID to its corresponding CFXs structure
    mapping(uint256 => cfxs) public CFXss;

    // Mapping of an address to its total asset balance across all CFXss
    mapping(address => uint256) private _balance;

    mapping(uint256 => LockScript) public LockedCFXs;

    // Maximum number of CFXss that can be created
    uint256 private constant MAX_CFXs_COUNT = 21000000;
    // Fixed amount of asset assigned to each CFXs
    uint256 private constant CFXs_AMOUNT = 1;

    // Counter to generate unique CFXs IDs
    uint256 public CFXsCounter  = 0;

    // Total asset supply in the contract
    uint256 private _totalSupply = 0;

    // State variable to track reentrancy
    bool private _locked;

    // Modifier to prevent reentrancy
    modifier noReentrant() {
        require(!_locked, "No reentrancy allowed!");
        _locked = true;
        _;
        _locked = false;
    }

    // Modifier to ensure that the function is called by an externally owned account (EOA) only
    modifier onlyTxOrigin() {
        require(msg.sender == tx.origin, "Only EOA!");
        _;
    }

    // Function to generate a new unique ID for a CFXs
    function generateCFXsId() private returns (uint256) {
        return CFXsCounter ++;
    }

    // Function to create a new CFXs. Can only be called by an EOA.
    function CreateCFXs() public onlyTxOrigin {
        require(CFXsCounter  < MAX_CFXs_COUNT, "Max CFXs limit reached");

        uint256 newCFXsId = generateCFXsId();
        cfxs memory newCFXs = cfxs(newCFXsId, msg.sender, CFXs_AMOUNT, "");
        CFXss[newCFXsId] = newCFXs;
        _balance[msg.sender] += CFXs_AMOUNT;
        _totalSupply += CFXs_AMOUNT;

        emit CFXsCreated(newCFXsId, msg.sender, CFXs_AMOUNT, "");
    }

    // Structure for representing a transaction in the CFXs model
    struct Transaction {
        uint256[] inputs;  // Array of input CFXs IDs
        OutputCFXsData[] outputs; // Array of output CFXs data
    }

    // Function to get the balance of an address
    function balanceOf(address _addr) public view returns(uint256) {
        return _balance[_addr];
    }

    // Function to get the total supply of assets in the contract
    function totalSupply() public view returns(uint256) {
        return _totalSupply;
    }

    function getLockStates(uint256 _id) public view returns(bool){
        return LockedCFXs[_id].locktime > block.timestamp;
    }

    // Function to process a transaction, validating the input CFXss and creating the output CFXss
    function processTransaction(Transaction memory _tx) public noReentrant{
        require(_tx.inputs.length <= 24 && _tx.outputs.length <= 24, "Too long inputs/outputs length!");
        uint256 totalInputAmount = 0;
        uint256 totalOutputAmount = 0;

        // Validate each input CFXs and compute the total input amount
        for (uint256 i = 0; i < _tx.inputs.length; i++) {
            cfxs storage inputCFXs = CFXss[_tx.inputs[i]];
            require(getLockStates(inputCFXs.id) == false, "Already locked");
            require(inputCFXs.owner == msg.sender, "CFXs not owned by sender");
            totalInputAmount += inputCFXs.amount;

            // Deletes the input CFXs and emits the CFXsDeleted event
            delete CFXss[_tx.inputs[i]];
            emit CFXsDeleted(_tx.inputs[i]);
        }

        _balance[msg.sender] -= totalInputAmount;

        // Compute total output amount and create new CFXss
        for (uint256 i = 0; i < _tx.outputs.length; i++) {
            totalOutputAmount += _tx.outputs[i].amount;
            uint256 newCFXsId = generateCFXsId();
            CFXss[newCFXsId] = cfxs(newCFXsId, _tx.outputs[i].owner, _tx.outputs[i].amount, _tx.outputs[i].data);
            _balance[_tx.outputs[i].owner] += _tx.outputs[i].amount;
            emit CFXsEvent(newCFXsId, _tx.outputs[i].owner, _tx.outputs[i].amount, _tx.outputs[i].data);
        }

        // Ensure the total input and output amounts are equal
        require(totalInputAmount == totalOutputAmount, "Input and output amounts do not match");
    }

    // Locks a CFXs by setting a locktime and the amount of ether associated with it
    function LockingScript(uint256 CFXsId, uint256 _ether, uint256 locktime) public noReentrant{
        // Ensure that the CFXs is owned by the sender and is not already locked
        require(CFXss[CFXsId].owner == msg.sender, "CFXs not owned by sender");
        require(getLockStates(CFXsId) == false, "Already locked");
        
        // Set the amount and locktime for the CFXs
        LockedCFXs[CFXsId]._ether = _ether;
        LockedCFXs[CFXsId].locktime = block.timestamp + locktime * 1 hours;

        emit CFXsLocked(CFXsId, _ether, locktime);
    }

    // Unlocks a CFXs, allowing it to be transferred, and sends the ether back to the original owner
    function UnlockingScript(uint256 CFXsId) public payable noReentrant{
        // Check that the CFXs is locked and the correct amount of ether is provided to unlock it
        require(getLockStates(CFXsId), "Not locked");
        require(msg.value == LockedCFXs[CFXsId]._ether, "Not enough ether");

        // Store the original owner and ether amount for later use
        address owner = CFXss[CFXsId].owner;
        uint256 etherAmount = LockedCFXs[CFXsId]._ether;

        // Update the CFXs's owner to the sender before transferring ether to prevent reentrancy attacks
        CFXss[CFXsId].owner = msg.sender;

        // Remove the CFXs from the locked state
        delete LockedCFXs[CFXsId];

        // Safely transfer ether to the original owner using .call to handle potential exceptions
        (bool success, ) = payable(owner).call{value: etherAmount}("");
        require(success, "Ether transfer failed");

        emit CFXsUnlocked(CFXsId);
    }

    // Function to transfer a CFXs or a portion of it to another address
    function DangerTransfer(uint256 CFXsId, address _to, uint256 _amount) public noReentrant{
        cfxs storage CFXs = CFXss[CFXsId];
        require(CFXs.owner == msg.sender, "CFXs not owned by sender");
        require(getLockStates(CFXs.id) == false, "Already locked");
        require(_amount > 0 && _amount <= CFXs.amount, "Invalid transfer amount");

        if (CFXs.amount == _amount) {
            // Transfer the entire CFXs to a new owner
            CFXs.owner = _to;
        } else {
            // Split the CFXs into two: one for the transferred amount and one for the remainder
            uint256 remainingAmount = CFXs.amount - _amount;

            // Create a new CFXs for the remaining amount with the original owner
            uint256 newCFXsIdRemain = generateCFXsId();
            cfxs memory newCFXsRemain = cfxs(newCFXsIdRemain, msg.sender, remainingAmount, "");
            CFXss[newCFXsIdRemain] = newCFXsRemain;
            emit CFXsEvent(newCFXsIdRemain, msg.sender, remainingAmount, "");

            // Create a new CFXs for the transferred amount with the new owner
            uint256 newCFXsIdTo = generateCFXsId();
            cfxs memory newCFXsTo = cfxs(newCFXsIdTo, _to, _amount, "");
            CFXss[newCFXsIdTo] = newCFXsTo;
            emit CFXsEvent(newCFXsIdTo, _to, _amount, "");

            // Delete the original CFXs
            delete CFXss[CFXsId];
            emit CFXsDeleted(CFXsId);
        }

        // Update balances of sender and receiver
        _balance[msg.sender] -= _amount;
        _balance[_to] += _amount;
    }

    // Function to inscribe or modify data in a CFXs
    function inscribe(uint256 CFXsId, string memory _data) public noReentrant{
        cfxs storage CFXs = CFXss[CFXsId];
        require(CFXs.owner == msg.sender, "CFXs not owned by sender");
        require(getLockStates(CFXs.id) == false, "Already locked");
        CFXs.data = _data;
        emit CFXsEvent(CFXsId, CFXs.owner, CFXs.amount, _data);
    }


    // Function to allow the owner of a CFXs to unlock it at any time
    function OwnerUnlockingScript(uint256 CFXsId) public noReentrant {
        // Checks that the caller is the owner of the CFXs
        require(CFXss[CFXsId].owner == msg.sender, "CFXs not owned by sender");

        // Deletes the lock script, effectively unlocking the CFXs
        delete LockedCFXs[CFXsId];

        // Emits an event indicating the CFXs has been unlocked
        emit CFXsUnlocked(CFXsId);
    }

    // Fallback function to receive Ether and automatically create a CFXs
    receive() external payable {
        // Creates a new CFXs with the received Ether amount
        require(msg.value == 0, "No value");
        CreateCFXs();
    }


    // Events to emit on CFXs creation, update, and deletion
    event CFXsEvent(uint256 id, address to, uint256 amount, string data);
    event CFXsCreated(uint256 id, address to, uint256 amount, string data);
    event CFXsDeleted(uint256 id);
    event CFXsLocked(uint256 indexed CFXsId, uint256 etherAmount, uint256 locktime);
    event CFXsUnlocked(uint256 indexed CFXsId);
}