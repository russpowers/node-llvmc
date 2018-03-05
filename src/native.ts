/**
 * This module contains a way to get information about the native target
 */

import { Type } from 'ref';
import { void_ } from './types';

export type NativeTargetFnType = (Type | never[])[];

export interface NativeTargetX86 {
    LLVMInitializeX86TargetInfo:    NativeTargetFnType;
    LLVMInitializeX86Target:        NativeTargetFnType;
    LLVMInitializeX86TargetMC:      NativeTargetFnType;
    LLVMInitializeX86AsmParser:     NativeTargetFnType;
    LLVMInitializeX86AsmPrinter:    NativeTargetFnType;
}

export interface NativeTargetARM {
    LLVMInitializeARMTargetInfo:    NativeTargetFnType;
    LLVMInitializeARMTarget:        NativeTargetFnType;
    LLVMInitializeARMTargetMC:      NativeTargetFnType;
    LLVMInitializeARMAsmParser:     NativeTargetFnType;
    LLVMInitializeARMAsmPrinter:    NativeTargetFnType;
}

export const NativeTargetFFI: (NativeTargetX86 | NativeTargetARM | {}) = (function () {
    switch (process.env.LLVMC_TARGET || process.arch) {
        case 'ia32':
        case 'x64':
            return {
                'LLVMInitializeX86TargetInfo':  [void_, []],
                'LLVMInitializeX86Target':      [void_, []],
                'LLVMInitializeX86TargetMC':    [void_, []],
                'LLVMInitializeX86AsmParser':   [void_, []],
                'LLVMInitializeX86AsmPrinter':  [void_, []],
            };

        case 'arm':
            return {
                'LLVMInitializeARMTargetInfo':  [void_, []],
                'LLVMInitializeARMTarget':      [void_, []],
                'LLVMInitializeARMTargetMC':    [void_, []],
                'LLVMInitializeARMAsmParser':   [void_, []],
                'LLVMInitializeARMAsmPrinter':  [void_, []],
            };

        default:
            return {};
    }
})();
