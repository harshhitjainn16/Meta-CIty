# 🏗️ MetaCity Architecture Documentation

## Overview

MetaCity is a DAO-based city builder game built on the Monad blockchain. This document provides a comprehensive overview of the system architecture, design patterns, and component organization.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Smart Contracts Layer](#smart-contracts-layer)
5. [Frontend Architecture](#frontend-architecture)
6. [Data Flow](#data-flow)
7. [Key Design Patterns](#key-design-patterns)
8. [Configuration](#configuration)

## Architecture Overview

MetaCity follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Components, UI, 3D Scene)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Business Logic Layer             │
│     (Hooks, Services, State Mgmt)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Data Access Layer                │
│     (Contract ABIs, Wagmi Hooks)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Smart Contracts Layer              │
│   (Solidity Contracts on Blockchain)    │
└─────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: React Three Fiber + Three.js
- **Animations**: Framer Motion
- **Web3**: Wagmi v2 + RainbowKit
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts

### Smart Contracts
- **Language**: Solidity ^0.8.20
- **Framework**: Hardhat
- **Libraries**: OpenZeppelin Contracts
- **Network**: Monad Testnet

### Development Tools
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Building**: Next.js + Hardhat

## Project Structure

```
metacity/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── CityScene.tsx   # 3D city visualization
│   ├── Dashboard.tsx   # Analytics dashboard
│   ├── ProposalsList.tsx
│   ├── StakingPanel.tsx
│   └── BuildingsGallery.tsx
│
├── contracts/          # Smart contracts
│   ├── MetaCityToken.sol
│   ├── BuildingNFT.sol
│   ├── CityDAO.sol
│   └── RewardsManager.sol
│
├── hooks/              # Custom React hooks
│   ├── useProposals.ts
│   ├── useStaking.ts
│   ├── useBuildings.ts
│   └── useToken.ts
│
├── lib/                # Configuration & utilities
│   ├── wagmi.ts        # Wagmi config
│   └── contracts.ts    # Legacy (to be migrated)
│
├── constants/          # Application constants
│   ├── index.ts        # App constants
│   └── contracts.ts    # Contract addresses & ABIs
│
├── types/              # TypeScript definitions
│   ├── index.ts        # Core types
│   └── contracts.ts    # Contract types
│
├── utils/              # Utility functions
│   ├── format.ts       # Formatting utilities
│   └── validation.ts   # Validation utilities
│
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # HTML document
│   └── index.tsx       # Main page
│
├── styles/             # Global styles
│   └── globals.css
│
└── scripts/            # Deployment scripts
    ├── deploy.js
    └── deploy-secure.js
```

## Smart Contracts Layer

### Contract Architecture

```
MetaCityToken (ERC20)
    │
    ├── Used for governance voting
    ├── Used for staking rewards
    └── Controlled minting via RewardsManager

BuildingNFT (ERC721)
    │
    ├── Represents buildings in the city
    ├── Stores building metadata
    └── Upgradeable by owners

CityDAO
    │
    ├── Manages proposals
    ├── Handles voting
    ├── Controls treasury
    └── Executes proposals → Mints buildings

RewardsManager
    │
    ├── Manages staking
    ├── Calculates rewards
    ├── Mints token rewards
    └── Handles building rewards
```

### Contract Interactions

1. **Proposal Flow**:
   - User creates proposal in CityDAO (requires tokens)
   - Users vote with their tokens
   - Proposal executes if passed → BuildingNFT.mintBuilding() called

2. **Staking Flow**:
   - User approves tokens → RewardsManager
   - User stakes tokens
   - Rewards calculated and minted periodically

3. **Building Rewards**:
   - BuildingNFT stores building data
   - RewardsManager calculates rewards based on building stats
   - Owner claims rewards → tokens minted

## Frontend Architecture

### Component Hierarchy

```
App (_app.tsx)
└── HomePage (index.tsx)
    ├── Header
    ├── TabNavigation
    └── TabContent
        ├── CityScene (3D View)
        ├── Dashboard
        ├── ProposalsList
        ├── StakingPanel
        └── BuildingsGallery
```

### Hook Architecture

Hooks provide a clean interface to contract interactions:

```typescript
// Example: useProposals hook
useProposals()          // Read proposals
useCreateProposal()     // Write: create proposal
useVote()               // Write: vote on proposal
useExecuteProposal()    // Write: execute proposal
```

**Benefits**:
- Separation of concerns
- Reusable logic
- Type safety
- Error handling
- Loading states

### State Management

- **Server State**: Managed by React Query (Wagmi hooks)
- **UI State**: React useState/useReducer
- **Global State**: Context API (if needed)
- **No Zustand/Redux**: Simpler state management for MVP

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Hook (useProposals, useStaking, etc.)
    ↓
Wagmi Hook (useWriteContract, useReadContract)
    ↓
Blockchain Transaction
    ↓
Event Emitted
    ↓
React Query Refetch
    ↓
UI Updates
```

## Key Design Patterns

### 1. **Custom Hooks Pattern**

Encapsulates contract interaction logic:

```typescript
// hooks/useProposals.ts
export function useCreateProposal() {
  const { writeContract, ... } = useWriteContract();
  
  const createProposal = async (data) => {
    return writeContract({ ... });
  };
  
  return { createProposal, ... };
}
```

### 2. **Constants Centralization**

All configuration in one place:

```typescript
// constants/contracts.ts
export const CONTRACT_ADDRESSES = { ... };
export const CONTRACT_ABIS = { ... };
```

### 3. **Type Safety**

Comprehensive TypeScript types:

```typescript
// types/index.ts
export interface Proposal { ... }
export interface BuildingData { ... }
```

### 4. **Utility Functions**

Reusable formatting and validation:

```typescript
// utils/format.ts
export const formatTokenAmount = (amount: bigint) => { ... };
```

### 5. **Component Composition**

Small, reusable UI components:

```typescript
// components/ui/
- LoadingSpinner
- ErrorBoundary
- Skeleton
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_METACITY_TOKEN_ADDRESS=
NEXT_PUBLIC_BUILDING_NFT_ADDRESS=
NEXT_PUBLIC_CITY_DAO_ADDRESS=
NEXT_PUBLIC_REWARDS_ADDRESS=
NEXT_PUBLIC_PROJECT_ID=  # WalletConnect
MONAD_TESTNET_RPC_URL=
PRIVATE_KEY=
```

### Contract Deployment Order

1. MetaCityToken
2. BuildingNFT
3. RewardsManager (needs Token & BuildingNFT addresses)
4. CityDAO (needs Token & BuildingNFT addresses)

After deployment, update environment variables.

## Best Practices

### 1. **Error Handling**

- Always wrap contract calls in try/catch
- Use ErrorBoundary for React errors
- Show user-friendly error messages

### 2. **Loading States**

- Show skeletons/loaders during data fetching
- Disable buttons during transactions
- Show transaction status

### 3. **Type Safety**

- Use TypeScript for all files
- Define types for all data structures
- Avoid `any` types

### 4. **Code Organization**

- Keep components small and focused
- Extract reusable logic to hooks
- Separate concerns (UI vs business logic)

### 5. **Performance**

- Use dynamic imports for heavy components (CityScene)
- Implement proper loading states
- Optimize re-renders with React.memo

## Future Improvements

1. **Indexer/Backend**: For efficient data queries
2. **State Management**: Add Zustand if needed
3. **Testing**: Unit tests for hooks and utilities
4. **Error Monitoring**: Sentry or similar
5. **Caching**: Optimize contract data caching
6. **Multi-chain**: Support multiple networks

## Security Considerations

1. **Smart Contracts**: OpenZeppelin patterns, audits needed
2. **Frontend**: Input validation, sanitization
3. **Wallet Security**: Never store private keys
4. **Contract Verification**: Verify on block explorer
5. **Access Control**: Proper permission checks

## Deployment

### Frontend
- Deploy to Vercel/Netlify
- Set environment variables
- Enable analytics

### Smart Contracts
- Deploy via Hardhat scripts
- Verify on block explorer
- Update frontend addresses

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type safety
- ✅ Reusability
- ✅ Maintainability
- ✅ Scalability

The modular structure makes it easy to:
- Add new features
- Test components
- Maintain code
- Onboard new developers

