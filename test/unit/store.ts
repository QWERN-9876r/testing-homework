import { createStore, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware, ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, map, mapTo, mergeMap, mergeMapTo, Observable, tap } from 'rxjs';
import { CartState, CheckoutFormData, Product, ProductShortInfo } from '../../src/common/types';
import { CartApi, ExampleApi } from '../../src/client/api';

export interface ApplicationState {
    products?: ProductShortInfo[];
    details: Record<number, Product>;
    cart: CartState;
    latestOrderId?: number;
}

export interface EpicDeps {
    api: ExampleApi;
    cart: CartApi;
}

export type ExampleEpic = (action$: Observable<Action>, store$: StateObservable<ApplicationState>, deps: EpicDeps) => Observable<Action>;

const DEFAULT_STATE: ApplicationState = { details: {}, cart: {} };

// actions
export const productsLoad = () => ({ type: 'PRODUCTS_LOAD' } as const);
export const productsLoaded = (products: ProductShortInfo[]) => ({ type: 'PRODUCTS_LOADED', products } as const);
export const productDetailsLoad = (id: number) => ({ type: 'PRODUCT_DETAILS_LOAD', id } as const);
export const productDetailsLoaded = (details: Product) => ({ type: 'PRODUCT_DETAILS_LOADED', details } as const);
export const addToCart = (product: Product) => ({ type: 'ADD_TO_CART', product } as const);
export const clearCart = () => ({ type: 'CLEAR_CART' } as const);
export const checkout = (form: CheckoutFormData, cart: CartState) => ({ type: 'CHECKOUT', form, cart } as const);
export const checkoutComplete = (orderId: number) => ({ type: 'CHECKOUT_COMPLETE', orderId } as const);

export type Action =
    ReturnType<typeof checkout> |
    ReturnType<typeof checkoutComplete> |
    ReturnType<typeof addToCart> |
    ReturnType<typeof clearCart> |
    ReturnType<typeof productsLoad> |
    ReturnType<typeof productsLoaded> |
    ReturnType<typeof productDetailsLoad> |
    ReturnType<typeof productDetailsLoaded>;

// reducer

function createRootReducer(state: Partial<ApplicationState>) {
    const defaultState = { ...DEFAULT_STATE, ...state };
    const staticSolution: ApplicationState = {
        cart: {1: {
            name: 'string',
            price: 1,
            count: 1
        },
        2: {
            name: 'product 2',
            price: 121,
            count: 5
        }
        },
        details: {
            1: {
                color: 'red',
                description: 'mega red',
                id: 344,
                material: 'red tree',
                name: 'red cat',
                price: 120
            }
        },
        products: [
            {
                id: 1,
                name: 'товар 1',
                price: 1
            },
            {
                id: 2,
                name: 'товар 2',
                price: 2
            },
            {
                id: 3,
                name: 'товар 2',
                price: 3
            },
        ]
    }

    const fn = (state: ApplicationState = defaultState, action: Action): ApplicationState =>  staticSolution
    return fn
}

// epics
const productsLoadEpic: ExampleEpic = (action$, store$, { api }) => action$.pipe(
    ofType('PRODUCTS_LOAD'),
    mergeMap((a: ReturnType<typeof productsLoad>) => {
        return from(api.getProducts()).pipe(
            map(products => productsLoaded(products.data)),
        );
    }),
);

const productDetailsLoadEpic: ExampleEpic = (action$, store$, { api }) => action$.pipe(
    ofType('PRODUCT_DETAILS_LOAD'),
    mergeMap((a: ReturnType<typeof productDetailsLoad>) => {
        return from(api.getProductById(a.id)).pipe(
            map(products => productDetailsLoaded(products.data)),
        );
    }),
);

const shoppingCartEpic: ExampleEpic = (action$, store$, { cart }) => action$.pipe(
    ofType('ADD_TO_CART', 'CLEAR_CART', 'CHECKOUT_COMPLETE'),
    tap(() => {
        if (process.env.BUG_ID !== '6') {
            cart.setState(store$.value.cart)
        }
    }),
    mergeMapTo(EMPTY),
);

const checkoutEpic: ExampleEpic = (action$, store$, { api }) => action$.pipe(
    ofType('CHECKOUT'),
    mergeMap(({ form, cart }: ReturnType<typeof checkout>) => {
        if (process.env.BUG_ID === '5') {
            return EMPTY;
        }

        return from(api.checkout(form, cart)).pipe(
            map(res => checkoutComplete(res.data.id)),
        );
    }),
);

export const rootEpic = combineEpics(
    checkoutEpic,
    shoppingCartEpic,
    productsLoadEpic,
    productDetailsLoadEpic,
);

export function initStore(api: ExampleApi, cart: CartApi) {
    const rootReducer = createRootReducer({
        cart: cart.getState()
    });

    const epicMiddleware = createEpicMiddleware<Action, Action, ApplicationState, EpicDeps>({
        dependencies: { api, cart }
    });

    const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

    epicMiddleware.run(rootEpic);

    return store;
}