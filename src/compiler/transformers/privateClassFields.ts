/*@internal*/
namespace ts {
    const enum PrivateIdentifierPlacement {
        InstanceField
    }

    type PrivateIdentifierInfo = PrivateIdentifierInstanceField;

    interface PrivateIdentifierInstanceField {
        placement: PrivateIdentifierPlacement.InstanceField;
        weakMapName: Identifier;
    }

    /**
     * A mapping of private names to information needed for transformation.
     */
    type PrivateIdentifierEnvironment = UnderscoreEscapedMap<PrivateIdentifierInfo>;

    /**
     * Transforms ECMAScript Class Syntax.
     * TypeScript parameter property syntax is transformed in the TypeScript transformer.
     * For now, this transforms public field declarations using TypeScript class semantics
     * (where the declarations get elided and initializers are transformed as assignments in the constructor).
     * Eventually, this transform will change to the ECMAScript semantics (with Object.defineProperty).
     */
    export function transformPrivateIdentifiers(context: TransformationContext) {
        const {
            hoistVariableDeclaration,
            endLexicalEnvironment,
            resumeLexicalEnvironment
        } = context;
        const compilerOptions = context.getCompilerOptions();
        const languageVersion = getEmitScriptTarget(compilerOptions);

        /**
         * Tracks what computed name expressions originating from elided names must be inlined
         * at the next execution site, in document order
         */
        let pendingExpressions: Expression[] | undefined;

        const privateIdentifierEnvironmentStack: (PrivateIdentifierEnvironment | undefined)[] = [];
        let currentPrivateIdentifierEnvironment: PrivateIdentifierEnvironment | undefined;

        return chainBundle(transformSourceFile);

        function transformSourceFile(node: SourceFile) {
            if (node.isDeclarationFile) {
                return node;
            }
            const visited = visitEachChild(node, visitor, context);
            addEmitHelpers(visited, context.readEmitHelpers());
            return visited;
        }

        function visitor(node: Node): VisitResult<Node> {
            if (!(node.transformFlags & TransformFlags.ContainsClassFields)) return node;

            switch (node.kind) {
                case SyntaxKind.ClassExpression:
                case SyntaxKind.ClassDeclaration:
                    return visitClassLike(node as ClassLikeDeclaration);
                case SyntaxKind.PropertyAccessExpression:
                    return visitPropertyAccessExpression(node as PropertyAccessExpression);
                case SyntaxKind.PrefixUnaryExpression:
                    return visitPrefixUnaryExpression(node as PrefixUnaryExpression);
                case SyntaxKind.PostfixUnaryExpression:
                    return visitPostfixUnaryExpression(node as PostfixUnaryExpression);
                case SyntaxKind.CallExpression:
                    return visitCallExpression(node as CallExpression);
                case SyntaxKind.BinaryExpression:
                    return visitBinaryExpression(node as BinaryExpression);
                case SyntaxKind.PrivateIdentifier:
                    return visitPrivateIdentifier(node as PrivateIdentifier);
            }
            return visitEachChild(node, visitor, context);
        }

        function visitorDestructuringTarget(node: Node): VisitResult<Node> {
            switch (node.kind) {
                case SyntaxKind.ObjectLiteralExpression:
                case SyntaxKind.ArrayLiteralExpression:
                    return visitAssignmentPattern(node as AssignmentPattern);
                default:
                    return visitor(node);
            }
        }

        /**
         * If we visit a private name, this means it is an undeclared private name.
         * Replace it with an empty identifier to indicate a problem with the code.
         */
        function visitPrivateIdentifier(node: PrivateIdentifier) {
            return setOriginalNode(createIdentifier(""), node);
        }

        /**
         * Visits the members of a class that has fields.
         *
         * @param node The node to visit.
         */
        function classElementVisitor(node: Node): VisitResult<Node> {
            switch (node.kind) {
                case SyntaxKind.Constructor:
                    // Constructors for classes using class fields are transformed in
                    // `visitClassDeclaration` or `visitClassExpression`.
                    return undefined;

                case SyntaxKind.GetAccessor:
                case SyntaxKind.SetAccessor:
                case SyntaxKind.MethodDeclaration:
                    // Visit the name of the member (if it's a computed property name).
                    return visitEachChild(node, classElementVisitor, context);

                case SyntaxKind.PropertyDeclaration:
                    return undefined;

                case SyntaxKind.SemicolonClassElement:
                    return node;

                default:
                    return visitor(node);
            }
        }

        function visitPropertyAccessExpression(node: PropertyAccessExpression) {
            if (isPrivateIdentifier(node.name)) {
                const privateIdentifierInfo = accessPrivateIdentifier(node.name);
                if (privateIdentifierInfo) {
                    switch (privateIdentifierInfo.placement) {
                        case PrivateIdentifierPlacement.InstanceField:
                            return setOriginalNode(
                                setTextRange(
                                    createClassPrivateFieldGetHelper(
                                        context,
                                        visitNode(node.expression, visitor, isExpression),
                                        privateIdentifierInfo.weakMapName
                                    ),
                                    node
                                ),
                                node
                            );
                    }
                }
            }
            return visitEachChild(node, visitor, context);
        }

        function visitPrefixUnaryExpression(node: PrefixUnaryExpression) {
            if (isPrivateIdentifierPropertyAccessExpression(node.operand)) {
                const operator = node.operator === SyntaxKind.PlusPlusToken ?
                    SyntaxKind.PlusEqualsToken : node.operator === SyntaxKind.MinusMinusToken ?
                        SyntaxKind.MinusEqualsToken : undefined;
                if (operator) {
                    const transformedExpr = setOriginalNode(
                        createBinary(
                            node.operand,
                            operator,
                            createLiteral(1)
                        ),
                        node
                    );
                    return visitNode(transformedExpr, visitor);
                }
            }
            return visitEachChild(node, visitor, context);
        }

        function visitPostfixUnaryExpression(node: PostfixUnaryExpression) {
            if (isPrivateIdentifierPropertyAccessExpression(node.operand)) {
                const operator = node.operator === SyntaxKind.PlusPlusToken ?
                    SyntaxKind.PlusToken : node.operator === SyntaxKind.MinusMinusToken ?
                        SyntaxKind.MinusToken : undefined;
                if (operator) {
                    // Create a temporary variable if the receiver is not inlinable, since we
                    // will need to access it multiple times.
                    const receiver = isSimpleInlineableExpression(node.operand.expression) ?
                        undefined :
                        createTempVariable(hoistVariableDeclaration);
                    // Create a temporary variable to store the value returned by the expression.
                    const returnValue = createTempVariable(hoistVariableDeclaration);

                    const transformedExpr = inlineExpressions(compact<Expression>([
                        receiver && createAssignment(receiver, node.operand.expression),
                        // Store the existing value of the private name in the temporary.
                        createAssignment(returnValue, receiver ? createPropertyAccess(receiver, node.operand.name) : node.operand),
                        // Assign to private name.
                        createAssignment(
                            receiver ? createPropertyAccess(receiver, node.operand.name) : node.operand,
                            createBinary(
                                returnValue, operator, createLiteral(1)
                            )
                        ),
                        // Return the cached value.
                        returnValue
                    ]));
                    return visitNode(transformedExpr, visitor);
                }
            }
            return visitEachChild(node, visitor, context);
        }


        function visitCallExpression(node: CallExpression) {
            if (isPrivateIdentifierPropertyAccessExpression(node.expression)) {
                // Transform call expressions of private names to properly bind the `this` parameter.
                const { thisArg, target } = createCallBinding(node.expression, hoistVariableDeclaration, languageVersion);
                return updateCall(
                    node,
                    createPropertyAccess(visitNode(target, visitor), "call"),
                    /*typeArguments*/ undefined,
                    [visitNode(thisArg, visitor, isExpression), ...visitNodes(node.arguments, visitor, isExpression)]
                );
            }
            return visitEachChild(node, visitor, context);
        }

        function visitBinaryExpression(node: BinaryExpression) {
            if (isDestructuringAssignment(node)) {
                const savedPendingExpressions = pendingExpressions;
                pendingExpressions = undefined!;
                node = updateBinary(
                    node,
                    visitNode(node.left, visitorDestructuringTarget),
                    visitNode(node.right, visitor),
                    node.operatorToken
                );
                const expr = some(pendingExpressions) ?
                    inlineExpressions(compact([...pendingExpressions!, node])) :
                    node;
                pendingExpressions = savedPendingExpressions;
                return expr;
            }
            if (isAssignmentExpression(node) && isPrivateIdentifierPropertyAccessExpression(node.left)) {
                const info = accessPrivateIdentifier(node.left.name);
                if (info) {
                    // For property initializers, set the function name.
                    const right = isPropertyDeclaration(getOriginalNode(node)) && (isFunctionExpression(node.right) || isArrowFunction(node.right)) ?
                        createPrivateNamedFunction(node.left.name, visitNode(node.right, visitor)) :
                        visitNode(node.right, visitor, isExpression);

                    return setOriginalNode(
                        createPrivateIdentifierAssignment(
                            info,
                            visitNode(node.left.expression, visitor, isExpression),
                            right,
                            node.operatorToken.kind
                        ),
                        node
                    );
                }
            }
            return visitEachChild(node, visitor, context);
        }

        function createPrivateIdentifierAssignment(info: PrivateIdentifierInfo, receiver: Expression, right: Expression, operator: AssignmentOperator) {
            switch (info.placement) {
                case PrivateIdentifierPlacement.InstanceField: {
                    return createPrivateIdentifierInstanceFieldAssignment(info, receiver, right, operator);
                }
                default: return Debug.fail("Unexpected private identifier placement");
            }
        }

        function createPrivateIdentifierInstanceFieldAssignment(info: PrivateIdentifierInstanceField, receiver: Expression, right: Expression, operator: AssignmentOperator) {
            receiver = visitNode(receiver, visitor, isExpression);
            right = visitNode(right, visitor, isExpression);
            if (isCompoundAssignment(operator)) {
                const isReceiverInlineable = isSimpleInlineableExpression(receiver);
                const getReceiver = isReceiverInlineable ? receiver : createTempVariable(hoistVariableDeclaration);
                const setReceiver = isReceiverInlineable ? receiver : createAssignment(getReceiver, receiver);
                return createClassPrivateFieldSetHelper(
                    context,
                    setReceiver,
                    info.weakMapName,
                    createBinary(
                        createClassPrivateFieldGetHelper(context, getReceiver, info.weakMapName),
                        getNonAssignmentOperatorForCompoundAssignment(operator),
                        right
                    )
                );
            }
            else {
                return createClassPrivateFieldSetHelper(context, receiver, info.weakMapName, right);
            }
        }

        /**
         * Set up the environment for a class.
         */
        function visitClassLike(node: ClassLikeDeclaration) {
            if (!forEach(node.members, isPrivateIdentifierPropertyDeclaration)) {
                return visitEachChild(node, visitor, context);
            }

            const savedPendingExpressions = pendingExpressions;
            pendingExpressions = undefined;
            startPrivateIdentifierEnvironment();

            const result = isClassDeclaration(node) ?
                visitClassDeclaration(node) :
                visitClassExpression(node);

            endPrivateIdentifierEnvironment();
            pendingExpressions = savedPendingExpressions;
            return result;
        }

        function visitClassDeclaration(node: ClassDeclaration) {
            const statements: Statement[] = [
                updateClassDeclaration(
                    node,
                    /*decorators*/ undefined,
                    node.modifiers,
                    node.name,
                    /*typeParameters*/ undefined,
                    visitNodes(node.heritageClauses, visitor, isHeritageClause),
                    transformClassMembers(node)
                )
            ];

            // Write any pending expressions from elided or moved computed property names
            if (some(pendingExpressions)) {
                statements.push(createExpressionStatement(inlineExpressions(pendingExpressions)));
            }

            return statements;
        }

        function visitClassExpression(node: ClassExpression): Expression {
            const classExpression = updateClassExpression(
                node,
                node.modifiers,
                node.name,
                /*typeParameters*/ undefined,
                visitNodes(node.heritageClauses, visitor, isHeritageClause),
                transformClassMembers(node)
            );

            if (some(pendingExpressions)) {
                const expressions: Expression[] = [];
                addRange(expressions, map(pendingExpressions, startOnNewLine));
                expressions.push(startOnNewLine(classExpression));
                return inlineExpressions(expressions);
            }
            return classExpression;
        }

        function transformClassMembers(node: ClassDeclaration | ClassExpression) {
            // Declare private names.
            for (const member of node.members) {
                if (isPrivateIdentifierPropertyDeclaration(member)) {
                    addPrivateIdentifierToEnvironment(member.name);
                }
            }

            const members: ClassElement[] = [];
            const constructor = transformConstructor(node);
            if (constructor) {
                members.push(constructor);
            }
            addRange(members, visitNodes(node.members, classElementVisitor, isClassElement));
            return setTextRange(createNodeArray(members), /*location*/ node.members);
        }

        function transformConstructor(node: ClassDeclaration | ClassExpression) {
            const constructor = visitNode(getFirstConstructorWithBody(node), visitor, isConstructorDeclaration);
            const parameters = visitParameterList(constructor ? constructor.parameters : undefined, visitor, context);
            const body = transformConstructorBody(node, constructor);
            if (!body) {
                return undefined;
            }
            return startOnNewLine(
                setOriginalNode(
                    setTextRange(
                        createConstructor(
                            /*decorators*/ undefined,
                            /*modifiers*/ undefined,
                            parameters,
                            body
                        ),
                        constructor || node
                    ),
                    constructor
                )
            );
        }

        function transformConstructorBody(node: ClassDeclaration | ClassExpression, constructor: ConstructorDeclaration | undefined) {
            const properties = filter(node.members, isPrivateIdentifierPropertyDeclaration);

            // Only generate synthetic constructor when there are property initializers to move.
            if (!constructor && !some(properties)) {
                return visitFunctionBody(/*node*/ undefined, visitor, context);
            }

            resumeLexicalEnvironment();

            let indexOfFirstStatement = 0;
            let statements: Statement[] = [];

            if (constructor) {
                indexOfFirstStatement = addPrologueDirectivesAndInitialSuperCall(constructor, statements, visitor);
            }

            let privateIdentifierPropertyIndex = 0;
            // Initialize the private identifier property WeakMaps. Transforms this:
            //
            //  #x;
            //
            // Into this:
            //
            //  constructor() {
            //      _x.set(this, void 0);
            //  }
            //
            if (constructor && constructor.body) {
                for (; indexOfFirstStatement < constructor.body.statements.length && privateIdentifierPropertyIndex < properties.length; indexOfFirstStatement++) {
                    const stmt = constructor.body.statements[indexOfFirstStatement];
                    const originalNode = getOriginalNode(stmt);
                    if (isParameterPropertyDeclaration(originalNode)) {
                        statements.push(visitNode(stmt, visitor, isStatement));
                    }
                    else if (isPropertyDeclaration(originalNode)) {
                        const memberIndex = originalNode.parent.members.indexOf(originalNode);
                        for (; privateIdentifierPropertyIndex < properties.length; privateIdentifierPropertyIndex++) {
                            const prop = getOriginalNode(properties[privateIdentifierPropertyIndex]);
                            if (!isPrivateIdentifierPropertyDeclaration(prop)) {
                                return Debug.failBadSyntaxKind(prop, "Expected original node to be a PropertyDeclaration with a PrivateIdentifier name.");
                            }
                            // Stop if the property declaration comes after the property which this statement is initializing.
                            const propMemberIndex = prop.parent.members.indexOf(prop);
                            if (propMemberIndex > memberIndex) {
                                break;
                            }
                            // Add initializer.
                            const info = accessPrivateIdentifier(prop.name);
                            Debug.assert(!!info);
                            statements.push(setOriginalNode(createExpressionStatement(createPrivateFieldInitializer(info!, createThis())), prop));
                        }
                        statements.push(visitNode(stmt, visitor, isStatement));
                    }
                    else {
                        break;
                    }
                }
            }
            // Add rest of private identifier property initializers.
            for (; privateIdentifierPropertyIndex < properties.length; ++privateIdentifierPropertyIndex) {
                const prop = properties[privateIdentifierPropertyIndex];
                const info = accessPrivateIdentifier(prop.name);
                Debug.assert(!!info);
                statements.push(setOriginalNode(createExpressionStatement(createPrivateFieldInitializer(info!, createThis())), prop));
            }

            // Add existing statements, skipping the initial super call.
            if (constructor) {
                addRange(statements, visitNodes(constructor.body!.statements, visitor, isStatement, indexOfFirstStatement));
            }

            statements = mergeLexicalEnvironment(statements, endLexicalEnvironment());

            return setTextRange(
                createBlock(
                    setTextRange(
                        createNodeArray(statements),
                        /*location*/ constructor ? constructor.body!.statements : node.members
                    ),
                    /*multiLine*/ true
                ),
                /*location*/ constructor ? constructor.body : undefined
            );
        }

        function startPrivateIdentifierEnvironment() {
            privateIdentifierEnvironmentStack.push(currentPrivateIdentifierEnvironment);
            currentPrivateIdentifierEnvironment = undefined;
        }

        function endPrivateIdentifierEnvironment() {
            currentPrivateIdentifierEnvironment = privateIdentifierEnvironmentStack.pop();
        }

        function addPrivateIdentifierToEnvironment(name: PrivateIdentifier) {
            const text = getTextOfPropertyName(name) as string;
            const weakMapName = createOptimisticUniqueName("_" + text.substring(1));
            weakMapName.autoGenerateFlags |= GeneratedIdentifierFlags.ReservedInNestedScopes;
            hoistVariableDeclaration(weakMapName);
            (currentPrivateIdentifierEnvironment || (currentPrivateIdentifierEnvironment = createUnderscoreEscapedMap()))
                .set(name.escapedText, { placement: PrivateIdentifierPlacement.InstanceField, weakMapName });
            (pendingExpressions || (pendingExpressions = [])).push(
                createAssignment(
                    weakMapName,
                    createNew(
                        createIdentifier("WeakMap"),
                        /*typeArguments*/ undefined,
                        []
                    )
                )
            );
        }

        function accessPrivateIdentifier(name: PrivateIdentifier) {
            if (currentPrivateIdentifierEnvironment) {
                const info = currentPrivateIdentifierEnvironment.get(name.escapedText);
                if (info) {
                    return info;
                }
            }
            for (let i = privateIdentifierEnvironmentStack.length - 1; i >= 0; --i) {
                const env = privateIdentifierEnvironmentStack[i];
                if (!env) {
                    continue;
                }
                const info = env.get(name.escapedText);
                if (info) {
                    return info;
                }
            }
            return undefined;
        }


        function wrapPrivateIdentifierForDestructuringTarget(node: PrivateIdentifierPropertyAccessExpression) {
            const parameter = getGeneratedNameForNode(node);
            const info = accessPrivateIdentifier(node.name);
            if (!info) {
                return visitEachChild(node, visitor, context);
            }
            let receiver = node.expression;
            // We cannot copy `this` or `super` into the function because they will be bound
            // differently inside the function.
            if (isThisProperty(node) || isSuperProperty(node) || !isSimpleCopiableExpression(node.expression)) {
                receiver = createTempVariable(hoistVariableDeclaration);
                (receiver as Identifier).autoGenerateFlags! |= GeneratedIdentifierFlags.ReservedInNestedScopes;
                (pendingExpressions || (pendingExpressions = [])).push(createBinary(receiver, SyntaxKind.EqualsToken, node.expression));
            }
            return createPropertyAccess(
                // Explicit parens required because of v8 regression (https://bugs.chromium.org/p/v8/issues/detail?id=9560)
                createParen(
                    createObjectLiteral([
                        createSetAccessor(
                            /*decorators*/ undefined,
                            /*modifiers*/ undefined,
                            "value",
                            [createParameter(
                                /*decorators*/ undefined,
                                /*modifiers*/ undefined,
                                /*dotDotDotToken*/ undefined,
                                parameter,
                                /*questionToken*/ undefined,
                                /*type*/ undefined,
                                /*initializer*/ undefined
                            )],
                            createBlock(
                                [createExpressionStatement(
                                    createPrivateIdentifierAssignment(
                                        info,
                                        receiver,
                                        parameter,
                                        SyntaxKind.EqualsToken
                                    )
                                )]
                            )
                        )
                    ])
                ),
                "value"
            );
        }

        function visitArrayAssignmentTarget(node: AssignmentPattern) {
            const target = getTargetOfBindingOrAssignmentElement(node);
            if (target && isPrivateIdentifierPropertyAccessExpression(target)) {
                const wrapped = wrapPrivateIdentifierForDestructuringTarget(target);
                if (isAssignmentExpression(node)) {
                    return updateBinary(
                        node,
                        wrapped,
                        visitNode(node.right, visitor, isExpression),
                        node.operatorToken
                    );
                }
                else if (isSpreadElement(node)) {
                    return updateSpread(node, wrapped);
                }
                else {
                    return wrapped;
                }
            }
            return visitNode(node, visitorDestructuringTarget);
        }

        function visitObjectAssignmentTarget(node: ObjectLiteralElementLike) {
            if (isPropertyAssignment(node)) {
                const target = getTargetOfBindingOrAssignmentElement(node);
                if (target && isPrivateIdentifierPropertyAccessExpression(target)) {
                    const initializer = getInitializerOfBindingOrAssignmentElement(node);
                    const wrapped = wrapPrivateIdentifierForDestructuringTarget(target);
                    return updatePropertyAssignment(
                        node,
                        visitNode(node.name, visitor),
                        initializer ? createAssignment(wrapped, visitNode(initializer, visitor)) : wrapped,
                    );
                }
                return updatePropertyAssignment(
                    node,
                    visitNode(node.name, visitor),
                    visitNode(node.initializer, visitorDestructuringTarget)
                );
            }
            return visitNode(node, visitor);
        }


        function visitAssignmentPattern(node: AssignmentPattern) {
            if (isArrayLiteralExpression(node)) {
                // Transforms private names in destructuring assignment array bindings.
                //
                // Source:
                // ([ this.#myProp ] = [ "hello" ]);
                //
                // Transformation:
                // [ { set value(x) { this.#myProp = x; } }.value ] = [ "hello" ];
                return updateArrayLiteral(
                    node,
                    visitNodes(node.elements, visitArrayAssignmentTarget, isExpression)
                );
            }
            else {
                // Transforms private names in destructuring assignment object bindings.
                //
                // Source:
                // ({ stringProperty: this.#myProp } = { stringProperty: "hello" });
                //
                // Transformation:
                // ({ stringProperty: { set value(x) { this.#myProp = x; } }.value }) = { stringProperty: "hello" };
                return updateObjectLiteral(
                    node,
                    visitNodes(node.properties, visitObjectAssignmentTarget, isObjectLiteralElementLike)
                );
            }
        }

        function createPrivateFieldInitializer(info: PrivateIdentifierInfo, receiver: LeftHandSideExpression) {
            switch (info.placement) {
                case PrivateIdentifierPlacement.InstanceField: {
                    return createPrivateInstanceFieldInitializer(receiver, info.weakMapName);
                }
                default: {
                    return Debug.fail("Unknown private identifier placement.");
                }
            }
        }
    }

