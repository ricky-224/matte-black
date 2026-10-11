"use client";

import { CartProvider } from "@/lib/cart-context";
import { CartFxProvider } from "@/lib/cart-fx";
import { AccountProvider } from "@/lib/account-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      <CartProvider>
        <CartFxProvider>{children}</CartFxProvider>
      </CartProvider>
    </AccountProvider>
  );
}
