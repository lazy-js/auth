# Sequence Diagrams - @lazy-js/auth

This document contains detailed sequence diagrams illustrating the key workflows and interactions in the @lazy-js/auth system.

## Table of Contents

1. [User Registration Flow](#user-registration-flow)
2. [User Login Flow](#user-login-flow)
3. [Token Validation Flow](#token-validation-flow)
4. [Token Refresh Flow](#token-refresh-flow)
5. [Password Update Flow](#password-update-flow)
6. [Account Verification Flow](#account-verification-flow)
7. [Role Validation Flow](#role-validation-flow)
8. [System Initialization Flow](#system-initialization-flow)
9. [Error Handling Flow](#error-handling-flow)
10. [Multi-Client Authentication Flow](#multi-client-authentication-flow)

## User Registration Flow

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant API as LazyAuth API
    participant Controller as UserController
    participant Service as UserService
    participant Validator as UserValidator
    participant KC as Keycloak
    participant DB as MongoDB
    participant NS as Notification Service

    Client->>API: POST /{client-name}/register
    Note over Client,API: {method: "email", email: "user@example.com", password: "pass123", firstName: "John"}

    API->>Controller: register(req, res, next)
    Controller->>Service: register(createUserParams)

    Service->>Validator: validateUserCreationDto(userDto, primaryFields)
    Validator-->>Service: validated user data

    Service->>DB: findUserByEmail(email)
    DB-->>Service: null (user not found)

    Service->>KC: createUser(userData)
    KC-->>Service: keycloak user ID

    Service->>DB: createUser(userData)
    DB-->>Service: created user document

    Service->>NS: sendVerificationEmail(email, verificationCode)
    NS-->>Service: email sent confirmation

    Service-->>Controller: user data
    Controller-->>API: successResponse(user)
    API-->>Client: 201 Created with user data
```

## User Login Flow

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant API as LazyAuth API
    participant Controller as UserController
    participant Service as UserService
    participant Validator as UserValidator
    participant KC as Keycloak
    participant DB as MongoDB

    Client->>API: POST /{client-name}/login
    Note over Client,API: {method: "email", email: "user@example.com", password: "pass123"}

    API->>Controller: login(req, res, next)
    Controller->>Service: login(loginParams)

    Service->>Validator: validateLoginDto(loginDto, primaryFields)
    Validator-->>Service: validated login data

    Service->>DB: findUserByEmail(email)
    DB-->>Service: user data

    alt User found and verified
        Service->>KC: loginWithUsername(username, password, clientId)
        KC-->>Service: token response

        Service-->>Controller: {token, user}
        Controller-->>API: successResponse(loginResponse)
        API-->>Client: 200 OK with tokens
    else User not found or not verified
        Service-->>Controller: throw InvalidCredentialsError
        Controller-->>API: error response
        API-->>Client: 401 Unauthorized
    end
```

## Token Validation Flow

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant API as LazyAuth API
    participant Controller as UserController
    participant Service as UserService
    participant KC as Keycloak
    participant JWT as JWT Library

    Client->>API: POST /{client-name}/validate-access-token
    Note over Client,API: Authorization: Bearer <access_token>

    API->>Controller: validateAccessToken(req, res, next)
    Controller->>Service: validateAccessToken(accessToken)

    Service->>JWT: verify(token, secret)
    JWT-->>Service: decoded payload

    Service->>KC: validateTokenWithKeycloak(token)
    KC-->>Service: validation result

    alt Token is valid
        Service-->>Controller: {payload, valid: true}
        Controller-->>API: successResponse(tokenData)
        API-->>Client: 200 OK with token info
    else Token is invalid
        Service-->>Controller: throw InvalidAccessTokenError
        Controller-->>API: error response
        API-->>Client: 401 Unauthorized
    end
```

## Token Refresh Flow

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant API as LazyAuth API
    participant Controller as UserController
    participant Service as UserService
    participant KC as Keycloak

    Client->>API: POST /{client-name}/refresh-access-token
    Note over Client,API: {refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

    API->>Controller: refreshToken(req, res, next)
    Controller->>Service: refreshToken(refreshToken)

    Service->>KC: refreshAccessToken(refreshToken)

    alt Refresh token is valid
        KC-->>Service: new token response
        Service-->>Controller: new tokens
        Controller-->>API: successResponse(tokenResponse)
        API-->>Client: 200 OK with new tokens
    else Refresh token is invalid
        KC-->>Service: error response
        Service-->>Controller: throw InvalidRefreshTokenError
        Controller-->>API: error response
        API-->>Client: 401 Unauthorized
    end
```

## Password Update Flow

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant API as LazyAuth API
    participant Controller as UserController
    participant Service as UserService
    participant KC as Keycloak
    participant DB as MongoDB

    Client->>API: PUT /{client-name}/me/password
    Note over Client,API: Authorization: Bearer <access_token>
    Note over Client,API: {newPassword: "newSecurePassword123"}

    API->>Controller: updatePassword(req, res, next)
    Controller->>Service: updatePassword(accessToken, newPassword)

    Service->>KC: validateAccessToken(accessToken)
    KC-->>Service: token payload

    Service->>KC: updatePassword(userId, newPassword)
    KC-->>Service: password updated confirmation

    Service->>DB: updateUser(userId, {password: hashedPassword})
    DB-->>Service: user updated

    Service-->>Controller: success
    Controller-->>API: successResponse()
    API-->>Client: 200 OK
```

## Account Verification Flow

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant API as LazyAuth API
    participant Controller as UserController
    participant Service as UserService
    participant Validator as UserValidator
    participant DB as MongoDB
    participant KC as Keycloak

    Client->>API: PUT /{client-name}/me/verify
    Note over Client,API: {code: "123456", email: "user@example.com"}

    API->>Controller: verify(req, res, next)
    Controller->>Service: verify(verifyDto)

    Service->>Validator: validateVerifyDto(verifyDto)
    Validator-->>Service: validated verification data

    Service->>DB: findUserByEmail(email)
    DB-->>Service: user data

    alt User found and code matches
        Service->>DB: updateUser(userId, {verified: true})
        DB-->>Service: user updated

        Service->>KC: updateUserVerification(userId, true)
        KC-->>Service: verification updated

        Service-->>Controller: success
        Controller-->>API: successResponse()
        API-->>Client: 200 OK
    else User not found or invalid code
        Service-->>Controller: throw InvalidCodeError
        Controller-->>API: error response
        API-->>Client: 400 Bad Request
    end
```

## Role Validation Flow

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant API as LazyAuth API
    participant Controller as UserController
    participant Service as UserService
    participant KC as Keycloak

    Client->>API: POST /{client-name}/validate-role
    Note over Client,API: Authorization: Bearer <access_token>
    Note over Client,API: {role: "admin"}

    API->>Controller: validateRole(req, res, next)
    Controller->>Service: validateRole(accessToken, role)

    Service->>KC: validateAccessToken(accessToken)
    KC-->>Service: token payload with roles

    Service->>KC: checkUserRoles(userId, role)
    KC-->>Service: role validation result

    alt User has required role
        Service-->>Controller: {hasRole: true, roles: userRoles}
        Controller-->>API: successResponse(roleData)
        API-->>Client: 200 OK with role info
    else User doesn't have required role
        Service-->>Controller: throw InsufficientPermissionsError
        Controller-->>API: error response
        API-->>Client: 403 Forbidden
    end
```

## System Initialization Flow

```mermaid
sequenceDiagram
    participant App as Application
    participant LA as LazyAuth
    participant KC as Keycloak
    participant DB as MongoDB
    participant RB as RealmBuilder
    participant RM as RealmManipulator

    App->>LA: new LazyAuth(config, appConfig, realm, notificationSdk)
    LA->>LA: initialize properties

    App->>LA: start()

    LA->>KC: checkKeycloakAvailability()
    KC-->>LA: service status

    alt Keycloak is available
        LA->>DB: connect()
        DB-->>LA: connection established

        LA->>RB: create(realm, keycloakConfig, notificationSdk)
        RB-->>LA: realmBuilder instance

        LA->>RB: build()
        RB->>KC: createRealm()
        KC-->>RB: realm created
        RB->>KC: createClients()
        KC-->>RB: clients created
        RB->>KC: createGroups()
        KC-->>RB: groups created
        RB->>KC: createUsers()
        KC-->>RB: users created
        RB-->>LA: realm built successfully

        LA->>RM: getRealmSummary()
        RM-->>LA: realm summary logged

        LA->>LA: prepareApp()
        LA->>LA: mountModule(realmBuilder)
        LA->>LA: app.start()
        LA-->>App: service started
    else Keycloak is unavailable
        LA-->>App: service failed to start
    end
```

## Error Handling Flow

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant API as LazyAuth API
    participant Controller as UserController
    participant Service as UserService
    participant EH as Error Handler
    participant Logger as Logger

    Client->>API: API Request

    API->>Controller: controller method
    Controller->>Service: service method

    alt Service executes successfully
        Service-->>Controller: success response
        Controller-->>API: success response
        API-->>Client: 200 OK
    else Error occurs in service
        Service->>Logger: log error details
        Service-->>Controller: throw specific error
        Controller->>Logger: log controller error
        Controller-->>API: error response
        API->>EH: global error handler
        EH->>Logger: log error with trace ID
        EH->>EH: format error response
        EH-->>API: formatted error
        API-->>Client: error response with trace ID
    end
```

## Multi-Client Authentication Flow

```mermaid
sequenceDiagram
    participant WA as Web App Client
    participant MA as Mobile App Client
    participant API as LazyAuth API
    participant KC as Keycloak
    participant DB as MongoDB

    par Web App Login
        WA->>API: POST /web-app/login
        Note over WA,API: {method: "email", email: "user@example.com", password: "pass123"}
        API->>KC: authenticate with web-app client
        KC-->>API: web-app tokens
        API-->>WA: web-app specific response
    and Mobile App Login
        MA->>API: POST /mobile-app/login
        Note over MA,API: {method: "username", username: "user123", password: "pass123"}
        API->>KC: authenticate with mobile-app client
        KC-->>API: mobile-app tokens
        API-->>MA: mobile-app specific response
    end

    Note over WA,DB: Both clients share the same user data in MongoDB
    Note over KC,API: But use different Keycloak client configurations
```

## Database Transaction Flow

```mermaid
sequenceDiagram
    participant Service as UserService
    participant Repo as UserRepository
    participant DB as MongoDB
    participant KC as Keycloak

    Service->>Repo: createUser(userData)
    Repo->>DB: startTransaction()
    DB-->>Repo: transaction started

    Repo->>DB: insert user document
    DB-->>Repo: user created

    Repo->>KC: createKeycloakUser(userData)
    KC-->>Repo: keycloak user created

    alt All operations successful
        Repo->>DB: commitTransaction()
        DB-->>Repo: transaction committed
        Repo-->>Service: user created successfully
    else Error in Keycloak
        KC-->>Repo: error response
        Repo->>DB: rollbackTransaction()
        DB-->>Repo: transaction rolled back
        Repo-->>Service: throw error
    end
```

## Notification Flow

```mermaid
sequenceDiagram
    participant Service as UserService
    participant NS as Notification Service
    participant Email as Email Provider
    participant SMS as SMS Provider

    Service->>NS: sendVerificationEmail(email, code)
    NS->>Email: send email with verification code
    Email-->>NS: email sent confirmation
    NS-->>Service: notification sent

    Service->>NS: sendPasswordResetEmail(email, resetLink)
    NS->>Email: send password reset email
    Email-->>NS: email sent confirmation
    NS-->>Service: notification sent

    Service->>NS: sendSMSVerification(phone, code)
    NS->>SMS: send SMS with verification code
    SMS-->>NS: SMS sent confirmation
    NS-->>Service: notification sent
```

These sequence diagrams provide a comprehensive view of the key workflows and interactions within the @lazy-js/auth system, showing the detailed flow of data and control between different components.
