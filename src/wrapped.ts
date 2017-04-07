/**
 * This module contains a set of classes that add abstraction over the
 * low-level functions in the LLVM C API.
 *
 * Unlike using the lower-level functions, these wrappers aim for *type
 * safety* in the TypeScript level. As much as possible, you use a real
 * TypeScript class instead of an opaque pointer from the API.
 */

import { LLVM, PointerArray } from './llvmc';

/**
 * Convert a normal JavaScript Ref array to a PointerArray
 */
function genPtrArray(array: Ref[]) {
  let ptrArray = new PointerArray(array.length);
  let i = 0;
  for (let elem of array) {
    ptrArray[i] = array[i].ref;
    ++i;
  }
  return ptrArray
}

/**
 * A base class for our wrapper classes that abstract an `LLVM*Ref` type.
 */
export class Ref {
  /**
   * Create a new wrapepr for an underlying `LLVM*Ref` value.
   */
  constructor(public ref: any) {}
}

/**
 * An LLVM wrapper object that has a `free` method that you must call when
 * you're done with the memory.
 */
export interface Freeable {
  free(): void;
}

/**
 * A class for the LLVM Context module
 */
 export class Context extends Ref {
   /**
    * Create new context
    */
   static create() {
     let cref = LLVM.LLVMContextCreate();
     return new Context(cref);
   }

   /**
    * Retrieve global context
    */
   static getGlobal() {
     let cref = LLVM.LLVMGetGlobalContext();
     return new Context(cref);
   }
 }

/**
 * Represents an LLVM module: specifically, and underlying `LLVMModuleRef`.
 */
export class Module extends Ref implements Freeable {
  /**
   * Create a new module.
   */
  static create(name: String) {
    let modref = LLVM.LLVMModuleCreateWithName(name);
    return new Module(modref);
  }

  /**
   * Dump the IR to a file on disk.
   */
  writeBitcodeToFile(filename: string): number {
    return LLVM.LLVMWriteBitcodeToFile(this.ref, filename);
  }

  /**
   * Dump the textual IR to a string.
   */
  toString(): string {
    return LLVM.LLVMPrintModuleToString(this.ref);
  }

  /**
   * Add a function to the module, returning a `Function` wrapper.
   */
  addFunction(name: string, type: FunctionType): Function {
    let funcref = LLVM.LLVMAddFunction(this.ref, name, type.ref);
    return new Function(funcref);
  }

  /**
   * Retrieve the function in module with provided name
   */
  getFunction(name: string): Function {
    let funcref = LLVM.LLVMGetNamedFunction(this.ref, name);
    return new Function(funcref);
  }

  /**
   * Free the memory for this module.
   */
  free() {
    LLVM.LLVMDisposeModule(this.ref);
  }
}



export class BasicBlock extends Ref {
  /**
   * Obtain the function to which this basic block belongs
   */
  getParent(): Function {
    let fref = LLVM.LLVMGetBasicBlockParent(this.ref);
    return new Function(fref);
  }

  /**
   * Obtain first instruction of basic block
   */
  getFirstInstr(): Value {
    let vref = LLVM.LLVMGetFirstInstruction(this.ref);
    return new Value(vref);
  }

  /**
   * Obtain last instruction of basic block
   */
  getLastInstr(): Value {
    let vref = LLVM.LLVMGetLastInstruction(this.ref);
    return new Value(vref);
  }
}

/**
 * Represents an LLVM IR builder.
 */
export class Builder extends Ref implements Freeable {
  /**
   * Create a new builder.
   */
  static create(): Builder {
    let bref = LLVM.LLVMCreateBuilder();
    return new Builder(bref);
  }

  getInsertBlock(): BasicBlock {
    let bbref = LLVM.LLVMGetInsertBlock(this.ref);
    return new BasicBlock(bbref);
  }

  /**
   * Position the builder after the provided instruction
   */
  positionAfter(bb: BasicBlock, instr: Value) {
    LLVM.LLVMPositionBuilder(this.ref, bb.ref, instr.ref);
  }

  /**
   * Position the builder before the provided instruction
   */
  positionBefore(instr: Value) {
    LLVM.LLVMPositionBuilderBefore(this.ref, instr.ref);
  }

