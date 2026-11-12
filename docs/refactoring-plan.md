# План улучшения кода (DRY / KISS / SOLID)

Составлен 2026-11-12 по результатам анализа кода. Отмечайте пункты `[x]` по мере выполнения.
Каждый шаг — отдельный небольшой PR с зелёным `npm run check`.

Порядок: Этап 0 → Этап 1 → `useCart`/`useWishList` и единый `useAsync` → остальной DRY → SOLID → чистка.

## Этап 0. Инструменты — выполнен (ветка `chore/tooling`)

- [x] Prettier (`singleQuote`, `printWidth: 120`) + `eslint-config-prettier`, разовое форматирование проекта
- [x] ESLint: `recommendedTypeChecked` + `jsx-a11y`
- [x] husky + lint-staged (pre-commit: ESLint и Prettier на изменённых файлах)
- [x] `@vitest/coverage-v8`, порог чуть ниже текущего покрытия (~47%)
- [x] GitHub Actions CI, Dependabot
- [x] Алиас `@/` → `src/` (старые импорты не переписаны)
- [x] knip (в CI не блокирует до Этапа 4)
- [x] `scripts/check-i18n.mjs` — сверка ключей en/uk; добавлен недостающий `uk: navigation.category`
- [x] Типы `import.meta.env` (`src/vite-env.d.ts`); лишний блок `test` удалён из `vite.config.ts`
- [x] `npm audit fix`: 31 → 11 уязвимостей. Остаток ждёт исправлений у разработчиков пакетов: `@grpc/grpc-js` — внутри firebase, `minimatch` — в typescript-eslint
- Не сделано сознательно: строгая типизация ключей i18next — ключи товаров динамические (`t(product.name)`)

**Долг, отложенный в ESLint:** часть правил в `eslint.config.js` стоит в `warn` с пометкой этапа.
После выполнения этапа переведите соответствующие правила обратно в `error`.

## Этап 1. Баги

- [ ] **Тест падает по памяти.** `src/hooks/useOrders.test.ts`: мок `useTranslation` отдаёт новую `t` на каждый рендер, а эффект в `useOrders` зависит от `[user, t]` и при пустом пользователе вызывает `setOrders([])` — бесконечный цикл. Исправить мок (стабильная `t`) и зависимости (`user?.email`). **Из-за этого CI красный.**
- [ ] **Два разных ключа пользователя.** `Register.tsx` пишет профиль в `users/{uid}`, всё остальное читает `users/{email}`. Login и Register ходят в Firebase напрямую, а `signUp`/`logIn` из `AuthContext` не используются. Перевести страницы на `AuthContext`, профиль писать через `dbService` по email.
- [ ] **Изменения не сохраняются в Firestore.** Избранное и корзина на `ProductPage.tsx` и «в корзину» в `WishList.tsx` меняют только Redux; у залогиненного пользователя следующий снапшот их затирает.
- [ ] **Скидка показывается не везде.** `ProductPage`, `WishList`, `SearchResultItem` выводят `price`, корзина считает по `discountPrice`. Использовать компонент `ProductPrice`.
- [ ] **Нет отката при ошибке.** `useFirestore` сам ловит ошибку, поэтому `useAsync` в `Cart.tsx` её не видит, а оптимистичное обновление Redux при сбое не откатывается.
- [ ] `ProfileTab.tsx`: сохранение без `try/finally` — кнопка зависает в «saving» при ошибке загрузки аватара.
- [ ] `OrdersTab.tsx`: падение на неизвестном статусе заказа.
- [ ] Захардкоженный английский: Login, Register (тосты, ссылки), `ErrorElement.tsx`, сообщения схемы в `useCheckout.ts`.

## Этап 2. DRY

- [ ] Обработчик Enter/Space (12 мест): заменить `div/span/li role="button"` на `<button>` и `<Link>`
- [ ] «dispatch + запись в Firestore» в ProductItem, ProductPage, WishList, Cart → хуки `useCart()` и `useWishList()`
- [ ] `discountPrice ?? price` (7 мест) и строка `UAH` (15 мест) → `getEffectivePrice()`, `formatPrice()`, компонент `ProductPrice`
- [ ] `withErrorHandling` в useFirestore, useUserProfile, useAsync, Header, MobileMenu → один `useAsync`
- [ ] Header и MobileMenu: переключатель темы, кнопки авторизации, logout → `ThemeToggle`, `AuthButtons`, logout в `useHeaderNav`
- [ ] Regex телефона и схема адреса (AddressesTab, ProfileTab, useCheckout) → `src/schemas/`
- [ ] Бесконечная прокрутка (Products, Promotions) → хук `useInfiniteScroll`
- [ ] Login и Register почти идентичны → общий `AuthPage`
- [ ] `useSelector((state: RootState) => …)` (20 мест) → типизированные `useAppSelector`, `useAppDispatch`
- [ ] Карта редьюсеров в `store.ts` и `test/testStore.ts` → один `rootReducer` и `setupStore(preloadedState)`
- [ ] CartEmpty, WishListEmpty → `EmptyState`; SVG сердца на ProductPage → `FavoriteButton`
- [ ] Вкладки Account, шаги Checkout, варианты оплаты в PaymentStep → массив и `map`

## Этап 3. SOLID

- [ ] **SRP:** разделить `dbService.ts` на модули пользователей, заказов и товаров
- [ ] **SRP:** флаг `isSearchModalOpen` из слайса `search` → локальный стейт
- [ ] **SRP:** `useCheckout.ts` — это схема, а не хук; переименовать или перенести
- [ ] **DIP:** убрать прямой доступ к Firebase из компонентов (Login, Register, ProfileTab → Storage, Cart → `dbService`)
- [ ] **Типы:** `updateUserData(data: object)` → `Partial<IUserDocument>`; `PayloadAction` во всех слайсах; Firestore converters вместо `DocumentData`
- [ ] **Типы:** объединения `'card' | 'cash' | 'paypal'`, `SortBy`, статус загрузки объявлены по 2–3 раза → вынести в `types.ts`
- [ ] **Именование:** `UserAuth` → `useAuth` (иначе rules-of-hooks его не проверяет)
- [ ] **Один источник данных:** `useUserProfile` и `useFirestoreSync` открывают отдельные подписки на один документ; `subscribeToProfile` и `subscribeToUser` дублируют друг друга

## Этап 4. KISS и мёртвый код

- [ ] Удалить: `pages/Admin/Admin.tsx`, `uploadData.ts`, экспорт `goods` в `mockedData.ts`, `ICategory`, `ISubCategory`, `zipCode`, проп `text` у Button, обёртку `routes/ErrorRoute.tsx`, `components/ui/Select` (используется только в своём тесте). После этого включить knip в CI как блокирующий
- [ ] `isHovered` в `ProductItem` → CSS `:hover`
- [ ] Убрать искусственную задержку 800 мс в `Promotions.tsx`
- [ ] `checkout.isProcessing` в Redux дублирует `loading` из `useAsync`
- [ ] `statusConfig` в OrdersTab сводится к `status-${key}`; лишние `t('key') || 'fallback'`
- [ ] Категорию брать из `useParams`, а не копировать в Redux
- [ ] Производительность: каждый `ProductItem` подписан на весь список избранного и корзины → селектор по `id`

## Обсудить отдельно (нужна миграция данных в Firestore)

- Опечатки в модели: `raiting`, `imsrcOfImg`
- Документы пользователей с ключом по email вместо `uid`
- Корзина хранит полные объекты товаров — цены устаревают
- В репозитории нет `firestore.rules`, а сумма заказа считается на клиенте