    function createPrivateInstanceFieldInitializer(receiver: LeftHandSideExpression, weakMapName: Identifier) {
        return createCall(
            createPropertyAccess(weakMapName, "set"),
            /*typeArguments*/ undefined,
            [receiver, createVoidZero()]
        );
    }

    export const classPrivateFieldGetHelper: UnscopedEmitHelper = {
        name: "typescript:classPrivateFieldGet",
        scoped: false,
        text: `var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return privateMap.get(receiver); };`
    };

    function createClassPrivateFieldGetHelper(context: TransformationContext, receiver: Expression, privateField: Identifier) {
        context.requestEmitHelper(classPrivateFieldGetHelper);
        return createCall(getHelperName("__classPrivateFieldGet"), /* typeArguments */ undefined, [receiver, privateField]);
    }

    export const classPrivateFieldSetHelper: UnscopedEmitHelper = {
        name: "typescript:classPrivateFieldSet",
        scoped: false,
        text: `var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } privateMap.set(receiver, value); return value; };`
    };

    function createClassPrivateFieldSetHelper(context: TransformationContext, receiver: Expression, privateField: Identifier, value: Expression) {
        context.requestEmitHelper(classPrivateFieldSetHelper);
        return createCall(getHelperName("__classPrivateFieldSet"), /* typeArguments */ undefined, [receiver, privateField, value]);
    }

    function createPrivateNamedFunction(name: PrivateIdentifier, func: FunctionExpression | ArrowFunction) {
        const nameStr = createLiteral(idText(name));
        return createElementAccess(
            createObjectLiteral(
                [createPropertyAssignment(nameStr, func)],
                /*multiline*/ false
            ),
            nameStr
        );
    }
}

