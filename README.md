# @lazy-js/auth

A comprehensive authentication and authorization package built on top of Keycloak, providing a unified API for user management, authentication, and role-based access control across multiple clients and applications.

## 🏗️ Architecture Overview

This package implements a **multi-tenant authentication system** that bridges Keycloak's identity management capabilities with a local MongoDB database for enhanced user data management and client-specific configurations.

### Core Components

-   **LazyAuth**: Main orchestrator class that manages the entire authentication lifecycle
-   **Realm Management**: Dynamic realm creation and configuration for different clients
-   **User Management**: Comprehensive user registration, login, and profile management
-   **Keycloak Integration**: Seamless integration with Keycloak Admin API and public client APIs
-   **Multi-Client Support**: Support for multiple authentication clients with different configurations

## 🚀 Key Features

### Authentication Methods

-   **Multi-method Authentication**: Username, email, or phone number based login
-   **Flexible Registration**: Configurable registration flows per client
-   **Token Management**: JWT access and refresh token handling
-   **Password Management**: Secure password updates and validation

### Authorization & Security

-   **Role-Based Access Control (RBAC)**: Hierarchical role management
-   **Group Management**: User grouping with inherited permissions
-   **Client-Specific Permissions**: Isolated permission systems per client
-   **Token Validation**: Comprehensive access token and role validation

### Multi-Tenancy

-   **Client Isolation**: Separate authentication flows per client
-   **Custom Attributes**: Client-specific user attributes
-   **Shared Attributes**: Cross-client user data sharing
-   **Flexible Configuration**: Per-client authentication settings

## 📦 Dependencies

### Core Dependencies

-   `@keycloak/keycloak-admin-client`: Keycloak administration
-   `@lazy-js/error-guard`: Centralized error handling
-   `@lazy-js/server`: Express.js server framework
-   `@lazy-js/utils`: Utility functions
-   `jose`: JWT token handling
-   `mongoose`: MongoDB object modeling

### Development Dependencies

-   `typescript`: TypeScript compilation
-   `vitest`: Testing framework
-   `supertest`: HTTP testing utilities

## 🏛️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   LazyAuth      │    │   Keycloak      │
│                 │◄──►│   Package       │◄──►│   Server        │
│ - Web Apps      │    │                 │    │                 │
│ - Mobile Apps   │    │ - User Mgmt     │    │ - Identity Mgmt │
│ - APIs          │    │ - Auth Flow     │    │ - Token Issuance│
└─────────────────┘    │ - Role Mgmt     │    │ - User Storage  │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   MongoDB       │
                       │                 │
                       │ - User Profiles │
                       │ - Client Config │
                       │ - Custom Data   │
                       └─────────────────┘
```

### Module Structure

```
src/
├── modules/
│   ├── kcApi/           # Keycloak API integration
│   │   ├── services/    # Admin and public client APIs
│   │   └── types/       # API type definitions
│   ├── Realm/           # Realm and client management
│   │   ├── src/         # Core realm classes
│   │   └── types/       # Realm type definitions
│   ├── RealmBuilder/    # Dynamic realm creation
│   ├── RealmManipulator/# Realm operations
│   └── User/            # User management
│       ├── controller/  # HTTP endpoints
│       ├── service/     # Business logic
│       ├── model/       # Data models
│       ├── repository/  # Data access
│       └── validator/   # Input validation
├── database/            # Database connection
├── utils/              # Utility functions
└── types/              # Global type definitions
```

## 🔧 Installation

```bash
npm install @lazy-js/auth
```

## 📖 Usage

### Basic Setup

```typescript
import { LazyAuth, Realm, Client, Group, User, createRolesTree } from '@lazy-js/auth';

// Define roles hierarchy
const roles = createRolesTree([
    {
        name: 'admin',
        childRoles: [{ name: 'user-management' }, { name: 'content-management' }],
    },
]);

// Create groups
const adminGroup = new Group('admin-group', true).addRoles(roles).addAttribute('permissions', 'all');

