"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "../app/Context/CartContext";
import { useDebounce } from "./useDebounce";

export function useCartSync() {
  const { data: session, status } = useSession();

  const userId = session?.user?._id;
  const userEmail = session?.user?.email;

  // Call useCart correctly — depends on how your context exposes items.
  // If CartContext uses a plain React context (not Zustand), use this:
  console.log(" Debouncing Starts ");

  const { items } = useCart();

  const debouncedItems = useDebounce(items, 1000);

  // Track previous debounced items to avoid re-sending unchanged carts
  const prevItemsRef = useRef(null);

  useEffect(() => {
    // Wait until session is fully loaded
    if (status === "loading") return;
    if (!userId || !userEmail) return;
    if (!debouncedItems || debouncedItems.length === 0) return;

    // Skip if items haven't actually changed
    const serialized = JSON.stringify(debouncedItems);
    if (prevItemsRef.current === serialized) return;
    prevItemsRef.current = serialized;

    console.log("Syncing cart to API:", debouncedItems);

    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        userEmail,
        userName: session?.user?.name || "Customer",
        items: debouncedItems,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(" Cart synced:", data))
      .catch((err) => console.error(" Cart sync failed:", err));
  }, [debouncedItems, userId, userEmail, status]);
}
