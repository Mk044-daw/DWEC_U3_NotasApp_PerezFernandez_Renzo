// DWEC U3 — NotasApp (SPA sin frameworks)C

;(() => {
  // ---------- Estado y constantes ----------
  const ORIGEN = location.origin; // RF7/RF10: política de orígenes
  const LS_CLAVE = "notasapp.estado.v1";  // RF9: localStorage
  const SS_FILTRO = "notasapp.filtro.v1"; // RF9: sessionStorage (filtro de sesión)
  const lang = navigator.language || 'es-ES'; // RF2: idioma del navegador

  const estado = {
    notas: [],            // { id, texto, fecha(YYYY-MM-DD), prioridad(1-3), completada(false) }
    filtro: 'todas',      // 'hoy' | 'semana' | 'todas' (RF3)
    panelRef: null        // referencia a la ventana del panel (RF7)
  };

  // ---------- Utilidades de fechas (RF1: Date) ----------
  const pad = n => String(n).padStart(2, '0'); // RF1: String/Number
  function inicioDeDia(d){ const x=new Date(d); x.setHours(0,0,0,0); return x; } // RF1
  function finDeDia(d){ const x=new Date(d); x.setHours(23,59,59,999); return x; } // RF1
  function hoyYMD(){ const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; } // RF1/RF3
  function ymdToDate(ymd){ return new Date(ymd + "T00:00:00"); } // RF1
  function enRangoIncl(ymd, desde, hasta){
    const x=ymdToDate(ymd); return inicioDeDia(x) <= finDeDia(hasta) && finDeDia(x) >= inicioDeDia(desde);
  } // RF1/RF3
  function formatDate(ymd){
    const d = ymdToDate(ymd);
    try { return new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(d); }
    catch { return d.toLocaleDateString(); }
  } // RF2

  // ---------- Persistencia (RF9: Web Storage) ----------
  function cargar(){
    try {
      const raw = localStorage.getItem(LS_CLAVE);
      if (raw){
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.notas)) {
          estado.notas = parsed.notas.map(sanitizeNota);
        }
      }
    } catch(e){
      console.warn("Persistencia corrupta. Se ignora.", e); // RF12 evidencia
      estado.notas = [];
    }
    const f = sessionStorage.getItem(SS_FILTRO);
    if (f) estado.filtro = f;
  }
  function guardar(){
    try { localStorage.setItem(LS_CLAVE, JSON.stringify({ notas: estado.notas })); }
    catch(e){ console.warn("No se pudo guardar en localStorage", e); } // RF12
  }

  // ---------- Limpieza / validación / orden (RF1, RF5) ----------
  function sanitizeNota(n){
    const id = Number(n.id) || Date.now();
    const texto = String(n.texto||'').trim();
    const fecha = String(n.fecha||'').slice(0,10);
    const prioridad = Math.max(1, Math.min(3, Number(n.prioridad)||2)); // RF5
    const completada = Boolean(n.completada);
    return { id, texto, fecha, prioridad, completada };
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c])); } // RF4
  function ordenarNotas(a,b){
    if (a.completada !== b.completada) return a.completada ? 1 : -1;
    if (b.prioridad !== a.prioridad) return b.prioridad - a.prioridad;
    if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
    return a.texto.localeCompare(b.texto, lang);
  } // RF5

  // ---------- Filtros con location.hash (RF3) ----------
  function aplicarFiltroHash(){
    const hash = (location.hash || '#todas').toLowerCase();
    if (hash === '#hoy') estado.filtro = 'hoy';
    else if (hash === '#semana') estado.filtro = 'semana';
    else estado.filtro = 'todas';
    sessionStorage.setItem(SS_FILTRO, estado.filtro);
    marcarFiltroActivo();
    render();
  }
  function filtrarNotas(notas){
    const hoy = inicioDeDia(new Date());
    const finSemana = finDeDia(new Date(Date.now() + 6*24*60*60*1000));
    if (estado.filtro === 'hoy') {
      const y = hoyYMD();
      return notas.filter(n => n.fecha === y);
    } else if (estado.filtro === 'semana'){
      return notas.filter(n => enRangoIncl(n.fecha, hoy, finSemana));
    }
    return notas;
  }
  function marcarFiltroActivo(){
    document.querySelectorAll('nav button').forEach(b=>{
      const activo = b.getAttribute('data-hash') === '#'+estado.filtro;
      b.classList.toggle('activo', activo);
      b.setAttribute('aria-current', activo ? 'page' : 'false');
    });
    document.getElementById('filtroActual').textContent = estado.filtro;
  }

  // ---------- Generación dinámica del HTML (RF4) ----------
  function render(){
    const ul = document.getElementById('listaNotas');
    ul.innerHTML = '';
    const notas = filtrarNotas([...estado.notas]).sort(ordenarNotas);
    for (const n of notas){
      const li = document.createElement('li');
      li.className = `nota prio-${n.prioridad}` + (n.completada ? ' done' : '');
      li.dataset.id = n.id;

      const contenido = document.createElement('div');
      contenido.innerHTML = `<div>${escapeHtml(n.texto)}</div>
        <div class="nota__meta">${formatDate(n.fecha)} · Prioridad ${n.prioridad}${n.completada?' · Completada':''}</div>`;

      const acciones = document.createElement('div');
      acciones.className = 'nota__acciones';
      const btnDone = document.createElement('button');
      btnDone.textContent = n.completada ? 'Deshacer' : 'Completar';
      btnDone.addEventListener('click', () => toggleCompletar(n.id));

      const btnDel = document.createElement('button');
      btnDel.textContent = 'Borrar';
      btnDel.addEventListener('click', () => borrarNota(n.id));

      acciones.append(btnDone, btnDel);
      li.append(contenido, acciones);
      ul.append(li);
    }
  }

  // ---------- CRUD + feedback (RF4, RF5, RF8, RF9, RF6) ----------
  function crearNota({ texto, fecha, prioridad }){
    const t = String(texto||'').trim();
    const f = String(fecha||'').slice(0,10);
    const p = Math.max(1, Math.min(3, Number(prioridad)||2));

    if (!t) { alert('El texto de la nota no puede estar vacío.'); return; } // RF8
    const d = new Date(f);
    if (!(d instanceof Date) || isNaN(d.getTime())) { alert('La fecha es inválida.'); return; } // RF8

    const nota = sanitizeNota({ id: Date.now(), texto: t, fecha: f, prioridad: p, completada:false });
    estado.notas.push(nota);
    guardar(); render();
    document.getElementById('listaNotas').scrollIntoView({ behavior: 'smooth', block: 'start' }); // RF6
    anunciar(`Nota añadida para ${formatDate(f)} (prioridad ${p}).`); // RF8
    enviarSnapshotPanel(); // RF7/RF10
  }
  function toggleCompletar(id){
    const n = estado.notas.find(x=>x.id==id);
    if (!n) return;
    n.completada = !n.completada;
    guardar(); render();
    anunciar(n.completada ? 'Nota marcada como completada.' : 'Se desmarcó la nota.'); // RF8
    enviarSnapshotPanel(); // RF7/RF10
  }
  function borrarNota(id){
    if (!confirm('¿Seguro que deseas borrar esta nota?')) return; // RF8
    const i = estado.notas.findIndex(x=>x.id==id);
    if (i>=0){
      estado.notas.splice(i,1);
      guardar(); render();
      anunciar('Nota borrada.'); // RF8
      enviarSnapshotPanel();     // RF7/RF10
    }
  }
  function anunciar(msg){ const p = document.getElementById('mensajes'); p.textContent = msg; } // RF8

  // ---------- Viewport / Pantalla completa (RF6) ----------
  async function toggleFullscreen(){
    try{
      if (!document.fullscreenElement){
        await document.documentElement.requestFullscreen();
        document.getElementById('btnFullscreen').setAttribute('aria-pressed','true');
      } else {
        await document.exitFullscreen();
        document.getElementById('btnFullscreen').setAttribute('aria-pressed','false');
      }
    } catch (e){
      alert('El navegador ha bloqueado o no soporta pantalla completa.');
    }
  }

  // ---------- Panel y comunicación (RF7, RF10) ----------
  function abrirPanel(){
    const ref = window.open('panel.html', 'PanelDiario', 'width=480,height=640');
    if (!ref){ alert('El navegador ha bloqueado la ventana emergente. Permite pop-ups.'); return; }
    estado.panelRef = ref;
    setTimeout(enviarSnapshotPanel, 200);
  }
  function snapshotDatos(relevantesSolo=true){
    const base = [...estado.notas];
    const datos = relevantesSolo ? filtrarNotas(base) : base;
    return { tipo: 'SNAPSHOT', ts: Date.now(), filtro: estado.filtro, notas: datos.map(sanitizeNota) };
  }
  function enviarSnapshotPanel(){
    if (!estado.panelRef || estado.panelRef.closed) return;
    try { estado.panelRef.postMessage(snapshotDatos(true), ORIGEN); }
    catch(e){ console.warn('No se pudo enviar snapshot al panel.', e); } // RF12
  }
  window.addEventListener('message', (ev) => {
    if (ev.origin !== ORIGEN) return; // RF7 política de orígenes
    if (!ev.data || typeof ev.data !== 'object') return;
    if (ev.data.tipo === 'BORRADO' && Number.isFinite(Number(ev.data.id))){
      borrarNota(Number(ev.data.id));
    }
  });

  // ---------- Enlace UI e inicialización ----------
  function bindUI(){
    document.getElementById('lang').textContent = lang; // RF2

    document.querySelectorAll('nav button[data-hash]').forEach(btn=>{
      btn.addEventListener('click', ()=>{ location.hash = btn.dataset.hash; });
    }); // RF3
    window.addEventListener('hashchange', aplicarFiltroHash); // RF3

    const form = document.getElementById('formNota'); // RF4/RF5/RF8
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const f = new FormData(form);
      crearNota({ texto: f.get('texto'), fecha: f.get('fecha'), prioridad: f.get('prioridad') });
      form.reset();
      document.getElementById('prioNota').value = '2';
      document.getElementById('fechaNota').value = hoyYMD();
    });

    document.getElementById('btnPanel').addEventListener('click', abrirPanel);       // RF7
    document.getElementById('btnFullscreen').addEventListener('click', toggleFullscreen); // RF6
  }

  document.addEventListener('DOMContentLoaded', () => {
    const inpFecha = document.getElementById('fechaNota');
    if (inpFecha) inpFecha.value = hoyYMD(); // usabilidad

    cargar();            // RF9
    bindUI();
    aplicarFiltroHash(); // RF3
    render();            // RF4
  });
})();