// Create client configuration
const client = new Client('my-app', 'my-app-client')
    .setAuthConfig(
        new ClientAuthConfig(['email', 'username'])
            .setRegisterConfig({ status: 'public', verified: false })
            .setLoginConfig({ status: 'enabled' }),
    )
    .addGroup(adminGroup);

// Create realm
const realm = new Realm('my-realm').addClient(client).addUser(
    new User({
        username: 'admin',
        password: 'secure-password',
        method: 'username',
        group: adminGroup,
    }),
);

// Initialize LazyAuth
const auth = new LazyAuth(
    {
        keycloakServiceUrl: 'http://localhost:8080',
        keycloakAdminPassword: 'admin-password',
        localMongoDbURL: 'mongodb://localhost:27017/auth-db',
        logKeycloakInfo: true,
    },
    {
        config: {
            port: 3000,
            serviceName: 'auth-service',
            routerPrefix: '/api/v1',
        },
    },
    realm,
    notificationSdk,
);

// Start the service
await auth.start();
```

### API Endpoints

The package automatically exposes the following endpoints for each configured client:

#### Authentication Endpoints

-   `POST /{client-name}/register` - User registration
-   `POST /{client-name}/login` - User login
-   `POST /{client-name}/validate-access-token` - Token validation
-   `POST /{client-name}/validate-role` - Role validation
-   `POST /{client-name}/refresh-access-token` - Token refresh

#### User Management Endpoints

-   `PUT /{client-name}/me/password` - Update password
-   `PUT /{client-name}/me/verify` - Verify user account

## 🔐 Security Features

### Authentication Security

-   **JWT Token Management**: Secure token generation and validation
-   **Password Hashing**: Bcrypt-based password security
-   **Multi-Factor Support**: Email/phone verification capabilities
-   **Session Management**: Automatic token refresh and expiration

### Authorization Security

-   **Role-Based Access**: Hierarchical permission system
-   **Client Isolation**: Separate permission contexts per client
-   **Token Validation**: Comprehensive token integrity checks
-   **Input Validation**: Zod-based request validation

### Data Security

-   **Encrypted Storage**: Sensitive data encryption in MongoDB
-   **Secure Communication**: HTTPS-ready API endpoints
-   **Error Handling**: Secure error responses without data leakage

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring & Logging

The package includes comprehensive logging for:

-   Authentication events
-   Authorization decisions
-   Database operations
-   Keycloak API interactions
-   Error tracking and debugging

## 🔄 Error Handling

The system uses a centralized error handling approach with:

-   **Validation Errors**: Input validation failures
-   **Authentication Errors**: Login/registration failures
-   **Authorization Errors**: Permission denied scenarios
-   **System Errors**: Infrastructure and service failures

## 🚀 Performance Considerations

-   **Connection Pooling**: Optimized database connections
-   **Token Caching**: Efficient token validation
-   **Async Operations**: Non-blocking I/O throughout
-   **Memory Management**: Efficient resource utilization

## 📈 Scalability

-   **Horizontal Scaling**: Stateless design supports multiple instances
-   **Database Sharding**: MongoDB sharding support
-   **Load Balancing**: Ready for load balancer deployment
-   **Microservice Ready**: Designed for microservice architectures

## 🔧 Configuration

### Environment Variables

-   `KEYCLOAK_SERVICE_URL`: Keycloak server URL
-   `KEYCLOAK_ADMIN_PASSWORD`: Admin password
-   `MONGODB_URL`: MongoDB connection string
-   `SERVICE_PORT`: API server port
-   `SERVICE_NAME`: Service identifier

### Client Configuration

Each client can be configured with:

-   Primary authentication fields (email, username, phone)
-   Registration policies (public/private, verification requirements)
-   Login policies (enabled/disabled)
-   Custom user attributes
-   Group and role assignments

## 📝 License

ISC License - see LICENSE file for details.
