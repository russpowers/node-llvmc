/**
 * This module contains the low-level FFI declaration for the LLVM C library.
 * You can call the functions on the `LLVM` object contained here to operate
 * directly on LLVM value references.
 * 
 * More convenient wrapper classes are found in the `wrapped` module.
 */

import * as ffi from 'ffi';
import * as ref from 'ref';

// Some useful types.
let voidp = ref.refType(ref.types.void);  // Pointer to an opaque LLVM value.
let void_ = ref.types.void;

export const LLVM = ffi.Library('libLLVM', {
  // Modules.
  // http://llvm.org/docs/doxygen/html/group__LLVMCCoreModule.html
  'LLVMModuleCreateWithName':           [voidp, ['string']],
  'LLVMModuleCreateWithNameInContext':  [],
  'LLVMCloneModule':                    [voidp, [voidp]],
  'LLVMDisposeModule':                  [void_, [voidp]],
  'LLVMGetDataLayout':                  ['string', [voidp]],
  'LLVMSetDataLayout':                  [void_, [voidp, 'string']],
  'LLVMGetTarget':                      ['string', [voidp]],
  'LLVMSetTarget':                      [void_, [voidp, 'string']],
  'LLVMDumpModule':                     [void_, [voidp]],
  'LLVMPrintModuleToFile':              [],
  'LLVMPrintModuleToString':            ['string', [voidp]],
  'LLVMSetModuleInlineAsm':             [],
  'LLVMGetModuleContext':               [],
  'LLVMGetTypeByName':                  [],
  'LLVMGetNamedMetadataNumOperands':    [],
  'LLVMGetNamedMetadataOperands':       [],
  'LLVMAddNamedMetadataOperand':        [],
  'LLVMAddFunction':                    [voidp, [voidp, 'string', voidp]],
  'LLVMGetNamedFunction':               [],
  'LLVMGetFirstFunction':               [],
  'LLVMGetLastFunction':                [],
  'LLVMGetNextFunction':                [],
  'LLVMGetPreviousFunction':            [],
  'LLVMWriteBitcodeToFile':             ['int', [voidp, 'string']],
  

  // Function types.
  // http://llvm.org/docs/doxygen/html/group__LLVMCCoreTypeFunction.html
  'LLVMFunctionType':           [voidp, [voidp, voidp, 'uint', 'bool']],

  // Basic blocks.
  // http://llvm.org/docs/doxygen/html/group__LLVMCCoreValueBasicBlock.html
  'LLVMAppendBasicBlock':       [voidp, [voidp, 'string']],

  // Instruction builder.
  // http://llvm.org/docs/doxygen/html/group__LLVMCCoreInstructionBuilder.html
  'LLVMCreateBuilder':          [voidp, []],
  'LLVMPositionBuilder':        [void_, [voidp, voidp, voidp]],
  'LLVMPositionBuilderBefore':  [void_, [voidp, voidp]],
  'LLVMPositionBuilderAtEnd':   [void_, [voidp, voidp]],
  'LLVMDisposeBuilder':         [void_, [voidp]],
  'LLVMBuildAdd':               [voidp, [voidp, voidp, voidp, 'string']],
  'LLVMBuildRet':               [voidp, [voidp, voidp]],

  // Scalar constants.
  // http://llvm.org/docs/doxygen/html/group__LLVMCCoreValueConstantScalar.html
  'LLVMConstInt':               [voidp, [voidp, 'ulonglong', 'bool']],

  // Types.
  // http://llvm.org/docs/doxygen/html/group__LLVMCCoreTypeInt.html
  'LLVMInt1Type':               [voidp, []],
  'LLVMInt8Type':               [voidp, []],
  'LLVMInt16Type':              [voidp, []],
  'LLVMInt32Type':              [voidp, []],
  'LLVMInt64Type':              [voidp, []],
  'LLVMInt128Type':             [voidp, []],
});
