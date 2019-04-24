export function Arg(name: any, returnTypeFuncOrOptions: any, maybeOptions: any): any;
export function Args(paramTypeFnOrOptions: any, maybeOptions: any): any;
export function ArgsType(): any;
export class ArgumentValidationError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(validationErrors: any);
    validationErrors: any;
}
export function Authorized(rolesOrRolesArray: any): any;
export class CannotDetermineTypeError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(typeName: any, propertyKey: any, parameterIndex: any);
}
export class ConflictingDefaultValuesError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(typeName: any, fieldName: any, defaultValueFromDecorator: any, defaultValueFromInitializer: any);
}
export class ConflictingDefaultWithNullableError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(typeOwnerName: any, defaultValue: any, nullable: any);
}
export function Ctx(propertyName: any): any;
export function Field(returnTypeFuncOrOptions: any, maybeOptions: any): any;
export function FieldResolver(returnTypeFuncOrOptions: any, maybeOptions: any): any;
export const Float: {
    astNode: any;
    description: string;
    extensionASTNodes: any;
    inspect: Function;
    name: string;
    parseLiteral: Function;
    parseValue: Function;
    serialize: Function;
    toConfig: Function;
    toJSON: Function;
};
export class ForbiddenError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
}
export class GeneratingSchemaError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(details: any);
    details: any;
}
export const GraphQLISODateTime: {
    astNode: any;
    description: string;
    extensionASTNodes: any;
    inspect: Function;
    name: string;
    parseLiteral: Function;
    parseValue: Function;
    serialize: Function;
    toConfig: Function;
    toJSON: Function;
};
export const GraphQLTimestamp: {
    astNode: any;
    description: string;
    extensionASTNodes: any;
    inspect: Function;
    name: string;
    parseLiteral: Function;
    parseValue: Function;
    serialize: Function;
    toConfig: Function;
    toJSON: Function;
};
export const ID: {
    astNode: any;
    description: string;
    extensionASTNodes: any;
    inspect: Function;
    name: string;
    parseLiteral: Function;
    parseValue: Function;
    serialize: Function;
    toConfig: Function;
    toJSON: Function;
};
export function Info(): any;
export function InputType(nameOrOptions: any, maybeOptions: any): any;
export const Int: {
    astNode: any;
    description: string;
    extensionASTNodes: any;
    inspect: Function;
    name: string;
    parseLiteral: Function;
    parseValue: Function;
    serialize: Function;
    toConfig: Function;
    toJSON: Function;
};
export function InterfaceType(nameOrOptions: any, maybeOptions: any): any;
export class MissingSubscriptionTopicsError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(target: any, methodName: any);
}
export function Mutation(returnTypeFuncOrOptions: any, maybeOptions: any): any;
export class NoExplicitTypeError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(typeName: any, propertyKey: any, parameterIndex: any);
}
export function ObjectType(nameOrOptions: any, maybeOptions: any): any;
export function PubSub(triggerKey: any): any;
export function Query(returnTypeFuncOrOptions: any, maybeOptions: any): any;
export class ReflectMetadataMissingError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
}
export function Resolver(objectTypeOrTypeFuncOrMaybeOptions: any, maybeOptions: any): any;
export function Root(propertyName: any): any;
export function Subscription(returnTypeFuncOrOptions: any, maybeOptions: any): any;
export class SymbolKeysNotSupportedError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
}
export class UnauthorizedError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
}
export class UnionResolveTypeError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(unionMetadata: any);
}
export class UnmetGraphQLPeerDependencyError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
}
export function UseMiddleware(middlewaresOrMiddlewareArray: any): any;
export class WrongNullableListOptionError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(typeOwnerName: any, nullable: any);
}
export function buildSchema(options: any): any;
export function buildSchemaSync(options: any): any;
export function buildTypeDefsAndResolvers(options: any): any;
export function createUnionType({ types, name, description }: any): any;
export function emitSchemaDefinitionFile(schemaFilePath: any, schema: any, options: any): any;
export function emitSchemaDefinitionFileSync(schemaFilePath: any, schema: any, options: any): void;
export function registerEnumType(enumObj: any, enumConfig: any): void;
