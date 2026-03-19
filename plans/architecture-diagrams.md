# ResumePilot Architecture Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Vite App] --> B[Authentication]
        A --> C[ATS Analyzer]
        A --> D[Job Matcher]
        A --> E[Settings]
    end

    subgraph "Authentication Layer"
        B --> F[Clerk Auth Service]
        F --> G[User Management]
        F --> H[Session Management]
    end

    subgraph "AI Processing Layer"
        C --> I[OpenRouter API]
        D --> I
        I --> J[AI Models]
        J --> K[Analysis Engine]
    end

    subgraph "File Processing Layer"
        C --> L[File Upload]
        L --> M[PDF Parser]
        L --> N[DOCX Parser]
        L --> O[Text Extractor]
    end

    subgraph "Data Layer"
        P[Local Storage] --> Q[API Keys]
        P --> R[Analysis Cache]
        P --> S[User Preferences]
    end

    A --> P
```

## Component Architecture

```mermaid
graph LR
    subgraph "Core Components"
        A[App.tsx] --> B[Router]
        B --> C[Layout]
        C --> D[Header]
        C --> E[Sidebar]
        C --> F[Main Content]
    end

    subgraph "Feature Components"
        F --> G[Home Page]
        F --> H[Dashboard]
        F --> I[ATS Analyzer]
        F --> J[Job Matcher]
        F --> K[Settings]
    end

    subgraph "Shared Components"
        L[Button]
        M[Card]
        N[Input]
        O[Progress]
        P[Score Display]
    end

    G --> L
    H --> L
    I --> L
    J --> L
    K --> L
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant C as Clerk
    participant S as Server

    U->>A: Access Protected Route
    A->>C: Check Auth Status
    C-->>A: Not Authenticated
    A->>U: Redirect to Sign In
    U->>C: Enter Credentials
    C->>S: Validate Credentials
    S-->>C: Auth Token
    C-->>A: User Session
    A->>U: Grant Access
```

## ATS Analysis Flow

```mermaid
flowchart TD
    A[User Uploads Resume] --> B{File Type?}
    B -->|PDF| C[PDF Parser]
    B -->|DOCX| D[DOCX Parser]
    B -->|TXT| E[Text Reader]
    
    C --> F[Extract Text]
    D --> F
    E --> F
    
    F --> G[Analyze Structure]
    F --> H[Extract Keywords]
    F --> I[Check Formatting]
    
    G --> J[Calculate Score]
    H --> J
    I --> J
    
    J --> K[Generate Recommendations]
    K --> L[Display Results]
```

## Job Matching Flow

```mermaid
flowchart TD
    A[User Input] --> B[Resume Text]
    A --> C[Job Description]
    
    B --> D[Extract Resume Keywords]
    C --> E[Extract Job Requirements]
    
    D --> F[Compare Keywords]
    E --> F
    
    F --> G[Calculate Match Score]
    F --> H[Identify Gaps]
    F --> I[Highlight Strengths]
    
    G --> J[Display Results]
    H --> J
    I --> J
```

## Data Flow Architecture

```mermaid
graph TB
    subgraph "User Interface"
        A[React Components]
    end

    subgraph "State Management"
        B[Auth Context]
        C[API Key Context]
        D[Analysis Context]
    end

    subgraph "Services"
        E[OpenRouter Service]
        F[File Parser Service]
        G[ATS Analyzer Service]
        H[Job Matcher Service]
    end

    subgraph "External APIs"
        I[Clerk API]
        J[OpenRouter API]
    end

    subgraph "Storage"
        K[Local Storage]
        L[Session Storage]
    end

    A --> B
    A --> C
    A --> D
    B --> I
    C --> K
    D --> E
    E --> J
    A --> F
    F --> G
    F --> H
    G --> E
    H --> E
```

## API Integration Architecture

```mermaid
graph LR
    subgraph "Frontend"
        A[React App]
        B[API Service Layer]
        C[Request Handler]
        D[Response Parser]
    end

    subgraph "OpenRouter API"
        E[Authentication]
        F[Model Selection]
        G[Request Processing]
        H[Response Generation]
    end

    subgraph "AI Models"
        I[GPT-4]
        J[Claude]
        K[Other Models]
    end

    A --> B
    B --> C
    C --> E
    E --> F
    F --> G
    G --> I
    G --> J
    G --> K
    I --> H
    J --> H
    K --> H
    H --> D
    D --> A
