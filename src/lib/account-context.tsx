"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

export type Address = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export type Profile = Tables<"profiles">;
export type OrderRow = Tables<"orders">;
export type OrderItemRow = Tables<"order_items">;
export type Order = OrderRow & { order_items: OrderItemRow[] };

export type OrderLineInput = {
  slug: string;
  name: string;
  size?: string;
  quantity: number;
  price: number;
};

type AuthResult =
  | { ok: true; needsEmailConfirmation?: boolean }
  | { ok: false; error: string };

type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

type AccountContextValue = {
  user: User | null;
  profile: Profile | null;
  orders: Order[];
  loading: boolean;
  signUp: (fullName: string, email: string, password: string, phone?: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  updateProfile: (patch: Partial<Pick<Profile, "full_name" | "phone" | "address">>) => Promise<void>;
  placeOrder: (input: { subtotal: number; address: Address; lines: OrderLineInput[] }) => Promise<PlaceOrderResult>;
  cancelOrder: (orderId: number) => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      setProfile(data ?? null);
    },
    [supabase]
  );

  const loadOrders = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setOrders((data as Order[] | null) ?? []);
    },
    [supabase]
  );

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const currentUser = data.user;
      setUser(currentUser);
      if (currentUser) {
        Promise.all([loadProfile(currentUser.id), loadOrders(currentUser.id)]).finally(() => {
          if (active) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        loadProfile(nextUser.id);
        loadOrders(nextUser.id);
      } else {
        setProfile(null);
        setOrders([]);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile, loadOrders]);

  const signUp = useCallback(
    async (fullName: string, email: string, password: string, phone?: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { ok: false, error: error.message };
      if (!data.session) return { ok: true, needsEmailConfirmation: true };
      if (phone && data.user) {
        await supabase.from("profiles").update({ phone }).eq("id", data.user.id);
      }
      return { ok: true };
    },
    [supabase]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const friendly =
          error.message === "Invalid login credentials"
            ? "Incorrect email or password."
            : error.message;
        return { ok: false, error: friendly };
      }
      return { ok: true };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [supabase]
  );

  const updatePassword = useCallback(
    async (password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [supabase]
  );

  const updateProfile = useCallback(
    async (patch: Partial<Pick<Profile, "full_name" | "phone" | "address">>) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", user.id)
        .select()
        .single();
      if (!error && data) setProfile(data);
    },
    [supabase, user]
  );

  const placeOrder = useCallback(
    async ({
      subtotal,
      address,
      lines,
    }: {
      subtotal: number;
      address: Address;
      lines: OrderLineInput[];
    }): Promise<PlaceOrderResult> => {
      if (!user) return { ok: false, error: "Not signed in" };

      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const { data: order, error } = await supabase
        .from("orders")
        .insert({ user_id: user.id, order_number: orderNumber, subtotal, address })
        .select()
        .single();
      if (error || !order) return { ok: false, error: error?.message ?? "Could not place order." };

      const { error: itemsError } = await supabase.from("order_items").insert(
        lines.map((line) => ({
          order_id: order.id,
          slug: line.slug,
          name: line.name,
          size: line.size,
          quantity: line.quantity,
          price: line.price,
        }))
      );
      if (itemsError) return { ok: false, error: itemsError.message };

      await loadOrders(user.id);
      return { ok: true, orderNumber };
    },
    [supabase, user, loadOrders]
  );

  const cancelOrder = useCallback(
    async (orderId: number) => {
      if (!user) return;
      const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
      if (!error) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
        );
      }
    },
    [supabase, user]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      orders,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      placeOrder,
      cancelOrder,
    }),
    [
      user,
      profile,
      orders,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      placeOrder,
      cancelOrder,
    ]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