  /**
   * Position the builder's insertion point at the end of the given basic block.
   */
  positionAtEnd(bb: BasicBlock) {
    LLVM.LLVMPositionBuilderAtEnd(this.ref, bb.ref);
  }

  /**
   * Build function call
   */
   buildCall(func: Function, args: Value[], name: string): Value {
     let vref = LLVM.LLVMBuildCall(this.ref, func.ref, genPtrArray(args), args.length, name);
     return new Value(vref);
   }

   /**
    * Create alloca
    */
   buildAlloca(type: Type, name: string): Value {
     let vref = LLVM.LLVMBuildAlloca(this.ref, type.ref, name);
     return new Value(vref);
   }

   /**
    * Obtain value pointed to by ptr
    */
   buildLoad(ptr: Value, name: string): Value {
     let vref = LLVM.LLVMBuildLoad(this.ref, ptr.ref, name);
     return new Value(vref);
   }

   /**
    * Store value in ptr
    */
   buildStore(value: Value, ptr: Value): Value {
     let vref = LLVM.LLVMBuildStore(this.ref, value.ref, ptr.ref);
     return new Value(vref);
   }

   /**
    * Build cast of signed int to floating point
    */
   buildSIToFP(val: Value, destType: Type, name: string): Value {
     let vref = LLVM.LLVMBuildSIToFP(this.ref, val.ref, destType.ref, name);
     return new Value(vref);
   }

  /**
   * Build an integer addition instruction.
   */
  add(lhs: Value, rhs: Value, name: string): Value {
    let vref = LLVM.LLVMBuildAdd(this.ref, lhs.ref, rhs.ref, name);
    return new Value(vref);
  }

/**
   * Build an floating point addition instruction.
   */
  addf(lhs: Value, rhs: Value, name: string): Value {
    let vref = LLVM.LLVMBuildFAdd(this.ref, lhs.ref, rhs.ref, name);
    return new Value(vref);
  }

  /**
   * Build an integer subtraction instruction
   */
  sub(lhs: Value, rhs: Value, name: string): Value {
    let vref = LLVM.LLVMBuildSub(this.ref, lhs.ref, rhs.ref, name);
    return new Value(vref);
  }

  /**
   * Build a floating point subtraction instruction
   */
  subf(lhs: Value, rhs: Value, name: string): Value {
    let vref = LLVM.LLVMBuildFSub(this.ref, lhs.ref, rhs.ref, name);
    return new Value(vref);
  }

  /**
   * Build an integer multiplication instruction
   */
  mul(lhs: Value, rhs: Value, name: string): Value {
    let vref = LLVM.LLVMBuildMul(this.ref, lhs.ref, rhs.ref, name);
    return new Value(vref);
  }

  /**
   * Build a floating point multiplication instruction
   */
  mulf(lhs: Value, rhs: Value, name: string): Value {
    let vref = LLVM.LLVMBuildFMul(this.ref, lhs.ref, rhs.ref, name);
    return new Value(vref);
  }

  /**
   * Negate integer
   */
  neg(val: Value, name: string): Value {
    let vref = LLVM.LLVMBuildNeg(this.ref, val.ref, name);
    return new Value(vref);
  }

  /**
   * Negate floating point value
   */
  negf(val: Value, name: string): Value {
    let vref = LLVM.LLVMBuildFNeg(this.ref, val.ref, name);
    return new Value(vref);
  }

  /**
   * Build a return instruction.
   */
  ret(arg: Value): any {
    return LLVM.LLVMBuildRet(this.ref, arg.ref);
  }

  /**
   * Free the memory for this builder.
   */
  free() {
    LLVM.LLVMDisposeBuilder(this.ref);
  }
}

/**
 * An LLVM type; wraps `LLVMTypeRef`.
 */
export class Type extends Ref {
  /**
   * Get the i1 type.
   */
  static int1(): Type {
    return new Type(LLVM.LLVMInt1Type());
  }

  /**
   * Get the i8 type.
   */
  static int8(): Type {
    return new Type(LLVM.LLVMInt8Type());
  }

