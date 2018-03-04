import * as ref from 'ref';
import * as ArrayType from 'ref-array';
import * as Struct from 'ref-struct';

// Some useful types.
export const boolp     = ref.refType('bool');
export const uintp     = ref.refType('uint');
export const uint8p    = ref.refType('uint8');
export const size_tp   = ref.refType('size_t');
export const stringp   = ref.refType('string');
export const voidp     = ref.refType(ref.types.void); // Pointer to an opaque LLVM value.
export const voidpp    = ref.refType(voidp); // void**, used for arrays and out-parameters.
export const void_     = ref.types.void;

/**
 * A constructor for arrays of pointers. Use this as `new PointerArray(N)` to
 * create an array of length N.
 */
export const PointerArray = ArrayType(ref.refType(ref.types.void));

// some structs
// http://llvm.org/docs/doxygen/html/structLLVMOpInfoSymbol1.html
export const LLVMOpInfoSymbol1 = Struct({
    'Present':              'uint64',
    'Name':                 'string',
    'Value':                'uint64',
});
export const LLVMOpInfoSymbol1Ptr = ref.refType(LLVMOpInfoSymbol1);

// http://llvm.org/docs/doxygen/html/structLLVMOpInfo1.html
export const LLVMOpInfo1 = Struct({
    'AddSymbol':            LLVMOpInfoSymbol1,
    'SubtractSymbol':       LLVMOpInfoSymbol1,
    'Value':                'uint64',
    'VariantKind':          'uint64',
});
export const LLVMOpInfo1Ptr = ref.refType(LLVMOpInfo1);

// http://llvm.org/docs/doxygen/html/structLLVMMCJITCompilerOptions.html
export const LLVMCJITCompilerOptions = Struct({
    'OptLevel':             'uint',
    'CodeModel':            'int',
    'NoFramePointerElim':   'bool',
    'EnableFastISel':       'bool',
    'MCJMM':                voidp,
});
export const LLVMCJITCompilerOptionsPtr = ref.refType(LLVMCJITCompilerOptions);
