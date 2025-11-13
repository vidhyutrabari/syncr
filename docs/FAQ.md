# FAQ

**Q: How is this different from TanStack Query/SWR?**  
A: Those focus on **network caching** and data fetching, not multi-source UI state sync.

**Q: What about router state?**  
A: Routers sync a subset (URL) only. Syncr bridges URL + storage (+ server) with conflict resolution.

**Q: How large is the core?**  
A: Lightweight and tree-shakable (tiny core + thin adapters).

**Q: Does it work across tabs?**  
A: Yes—storage channel listens to `storage` events.

**Q: Can I encrypt stored state?**  
A: Roadmap includes an encrypted storage channel; you can also write a custom channel today.

**Q: Any telemetry?**  
A: No. The library is privacy-friendly by default.

**Q: How do I reset to defaults?**  
A: Call `set(defaultValue)`; or clear the query param + storage key.
