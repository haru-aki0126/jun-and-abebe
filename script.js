const dialog=document.querySelector('#detail'),content=document.querySelector('#content');let currentScene='outside';
const sceneLabels={outside:'01 / BY THE SEA',room:'02 / MY LITTLE WORLD',seaview:'03 / SEA & MOMENTS',warmhome:'04 / HOME'};
function showScene(id){if(!sceneLabels[id])return;document.querySelectorAll('main>.scene').forEach(s=>s.hidden=s.id!==id);currentScene=id;document.body.classList.toggle('inside',id!=='outside');document.body.classList.toggle('at-home',id==='warmhome');document.querySelector('#location').textContent=sceneLabels[id];document.querySelector('#'+id).setAttribute('tabindex','-1');document.querySelector('#'+id).focus({preventScroll:true});}
document.querySelector('#enter').onclick=()=>showScene('room');document.querySelector('#outside-link').onclick=()=>showScene('outside');document.querySelector('#home').onclick=()=>showScene('outside');
function openPanel(id){const template=document.getElementById(id);if(!(template instanceof HTMLTemplateElement))return;dialog.classList.toggle('project-dialog',id==='portfolio');content.replaceChildren(template.content.cloneNode(true));document.querySelector('#category').textContent='君 / '+id.toUpperCase();if(!dialog.open)dialog.showModal();dialog.scrollTop=0;if(id==='music')syncMusic();}
document.addEventListener('click',e=>{const scene=e.target.closest('[data-scene]');if(scene)showScene(scene.dataset.scene);const button=e.target.closest('[data-open]');if(button)openPanel(button.dataset.open);if(e.target.closest('#zoom-art'))content.querySelector('.work-detail').classList.toggle('zoomed');});
document.querySelector('#close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>content.replaceChildren());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
const sea=document.querySelector('#seaview');let dragStart=null;
sea.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,.photo-strip'))return;dragStart={x:e.clientX,y:e.clientY};sea.setPointerCapture(e.pointerId);sea.classList.add('dragging');});
sea.addEventListener('pointermove',e=>{if(!dragStart)return;sea.style.setProperty('--drag',Math.max(-65,Math.min(0,e.clientX-dragStart.x))+'px');});
function endDrag(e){if(!dragStart)return;const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;dragStart=null;sea.classList.remove('dragging');sea.style.removeProperty('--drag');if(dx < -60 && Math.abs(dx)>Math.abs(dy))showScene('warmhome');}
sea.addEventListener('pointerup',endDrag);sea.addEventListener('pointercancel',()=>{dragStart=null;sea.classList.remove('dragging');sea.style.removeProperty('--drag');});
document.addEventListener('keydown',e=>{if(dialog.open)return;if(e.target.closest('.photo-strip,.album-controls'))return;if(e.key==='ArrowLeft'&&currentScene==='seaview')showScene('warmhome');else if(e.key==='ArrowRight'&&currentScene==='warmhome')showScene('seaview');});

let momentIndex=0;
const momentCount=42;
function openMoment(index){
 momentIndex=(index+momentCount)%momentCount;
 content.innerHTML='<h1 id="dialog-title" class="moment-title">Little moments</h1><img class="album-full" alt=""><div class="album-paging"><button data-step="-1" aria-label="Previous photo">← Previous</button><button data-step="1" aria-label="Next photo">Next →</button></div>';
 const img=content.querySelector('.album-full');img.src='assets/moments/'+String(momentIndex+1).padStart(2,'0')+'.jpg';img.alt='Moment '+(momentIndex+1);
 document.querySelector('#category').textContent='君 / SEA & MOMENTS';if(!dialog.open)dialog.showModal();
}
document.addEventListener('click',e=>{const m=e.target.closest('[data-moment]');if(m)openMoment(Number(m.dataset.moment));const step=e.target.closest('[data-step]');if(step)openMoment(momentIndex+Number(step.dataset.step));const scroll=e.target.closest('[data-scroll]');if(scroll){const strip=document.querySelector('.photo-strip');strip.scrollBy({left:Number(scroll.dataset.scroll)*strip.clientWidth*.7,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}});
dialog.addEventListener('keydown',e=>{if(!content.querySelector('.album-full'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();openMoment(momentIndex+(e.key==='ArrowRight'?1:-1));}});

// Keep the audio element outside the dialog so closing panels never stops playback.
const backgroundMusic=document.querySelector('#background-music');
function formatTime(seconds){if(!Number.isFinite(seconds))return '0:00';return Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0');}
function syncMusic(){const toggle=document.querySelector('#music-toggle');if(!toggle)return;toggle.textContent=backgroundMusic.paused?'Play':'Pause';const seek=document.querySelector('#music-seek');seek.value=backgroundMusic.duration?backgroundMusic.currentTime/backgroundMusic.duration*100:0;document.querySelector('#music-time').textContent=formatTime(backgroundMusic.currentTime)+' / '+formatTime(backgroundMusic.duration);document.querySelector('#music-volume').value=backgroundMusic.volume;}
for(const event of ['timeupdate','loadedmetadata','play','pause','ended','volumechange'])backgroundMusic.addEventListener(event,syncMusic);
document.addEventListener('click',async e=>{if(!e.target.closest('#music-toggle'))return;if(backgroundMusic.paused){try{await backgroundMusic.play();}catch{const toggle=document.querySelector('#music-toggle');if(toggle)toggle.textContent='Try again';}}else backgroundMusic.pause();});
document.addEventListener('input',e=>{if(e.target.id==='music-seek'&&Number.isFinite(backgroundMusic.duration))backgroundMusic.currentTime=Number(e.target.value)/100*backgroundMusic.duration;if(e.target.id==='music-volume')backgroundMusic.volume=Number(e.target.value);});
