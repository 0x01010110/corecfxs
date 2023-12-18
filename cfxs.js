#!/usr/bin/env node
const { program } = require('commander');
const { address } = require('js-conflux-sdk');

program
  .name('cfxs')
  .description('Conflux Core Space CLI for CFXs')
  .version('0.1.0');

program.command('eSpaceMappedAddress')
  .description('Get the mapped address of Core Space address')
  .argument('<coreAddress>', 'core space address')
  .action((str, options) => {
    if (!str || !str.startsWith('cfx')) {
        console.log('Please input a valid Conflux Core address');
        return;
    }
    console.log(`Map address of ${str} is ${address.cfxMappedEVMSpaceAddress(str)}`);
  });

program.command('transfer')
  .description('Get the mapped address of Core Space address')
  .option('-id, --id', 'CFXs id to transfer')
  .option('-r, --receiver', 'receiver address in eSpace')
  .action((str, options) => {
    // console.log(`Map address of ${str} is ${address.cfxMappedEVMSpaceAddress(str)}`);
  });

program.parse();