  /**
   * Get the i16 type.
   */
  static int16(): Type {
    return new Type(LLVM.LLVMInt16Type());
  }

  /**
   * Get the i32 type.
   */
  static int32(): Type {
    return new Type(LLVM.LLVMInt32Type());
  }

  /**
   * Get the i64 type.
   */
  static int64(): Type {
    return new Type(LLVM.LLVMInt64Type());
  }

  /**
   * Get the i128 type.
   */
  static int128(): Type {
    return new Type(LLVM.LLVMInt128Type());
  }

  /**
   * Get a float type
   */
   static float():Type {
     return new Type(LLVM.LLVMFloatType());
   }

   /**
    * Get a double type
    */
    static double():Type {
      return new Type(LLVM.LLVMDoubleType());
    }
}

/**
 * Wraps a function type: an `LLVMFunctionTypeRef`.
 */
export class FunctionType extends Ref {
  static create(ret: Type, params: Type[], isVarArg = false) {
    // Construct the function type.
    let ftref = LLVM.LLVMFunctionType(ret.ref, genPtrArray(params), params.length, isVarArg);
    return new FunctionType(ftref);
  }
}

/**
 * Wraps *any* LLVM value via an `LLVMValueRef`.
 */
export class Value extends Ref {
  /**
   * Get the value's name.
   */
  getName(): string {
    return LLVM.LLVMGetValueName(this.ref);
  }

  /**
   * Set the value's name.
   */
  setName(name: string): void {
    LLVM.LLVMSetValueName(this.ref, name);
  }
}

/**
 * Represents an LLVM function, wrapping an `LLVMValueRef` that points to a
 * function.
 */
export class Function extends Value {
  /**
   * Add a new basic block to this function.
   */
  appendBasicBlock(name: string): BasicBlock {
    let bbref = LLVM.LLVMAppendBasicBlock(this.ref, "entry");
    return new BasicBlock(bbref);
  }

  getEntryBlock(): BasicBlock {
    let bbref = LLVM.LLVMGetEntryBasicBlock(this.ref);
    return new BasicBlock(bbref);
  }

  /**
   * Get number of parameters to the function.
   */
  countParams(): number {
    return LLVM.LLVMCountParams(this.ref);
  }

  /**
   * Get function parameter at the specified index.
   */
  getParam(idx: number): Value {
    return new Value(LLVM.LLVMGetParam(this.ref, idx));
  }

  /**
   * Iterate over the parameters in the function.
   */
  *params() {
    let count = this.countParams();
    for (let i = 0; i < count; ++i) {
      yield this.getParam(i);
    }
  }

  /**
   * Delete the function from its containing module.
   */
  deleteFromParent(): void {
    LLVM.LLVMDeleteFunction(this.ref);
  }
}

/**
 * Integer constant
 */
export class ConstInt extends Value {
  /**
   * Build an integer constant
   */
  static create(value: number, type: Type): ConstInt {
    let vref = LLVM.LLVMConstInt(type.ref, value, false);
    return new ConstInt(vref);
  }
}

/**
 * Float constant
 */
export class ConstFloat extends Value {
  /**
   * Build a float constant 
   */
  static create(value: number, type: Type): ConstFloat {
    let vref = LLVM.LLVMConstReal(type.ref, value);
    return new ConstFloat(vref);
  }
}

/**
 * String constant
 */
export class ConstString extends Value {
  /**
   * Create a ConstantDataSequential with string content in the provided context
   */
  static createInContext(context: Context, value: string, dontNullTerminate: boolean): ConstString {
    let vref = LLVM.LLVMConstStringInContext(context.ref, value, value.length, dontNullTerminate);
    return new ConstString(vref);
  }

  /**
   * Create a ConstantDataSequential with string content in the global context
   */
  static create(value: string, dontNullTerminate: boolean): ConstString {
    let vref = LLVM.LLVMConstString(value, value.length, dontNullTerminate);
    return new ConstString(vref);
  }
}

/**
 * Pointer type
 */
export class Pointer extends Value {
  /**
   * Create an llvm pointer type
   */
  static create(type: Type, addressSpace: number) {
    let pref = LLVM.LLVMPointerType(type, addressSpace);
    return new Pointer(pref);
  }
}




