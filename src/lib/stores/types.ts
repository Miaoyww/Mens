// ── Dish types ──────────────────────────────────────────────────────────────

export type DishCategory = 'cold' | 'hot' | 'soup';

export interface Dish {
    id: string;
    name: string;
    price: number;  // f64 from SQLite via Tauri, formerly string from MongoDB Decimal128
    image: string;
    discount: number;
    category: DishCategory;
}

export interface DishCreate {
    name: string;
    price: string;  // string from form input, parsed to f64 in Rust
    image: string;
    discount?: number;
    category: DishCategory;
}

export interface DishUpdate {
    name?: string;
    price?: string;  // string from form input
    image?: string;
    discount?: number;
    category?: DishCategory;
}

// ── Auth types ──────────────────────────────────────────────────────────────

export interface AuthUser {
    username: string;
    role: string;
}

export type AuthState =
    | { status: 'loading' }
    | { status: 'unauthenticated' }
    | { status: 'authenticated'; user: AuthUser };
