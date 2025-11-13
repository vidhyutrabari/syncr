import React from 'react';
import { useSyncr } from '@syncr/react';
import { apiChannel, enableSyncrConsoleDevtools, tapChannel, storageEncryptedChannel, broadcastChannel } from '@syncr/core';

type Filters = { q:string; sort:'date'|'name'; page:number };
const defaults: Filters = { q:'', sort:'date', page:1 };

export default function App(){
const [useServer, setUseServer] = React.useState(false);
const [devtools, setDevtools] = React.useState(false);
  const [encrypted, setEncrypted] = React.useState(false);
  const [broadcast, setBroadcast] = React.useState(false);

const channels = React.useMemo(() => {
  const list: any[] = ['url'];
        if (encrypted) { list.push(storageEncryptedChannel<Filters>('filters', { passphrase: 'demo-pass' })); } else { list.push('storage'); }
  if (useServer) list.push(apiChannel<Filters>('filters', { baseUrl: 'http://localhost:4321' }));
        if (broadcast) list.push(broadcastChannel<Filters>('filters'));
  return devtools ? list.map(ch => typeof ch === 'string' ? ch : tapChannel(ch)) : list;
  }, [useServer, devtools]);

  const [filters, setFilters] = useSyncr<Filters>({
    key: 'filters',
    defaultValue: defaults,
    channels,
    debounceMs: 200
  });

  const onQ = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setFilters(prev => ({ ...prev, q, page: 1 }));
  };

  const onSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value as Filters['sort'];
    setFilters(prev => ({ ...prev, sort }));
  };

  const nextPage = () => setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  const prevPage = () => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
<label style={{display:'block'}}><input type='checkbox' checked={useServer} onChange={e=>setUseServer(e.target.checked)} /> Sync with Server</label>
<label style={{display:'block'}}><input type='checkbox' checked={devtools} onChange={e=>{setDevtools(e.target.checked); if(e.target.checked) enableSyncrConsoleDevtools();}} /> Enable DevTools logging</label>
<label style={{display:'block'}}><input type='checkbox' checked={encrypted} onChange={e=>setEncrypted(e.target.checked)} /> Encrypted storage</label>
<label style={{display:'block'}}><input type='checkbox' checked={broadcast} onChange={e=>setBroadcast(e.target.checked)} /> Cross-tab Broadcast</label>
      <h1>Syncr React Demo</h1>
      <p>Try typing in the search box, changing sort, and paging. Refresh the page or copy the URL to see state persistence via URL + localStorage.</p>

      <label>
        Search: <input value={filters.q} onChange={onQ} placeholder="Type to search..." />
      </label>
      <label style={{ marginLeft: 12 }}>
        Sort:
        <select value={filters.sort} onChange={onSort}>
          <option value="date">Date</option>
          <option value="name">Name</option>
        </select>
      </label>

      <div style={{ marginTop: 12 }}>
        <button onClick={prevPage} disabled={filters.page===1}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {filters.page}</span>
        <button onClick={nextPage}>Next</button>
      </div>

      <pre style={{ background:'#111', color:'#0f0', padding:12, borderRadius:6, marginTop:16 }}>
        {JSON.stringify(filters, null, 2)}
      </pre>
    </div>
  );
}