```

## File Processing Architecture

```mermaid
graph TB
    subgraph "File Upload"
        A[Drag & Drop Zone]
        B[File Input]
        C[File Validation]
    end

    subgraph "File Processing"
        D[PDF Processor]
        E[DOCX Processor]
        F[Text Processor]
    end

    subgraph "Text Extraction"
        G[PDF.js Library]
        H[Mammoth.js Library]
        I[FileReader API]
    end

    subgraph "Output"
        J[Plain Text]
        K[Structured Data]
        L[Metadata]
    end

    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    D --> G
    E --> H
    F --> I
    G --> J
    H --> J
    I --> J
    J --> K
    J --> L
```

## Scoring Algorithm Architecture

```mermaid
graph TB
    subgraph "ATS Scoring"
        A[File Format Score]
        B[Structure Score]
        C[Keyword Score]
        D[Formatting Score]
        E[Contact Score]
    end

    subgraph "Weights"
        F[20%]
        G[20%]
        H[25%]
        I[20%]
        J[15%]
    end

    subgraph "Calculation"
        K[Weighted Average]
        L[Final Score 0-100]
    end

    A --> F
    B --> G
    C --> H
    D --> I
    E --> J
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
    K --> L
```

## Job Matching Algorithm

```mermaid
graph TB
    subgraph "Input"
        A[Resume Keywords]
        B[Job Requirements]
    end

    subgraph "Matching Process"
        C[Required Skills Match]
        D[Experience Level Match]
        E[Education Match]
        F[Industry Keywords Match]
    end

    subgraph "Weights"
        G[40%]
        H[25%]
        I[15%]
        J[20%]
    end

    subgraph "Output"
        K[Match Score]
        L[Gap Analysis]
        M[Strengths]
    end

    A --> C
    B --> C
    A --> D
    B --> D
    A --> E
    B --> E
    A --> F
    B --> F
    C --> G
    D --> H
    E --> I
    F --> J
    G --> K
    H --> K
    I --> K
    J --> K
    K --> L
    K --> M
```

## Responsive Design Breakpoints

```mermaid
graph LR
    subgraph "Mobile < 640px"
        A[Single Column]
        B[Stacked Layout]
        C[Touch Optimized]
    end

    subgraph "Tablet 640-1024px"
        D[Two Column]
        E[Side Navigation]
        F[Medium Cards]
    end

    subgraph "Desktop > 1024px"
        G[Multi Column]
        H[Full Sidebar]
        I[Large Cards]
    end

    A --> D
    D --> G
```

## Error Handling Flow

```mermaid
flowchart TD
    A[User Action] --> B{Success?}
    B -->|Yes| C[Continue Flow]
    B -->|No| D[Error Type?]
    
    D -->|Network| E[Retry Logic]
    D -->|Validation| F[Show Validation Error]
    D -->|API| G[Show API Error]
    D -->|File| H[Show File Error]
    
    E --> I{Retry Success?}
    I -->|Yes| C
    I -->|No| J[Show Fallback UI]
    
    F --> K[Highlight Invalid Fields]
    G --> L[Show Error Message]
    H --> M[Show Upload Error]
```

## Performance Optimization Flow

```mermaid
graph TB
    subgraph "Code Splitting"
        A[Route-based Splitting]
        B[Component Lazy Loading]
        C[Dynamic Imports]
    end

    subgraph "Caching"
        D[API Response Cache]
        E[Analysis Result Cache]
        F[Asset Cache]
    end

    subgraph "Optimization"
        G[Memoization]
        H[Debouncing]
        I[Throttling]
    end

    A --> J[Reduced Initial Load]
    B --> J
    C --> J
    D --> K[Faster Subsequent Loads]
    E --> K
    F --> K
    G --> L[Improved Runtime]
    H --> L
    I --> L
```

## Security Architecture

```mermaid
graph TB
    subgraph "Authentication"
        A[Clerk Auth]
        B[JWT Tokens]
        C[Session Management]
    end

    subgraph "Data Protection"
        D[API Key Encryption]
        E[Secure Local Storage]
        F[HTTPS Only]
    end

    subgraph "Input Validation"
        G[File Type Validation]
        H[File Size Limits]
        I[Text Sanitization]
    end

    A --> J[Secure User Access]
    B --> J
    C --> J
    D --> K[Protected API Keys]
    E --> K
    F --> K
    G --> L[Safe File Processing]
    H --> L
    I --> L
```

These diagrams provide a comprehensive visual representation of the ResumePilot application architecture, covering all major aspects from system design to security considerations.
