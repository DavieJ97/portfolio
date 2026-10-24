(()=>{
      const observer=new IntersectionObserver(entries=>entries.forEach
        (entry=>
            {
                if(entry.isIntersecting){
                    entry.target.classList.add('visible');
                    entry.target.querySelectorAll('.bar>span').forEach(bar=>bar.style.width=bar.dataset.width||'0');
                    observer.unobserve(entry.target)
                }
            }
        ),{threshold:.14});
      document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
      document.getElementById('year').textContent=new Date().getFullYear();
      const run=document.getElementById('run-request');
      const status=document.getElementById('response-status');
      const body=document.getElementById('response-body');
      const dot=document.getElementById('response-dot');
      run.addEventListener('click',()=>
        {
            run.disabled=true;
            run.textContent='Running…';
            status.textContent='REQUESTING';
            dot.className='h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse';
            body.textContent='Waiting for response…';
            window.setTimeout(()=>
                {
                    status.textContent='200 OK · 18 MS';status.className='mono text-[10px] text-neon';
                    dot.className='h-1.5 w-1.5 rounded-full bg-neon';
                    body.textContent=JSON.stringify(
                        {
                            id:42,
                            title:'Fraction practice pack',
                            status:'ready'
                        },null,2);
                    run.disabled=false;
                    run.textContent='↻ Run again'
                },550)
            });
      document.getElementById('copy-code').addEventListener('click',async event=>
        {
            const button=event.currentTarget,source=document.querySelector('#code-snippet code').innerText;
            try{
                await navigator.clipboard.writeText(source);
                button.textContent='Copied!'
            }
            catch{
                button.textContent='Select to copy'
            }
            window.setTimeout(()=>button.textContent='Copy snippet',1600)
        });
    }
)();