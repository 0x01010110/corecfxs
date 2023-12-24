#!/usr/bin/env node
const { program } = require('commander');
const { address } = require('js-conflux-sdk');
const { transferCFXs, account, cfxsContract, cfxsMainContract } = require('./conflux');

program
  .name('cfxs')
  .description('Conflux Core Space CLI for CFXs')
  .version('0.1.0');

program.command('calMappedAddress')
  .description('Get the mapped address of Core Space address')
  .argument('<coreAddress>', 'core space address')
  .action((str, options) => {
    if (!str || !str.startsWith('cfx')) {
        console.log('Please input a valid Conflux Core address');
        return;
    }
    console.log(`Map address of ${str} is ${address.cfxMappedEVMSpaceAddress(str)}`);
  });

program.command('mappedAddress')
  .description('Get the mapped address of Core Space address')
  .action((options) => {
    const addr = address.cfxMappedEVMSpaceAddress(account.address);
    console.log(`Map address of ${account.address} is ${addr}`);
  });

program.command('cfxsBalance')
  .description('Get the cfxs balance of mapped address')
  .action(async (options) => {
    const addr = address.cfxMappedEVMSpaceAddress(account.address);
    const balance = await cfxsContract.balanceOf(addr);
    console.log(`Balance of ${addr} is ${balance}`);
  });

program.command('newCfxsBalance')
  .description('Get the new cfxs balance of mapped address')
  .action(async (options) => {
    const addr = address.cfxMappedEVMSpaceAddress(account.address);
    const balance = await cfxsMainContract.balanceOf(addr);
    console.log(`Balance of ${addr} is ${balance}`);
  });

// only support core account transfer it's mapped address owned CFXs
/* program.command('transfer')
  .description('Get the mapped address of Core Space address')
  .option('--id <id>', 'CFXs id to transfer')
  .option('-r, --receiver <address>', 'receiver address in eSpace')
  .action(async (options) => {
    if (!options.id || !options.receiver) {
        console.log('Please input a valid eSpace address and CFXs id');
        return;
    }
    if (!options.receiver.startsWith('0x') || options.receiver.length !== 42) {
        console.log('Please input a valid eSpace address');
        return;
    }
    
    try {
        const id = parseInt(options.id);
        console.log(`Transfer cfxs id ${id} to ${options.receiver}`);
        let receipt = await transferCFXs(id, options.receiver);
        console.log(`Result: ${receipt.outcomeStatus === 0 ? 'success' : 'fail'}`);
    } catch(e) {
        console.log('Error: ', e.message || e);
    }
  }); */

program.parse();