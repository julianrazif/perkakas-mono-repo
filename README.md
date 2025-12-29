# 🛠️ Perkakas Monorepo

[![Java](https://img.shields.io/badge/Java-25-orange?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.1-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?logo=tauri)](https://tauri.app/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)](https://vitejs.dev/)

This is the hands-on for building cross-platform desktop applications. This project leverages the power of **Java 25** with **Spring Boot 4** for a robust backend and **React 19** with **Tauri 2** for a lightweight, secure desktop frontend.

---

## 📖 Table of Contents
1. [🚀 Architecture Overview](#-architecture-overview)
2. [📁 Project Structure](#-project-structure)
3. [💻 Tech Stack](#-tech-stack)
4. [⚙️ Environment Setup](#-environment-setup)
5. [🏃 Running the Project](#-running-the-project)
6. [🔐 Deep Dive: Authentication (JWT)](#-deep-dive-authentication-jwt)
7. [📦 Desktop Integration (Tauri)](#-desktop-integration-tauri)
8. [🛠️ Build & Deployment](#-build--deployment)
9. [🗺️ Roadmap](#-roadmap)

---

## 🚀 Architecture Overview

The **Perkakas Monorepo** follows a modern distributed architecture where the desktop client and backend server are decoupled but managed within a single repository for streamlined development and shared contracts.

### Why This Stack?
- **Spring Boot (Backend):** Enterprise-grade security, mature ecosystem, and high performance with Java 25.
- **React + Vite (Frontend):** Lightning-fast development with Hot Module Replacement (HMR) and a rich UI component ecosystem.
- **Tauri (Desktop):** Extremely small binary sizes and superior security compared to Electron by using the system's native webview and Rust for the core logic.
- **JWT (Security):** Stateless authentication suitable for both web and desktop environments.

> **Straight Recommendation?**  
> If your client is React and you want a single-click Windows app: **Use Tauri. Don’t overthink it.**

---

## 📁 Project Structure

```text
perkakas-mono-repo/
├── apps/
│   ├── client/              # React 19 + Vite + Tauri 2 (Desktop App)
│   │   ├── src/             # React source code (App.tsx, Auth.ts, etc.)
│   │   └── src-tauri/       # Rust-based Tauri core & configuration (Cargo.toml, tauri.conf.json)
│   └── perkakas-server/     # Spring Boot 4 + Java 25 (REST API)
│       ├── src/main/java/   # Backend source code (AuthController.java, JWTUtil.java, etc.)
│       └── pom.xml          # Maven configuration
├── packages/
│   └── api-contract/        # Shared OpenAPI/Swagger definitions (Single Source of Truth)
├── tools/
│   ├── docker/              # Dockerfiles for containerized deployment (e.g., server.Dockerfile)
│   └── scripts/             # Automation & build scripts (build-all.ps1)
└── README.md                # Project documentation
```

### Why This Structure Works?
- **Isolation:** Each application can be developed, tested, and deployed independently.
- **Shared Contracts:** The `api-contract` package ensures the frontend and backend stay in sync regarding API definitions and data models.
- **Unified Tooling:** Common scripts and environment configurations are centralized in the `tools/` directory.

---

## 💻 Tech Stack

### 🧱 Backend (Spring Boot Clean Layers)
- **Language:** Java 25
- **Framework:** Spring Boot 4.0.1
- **Security:** Spring Security (Stateless JWT)
- **API:** RESTful Services with Jackson JSON mapping

### 🧩 Frontend (React Best Practice)
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Language:** TypeScript
- **State Management:** React Hooks (useEffect, useState)
- **Desktop Wrapper:** Tauri 2 (Rust)

---

## ⚙️ Environment Setup

### Prerequisites
1. **Java 25 SDK** (e.g., GraalVM or OpenJDK)
2. **Node.js** (Latest LTS recommended)
3. **Rust Toolchain** (Required for Tauri native compilation)
   - Install via [rustup.rs](https://rustup.rs/)
4. **Visual Studio Build Tools** (Essential for Rust on Windows)
   - Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Select:
     - ✅ **Desktop development with C++**
     - ✅ **MSVC v143** (or latest)
     - ✅ **Windows 10/11 SDK**

### ❌ Troubleshooting: 'cargo metadata' error
If you see `failed to run 'cargo metadata'`, it means Rust is not installed or not in your PATH.
1. Install Rust using the official installer.
2. **Restart your terminal** to refresh environment variables.
3. Verify installation with:
   ```powershell
   rustc --version
   cargo --version
   ```

---

## 🏃 Running the Project

### Start the Backend (Dev)
```powershell
cd apps/perkakas-server
./mvnw spring-boot:run
```

### Start the Frontend (Web Dev)
```powershell
cd apps/client
npm install
npm run dev
```

### Start the Desktop App (Windows Dev)
```powershell
cd apps/client
npx tauri dev
```

---

## 🔐 Deep Dive: Authentication (JWT)

The project implements a secure, stateless JWT authentication flow to handle identity across the desktop client and server.

### 🧱 Architecture (JWT Flow)
```text
[ React UI ]
    ↓  (1) POST /auth/login?username=test
[ Spring Boot ]
    ↓  (2) Generate signed JWT
[ React ]
    ↓  (3) Store token securely (Tauri Store)
    ↓
[ API calls with Authorization: Bearer <token> ]
```

### 1️⃣ Server-Side Implementation

#### Dependencies (`pom.xml`)
```xml
<!-- Security & JWT -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.11.5</version>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-impl</artifactId>
  <version>0.11.5</version>
  <scope>runtime</scope>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-jackson</artifactId>
  <version>0.11.5</version>
  <scope>runtime</scope>
</dependency>
```

#### JWT Utility (`JWTUtil.java`)
```java
@Component
public class JWTUtil {
  private final Key key = Keys.hmacShaKeyFor(
    "secretforjwttokenthatthekeysizemustbegreaterthanorequaltothehashoutputsize".getBytes()
  );

  public String generateToken(String username) {
    return Jwts.builder()
      .setSubject(username)
      .setIssuedAt(new Date())
      .setExpiration(new Date((new Date()).getTime() + 1000 * 60 * 60 * 24))
      .signWith(key)
      .compact();
  }

  public String extractUsername(String token) {
    return Jwts.parserBuilder()
      .setSigningKey(key)
      .build()
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }
}
```

#### Security Configuration (`SecurityConfiguration.java`)
```java
@Configuration
public class SecurityConfiguration {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http, JWTFilter jwtFilter) {
    return http
      .csrf(AbstractHttpConfigurer::disable)
      .httpBasic(AbstractHttpConfigurer::disable)
      .formLogin(AbstractHttpConfigurer::disable)
      .logout(AbstractHttpConfigurer::disable)
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
      .authorizeHttpRequests(authorize -> authorize
        .requestMatchers("/auth/**").permitAll()
        .anyRequest().authenticated()
      )
      .build();
  }
}
```

---

## 📦 Desktop Integration (Tauri)

Tauri 2 provides a secure bridge between the web frontend and the native operating system.

### 🛡️ Secure Token Storage
We avoid `localStorage` for security reasons, as it is susceptible to XSS. Instead, we use the **Tauri Secure Store** which persists data in a more protected manner on the host OS.

#### 1. Enable Plugin (`Cargo.toml`)
```toml
tauri-plugin-store = "2"
```

#### 2. React Token Handling (`Auth.ts`)
```typescript
import { Store } from '@tauri-apps/plugin-store';

export async function saveToken(token: string) {
    const store = await Store.load('.auth.dat');
    await store.set('token', token);
    await store.save();
}

export async function getToken(): Promise<string | null> {
    const store = await Store.load('.auth.dat');
    return await store.get<string>('token') ?? null;
}
```

### 3. Login Flow UI (`App.tsx`)
```typescript
useEffect(() => {
    const run = async () => {
        try {
            await clearToken();
            const { token: loginToken } = await login('test');
            await saveToken(loginToken);
            const value = await getToken();
            setToken(value);
        } catch (err) {
            console.error(err);
        }
    };
    run();
}, []);
```

### 🖥️ Native Features Used
- **Shell Plugin:** Used to safely open external links in the default system browser.
- **Store Plugin:** Securely persists authentication tokens.
- **Log Plugin:** Integrated with Rust's `log` crate for native logging (configured in `lib.rs`).

### ⚙️ Desktop Configuration (`tauri.conf.json`)
- **Product Name:** Perkakas
- **Bundle ID:** `com.julian.razif.perkakas`
- **Window Settings:** 800x600 (Resizable)
- **Security:** CSP is configured to ensure safe execution of the webview.

---

## 🛠️ Build & Deployment

### Build Windows Executable (.exe)
```powershell
cd apps/client
npx tauri build
```
The resulting installer will be located in: `apps/client/src-tauri/target/release/bundle/msi/`

### Build Backend JAR
```powershell
cd apps/perkakas-server
./mvnw clean package
```

### Build Everything
```powershell
./tools/scripts/build-all.ps1
```

---

## 🔐 Production Hardening
- **HTTPS:** Always use HTTPS for transport in production.
- **JWT Secrets:** Never hardcode secrets. Use Environment Variables or a Vault.
- **CSP:** Configure Content Security Policy in `tauri.conf.json`.

## 🗺️ Roadmap
- [ ] **Shared API Contract:** Implement `packages/api-contract/openapi.yaml`.
- [ ] **Unified Build Script:** Complete `tools/scripts/build-all.ps1`.
- [ ] **Dockerization:** Complete `tools/docker/server.Dockerfile`.
- [ ] **Native Features:** Integrate system tray and notifications.
