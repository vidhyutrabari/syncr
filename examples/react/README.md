# React example (snippet)

```tsx
import { useSyncr } from '@syncr/react';

const defaults = { q:'', sort:'date', page:1 };
export default function App(){
  const [filters, setFilters] = useSyncr({ key:'filters', defaultValue: defaults, channels:['url','storage'] });
  return <input value={filters.q} onChange={e=>setFilters(f=>({...f, q:e.target.value}))} />;
}
```
