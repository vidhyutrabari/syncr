import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useSyncr } from '@syncr/react';
import { z } from 'zod';
import { zodSchema, broadcastChannel } from '@syncr/core';

const FilterSchema = z.object({
  q: z.string().default(''),
  sort: z.enum(['date','name']).default('date'),
  page: z.number().int().min(1).default(1)
});
type Filters = z.infer<typeof FilterSchema>;

const meta: Meta = {
  title: 'Syncr/Filters Demo',
  parameters: { layout: 'centered' }
};
export default meta;
type Story = StoryObj;

function FiltersWidget(){
  const [filters, setFilters] = useSyncr<Filters>({
    key: 'sbFilters',
    defaultValue: { q:'', sort:'date', page:1 },
    channels: ['url', 'storage', broadcastChannel('sbFilters')],
    schema: zodSchema(FilterSchema)
  });

  return (
    <div style={{ fontFamily: 'system-ui', width: 420 }}>
      <h3>Filters (Syncr + Zod)</h3>
      <label>Search: <input value={filters.q} onChange={e=>setFilters(p=>({...p, q:e.target.value, page:1}))}/></label>
      <label style={{marginLeft:12}}>Sort:
        <select value={filters.sort} onChange={e=>setFilters(p=>({...p, sort:e.target.value as any}))}>
          <option value="date">Date</option>
          <option value="name">Name</option>
        </select>
      </label>
      <div style={{marginTop:12}}>
        <button onClick={()=>setFilters(p=>({...p, page: Math.max(1, p.page-1)}))}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {filters.page}</span>
        <button onClick={()=>setFilters(p=>({...p, page: p.page+1}))}>Next</button>
      </div>
      <pre style={{background:'#111', color:'#0f0', padding:12, borderRadius:6, marginTop:16}}>
        {JSON.stringify(filters, null, 2)}
      </pre>
    </div>
  );
}

export const Demo: Story = {
  render: () => <FiltersWidget />
};
