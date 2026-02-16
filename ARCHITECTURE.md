# Architecture Documentation

## Architecture Overview

### Structure

The application follows a structure with four distinct layers. The `api` layer handles external communication and data contracts. The `core` layer contains HTTP interceptors, and global state management that live throughout the application lifecycle. The `feature` layer encapsulates domain-specific logic with facades serving as an intermediary layer between components and the store. The `shared` layer contains any reusable parts of the app including presentational components, directives, and utility services.

## Key Decisions and Trade-offs

### 1. Zoneless Change Detection

The application uses zoneless change detection. This modern Angular approach delivers better runtime performance and forces explicit reactivity patterns throughout the codebase. However, it requires for signals or observables to be used for all state changes, as the framework will, no longer automatically detect when data updates occur.

### 2. ngrx signals vs NgRx Store

The application uses the ngrx signals library instead of the full NgRx Store. This choice provides a much simpler API with less boilerplate and is sufficient for the application's complexity. The trade-off is reduced tooling support (no Redux DevTools integration) and fewer advanced features like effects and router-store integration that the full NgRx ecosystem provides.

### 3. Root-Provided Store

The `CharactersStore` is provided at the root level rather than at feature or component level. This creates a singleton instance that maintains state throughout the application lifecycle, allowing navigation between routes without losing data or requiring resending requests to the server to refetch them. The trade-off is that the store is loaded with the initial application bundle and state cannot be scoped to individual features, meaning it persists even when navigating away from character related pages.

### 4. Facade Pattern

The `CharactersFacade` decouples components from the store, providing a simplified API that coordinates store methods, localStorage operations, and notifications in single calls. This centralizes business logic, keeps components focused on presentation. The trade-off is additional files and indirection when tracing data flow.

### 5. Single State for List and Details

Character detail views retrieve data from the existing list state rather than fetching individual characters separately. This eliminates duplicate data in the store, simplifies state management, and provides instant navigation since the data is already loaded. The trade-off is that character details are only available for items already in the list, making deep-linking to unloaded characters impossible without first loading the list.

### 6. Shared Component for Character Lists

The same `CharactersList` component is reused across both the main characters page and the favorites page. This ensures UI consistency, reduces code duplication, and makes styling and behavior changes easier to maintain. The component accepts character data as input, making it agnostic to the data source. The trade-off is that any feature-specific customizations require additional inputs or conditional logic within the shared component rather than having specialized implementations.
